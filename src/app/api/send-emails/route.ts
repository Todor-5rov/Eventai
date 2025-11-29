import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { getServiceSupabase } from '@/lib/supabase';

interface EmailPreview {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  subject: string;
  content: string;
  hasAttachment: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, emailPreviews } = await request.json();
    const previews = emailPreviews as EmailPreview[];

    const supabase = getServiceSupabase();

    // Get event data with organizer and files
    const { data: eventData, error: eventError } = await supabase
      .from('event_requests')
      .select(`
        *,
        profiles!event_requests_organizer_id_fkey (
          full_name,
          id
        ),
        event_files (*)
      `)
      .eq('id', eventId)
      .single();

    if (eventError || !eventData) {
      throw new Error('Event not found');
    }

    const organizerProfile = eventData.profiles as any;
    const organizerEmail = (await supabase.auth.admin.getUserById(organizerProfile.id)).data.user?.email;

    if (!organizerEmail) {
      throw new Error('Organizer email not found');
    }

    // Setup Gmail OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    // Get access token
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER_EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    } as any);

    const sentEmails = [];

    // Send emails to each partner
    for (const preview of previews) {
      try {
        const mailOptions: any = {
          from: process.env.GMAIL_USER_EMAIL,
          to: preview.partnerEmail,
          replyTo: organizerEmail, // Critical: Partner replies go to organizer
          subject: preview.subject,
          text: preview.content,
          html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
            ${preview.content.replace(/\n/g, '<br>')}
          </div>`,
        };

        // Add attachments if this is a merchandise email
        if (preview.hasAttachment && eventData.event_files && eventData.event_files.length > 0) {
          mailOptions.attachments = await Promise.all(
            eventData.event_files.map(async (file: any) => {
              // Fetch file from Supabase Storage
              const response = await fetch(file.file_url);
              const buffer = await response.arrayBuffer();
              
              return {
                filename: file.file_name,
                content: Buffer.from(buffer),
                contentType: file.mime_type,
              };
            })
          );
        }

        const info = await transporter.sendMail(mailOptions);

        // Record the inquiry in database
        const { error: inquiryError } = await supabase
          .from('event_inquiries')
          .insert({
            event_request_id: eventId,
            partner_id: preview.partnerId,
            email_subject: preview.subject,
            email_content: preview.content,
            status: 'sent',
            gmail_message_id: info.messageId,
            has_attachment: preview.hasAttachment,
          });

        if (inquiryError) {
          console.error('Error recording inquiry:', inquiryError);
        }

        sentEmails.push({
          partnerId: preview.partnerId,
          partnerName: preview.partnerName,
          messageId: info.messageId,
        });
      } catch (emailError) {
        console.error(`Error sending email to ${preview.partnerEmail}:`, emailError);
        // Continue with other emails even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      sentCount: sentEmails.length,
      sentEmails,
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send emails' },
      { status: 500 }
    );
  }
}

