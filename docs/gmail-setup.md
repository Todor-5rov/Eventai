# Gmail API Setup Guide

This guide will help you set up the Gmail API for sending automated event inquiry emails.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "EventAI Email Service")
4. Click "Create"

## Step 2: Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: EventAI
   - User support email: Your email
   - Developer contact: Your email
4. Choose "Web application" as application type
5. Add authorized redirect URI: `https://developers.google.com/oauthplayground`
6. Click "Create"
7. Save your **Client ID** and **Client Secret**

## Step 4: Generate Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In the left panel, find "Gmail API v1"
6. Select `https://mail.google.com/` (full Gmail access)
7. Click "Authorize APIs"
8. Sign in with your Google account (the one you want to send emails from)
9. Click "Allow"
10. Click "Exchange authorization code for tokens"
11. Copy the **Refresh Token**

## Step 5: Add to Environment Variables

Add these to your `.env` file:

```bash
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REFRESH_TOKEN=your_refresh_token_here
GMAIL_USER_EMAIL=your-email@gmail.com
```

## Important Notes

### Daily Sending Limits

- **Standard Gmail Account**: 500 emails per 24 hours
- **Google Workspace Account**: 2,000 emails per 24 hours

To increase limits, consider upgrading to Google Workspace.

### Security Best Practices

1. **Never commit** your `.env` file to version control
2. Store credentials securely in your hosting platform's environment variables
3. Use a dedicated email account for sending (not your personal account)
4. Regularly monitor your Google Account activity

### Testing

Before going live, test with a small number of emails to ensure:
- Emails are being sent successfully
- Reply-To headers are working correctly
- Attachments are included when needed
- Emails aren't going to spam folders

### Troubleshooting

**"Invalid credentials" error:**
- Verify your Client ID, Client Secret, and Refresh Token are correct
- Make sure you've enabled the Gmail API
- Check that your OAuth consent screen is configured

**"Daily user sending quota exceeded":**
- You've hit the daily limit (500 for Gmail, 2000 for Workspace)
- Wait 24 hours or upgrade to Google Workspace

**Emails going to spam:**
- Add SPF and DKIM records to your domain
- Warm up your sending domain gradually
- Ensure email content is not spammy

## Alternative: Using a Service Account (Advanced)

For higher volume sending, consider using:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

These services offer higher limits and better deliverability tracking.

## Support

For more information, see:
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

