import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { EventRequest, Partner } from '@/types/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { event, partner, serviceType } = await request.json();

    const eventData = event as EventRequest;
    const partnerData = partner as Partner;

    // Create a detailed prompt for OpenAI
    const prompt = `Generate a professional, personalized email inquiry for an event.

Event Details:
- Event Name: ${eventData.event_name}
- Event Type: ${eventData.event_type}
- Date: ${eventData.event_date}
- Attendees: ${eventData.attendees}
- City: ${eventData.city}
- Budget: ${eventData.budget ? `$${eventData.budget}` : 'Not specified'}
${eventData.additional_notes ? `- Additional Notes: ${eventData.additional_notes}` : ''}

Partner Information:
- Company: ${partnerData.company_name}
- Service Type: ${partnerData.service_type}
- Contact: ${partnerData.contact_name}

The email should:
1. Be professional and courteous
2. Clearly state the event requirements
3. Ask for availability and pricing
4. Mention that they can reply directly to this email
5. Be concise (200-300 words)
6. Have a warm, professional tone
${serviceType === 'merchandise' ? '7. Mention that design files are attached' : ''}

Generate both:
1. Email subject line (short and descriptive)
2. Email body

Format your response as:
SUBJECT: [subject line]

BODY:
[email body]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional event planner who writes clear, concise, and friendly business emails.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content || '';
    
    // Parse the response
    const subjectMatch = response.match(/SUBJECT:\s*(.+)/);
    const bodyMatch = response.match(/BODY:\s*([\s\S]+)/);

    const subject = subjectMatch ? subjectMatch[1].trim() : `Inquiry: ${eventData.event_name}`;
    const content = bodyMatch ? bodyMatch[1].trim() : response;

    return NextResponse.json({ subject, content });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}

