# EventAI - Setup Instructions

Complete setup guide for the EventAI platform.

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```

## Detailed Setup

### 1. Prerequisites

Install these before starting:
- Node.js 18+ ([download](https://nodejs.org/))
- npm or yarn
- A code editor (VS Code recommended)
- Git

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/eventai.git
cd eventai

# Install dependencies
npm install
```

### 3. Set Up Supabase

**Required for: Database, Authentication, File Storage**

Follow the detailed guide: [docs/supabase-setup.md](docs/supabase-setup.md)

Quick steps:
1. Create project at [supabase.com](https://supabase.com)
2. Run the SQL migration (`supabase-schema.sql`)
3. Create storage bucket named `event-files`
4. Copy API keys to `.env`

### 4. Set Up Gmail API

**Required for: Sending emails to partners**

Follow the detailed guide: [docs/gmail-setup.md](docs/gmail-setup.md)

Quick steps:
1. Create project in Google Cloud Console
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Generate refresh token
5. Add credentials to `.env`

### 5. Get OpenAI API Key

**Required for: AI-generated email content**

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Add to `.env` as `OPENAI_KEY`

### 6. Configure Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
# Supabase (from step 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE=eyJhbGc...

# OpenAI (from step 5)
OPENAI_KEY=sk-...

# Gmail API (from step 4)
GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxxxx
GMAIL_REFRESH_TOKEN=xxxxx
GMAIL_USER_EMAIL=notifications@your-app.com
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Test the Application

#### Create Test Users

1. **Register as Organizer:**
   - Go to homepage
   - Click "I'm an Organizer"
   - Fill in registration form
   - Email: `organizer@test.com`
   - Password: `password123`

2. **Register as Partner:**
   - Open in incognito window
   - Click "I'm a Partner"
   - Fill in:
     - Company: "Test Venue Sofia"
     - Service Type: Venue
     - City: Sofia
     - Email: `partner@test.com`

#### Create Test Event

1. Login as organizer
2. Click "Create New Event Request"
3. Fill in event basics:
   - Name: "Annual Conference 2024"
   - Type: Conference
   - Attendees: 100
   - Date: (future date)
   - City: Sofia
4. Select the test venue
5. Skip or select other services
6. Review and send

#### Check Email

The partner should receive an email at the Gmail account you configured!

## Common Issues

### "Failed to fetch" error

**Problem:** Can't connect to Supabase

**Solution:**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify internet connection
- Check Supabase project is active

### Email sending fails

**Problem:** Gmail API errors

**Solution:**
- Verify all Gmail env variables are set
- Check refresh token hasn't expired
- Ensure Gmail API is enabled
- Check daily sending limit (500/day)

### File upload fails

**Problem:** Can't upload files

**Solution:**
- Verify `event-files` bucket exists in Supabase
- Check storage policies are set
- Ensure bucket is public
- Check file size < 5MB

### OpenAI errors

**Problem:** Email generation fails

**Solution:**
- Verify `OPENAI_KEY` is valid
- Check API credits/billing
- Ensure model access (gpt-4)

## Development Tips

### Hot Reload

The dev server supports hot reload:
- Edit any file
- Save
- Browser refreshes automatically

### View Database

Access Supabase Studio:
1. Go to your Supabase project
2. Click "Table Editor"
3. Browse tables and data

### Test Email Templates

Test email generation without sending:
1. Create event request
2. Select partners
3. View email previews
4. Click back instead of send

### Debug Mode

Enable verbose logging:
```typescript
// In any file
console.log('Debug:', data);
```

View logs:
- Browser: DevTools Console (F12)
- Server: Terminal running `npm run dev`

## File Structure

```
eventai/
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── page.tsx         # Landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration
│   │   ├── dashboard/       # Dashboards
│   │   └── api/            # API routes
│   ├── components/          # React components
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
├── docs/                    # Documentation
├── public/                  # Static files
├── supabase-schema.sql     # Database schema
├── package.json            # Dependencies
└── .env                    # Environment variables
```

## Next Steps

After setup is complete:

1. **Customize branding:**
   - Update logo and colors in `tailwind.config.ts`
   - Edit text in landing page (`src/app/page.tsx`)

2. **Add partners:**
   - Register several test partners
   - Different cities and service types
   - Test the partner selection flow

3. **Deploy to production:**
   - See [docs/deployment.md](docs/deployment.md)
   - Deploy to Vercel
   - Set up custom domain

4. **Monitor usage:**
   - Track email sending quota
   - Monitor database size
   - Watch for errors in logs

## Getting Help

### Documentation

- [Supabase Setup](docs/supabase-setup.md)
- [Gmail API Setup](docs/gmail-setup.md)
- [Deployment Guide](docs/deployment.md)

### Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Gmail API Docs](https://developers.google.com/gmail/api)

### Support

If you encounter issues:
1. Check the documentation above
2. Review error messages carefully
3. Test with minimal configuration
4. Check environment variables are set correctly

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Success Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database migrated
- [ ] Storage bucket created
- [ ] Gmail API configured
- [ ] OpenAI API key added
- [ ] All env variables set
- [ ] Dev server running
- [ ] Test organizer created
- [ ] Test partner created
- [ ] Test event created
- [ ] Email sent successfully

✅ Setup complete! You're ready to start developing.

