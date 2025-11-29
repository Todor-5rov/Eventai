# EventAI - Automated Event Planning Platform

An intelligent event planning platform that automates outreach to venues, caterers, and other service providers using AI-generated emails via Gmail API.

## Features

- **Dual User Types**: Organizers and Partners (service providers)
- **Automated Email Outreach**: Send customized inquiries to multiple partners
- **AI-Generated Content**: OpenAI creates personalized email content
- **File Attachments**: Upload logos/documents for merchandise requests
- **Real-time Dashboard**: Track event requests and responses
- **Gmail API Integration**: Sends emails with proper Reply-To headers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Email**: Gmail API with OAuth2
- **AI**: OpenAI GPT-4
- **File Storage**: Supabase Storage

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:
   - Supabase URL and keys
   - OpenAI API key
   - Gmail API OAuth2 credentials

3. Run database migrations (see `supabase-schema.sql`)

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Gmail API Setup

To use the Gmail API for sending emails:

1. Create a project in Google Cloud Console
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Generate a refresh token using the OAuth playground
5. Add credentials to `.env`

See `docs/gmail-setup.md` for detailed instructions.

## Daily Limits

- Standard Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day
- File size limit: 5MB per file, max 3 files

## License

MIT

