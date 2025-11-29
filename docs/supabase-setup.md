# Supabase Setup Guide

This guide will help you set up Supabase for the EventAI platform.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: eventai
   - Database password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"
6. Wait for the project to initialize (2-3 minutes)

## Step 2: Get Your API Keys

1. In your project dashboard, click "Settings" (gear icon)
2. Click "API" in the left sidebar
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE`

## Step 3: Add to Environment Variables

Create a `.env` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here
OPENAI_KEY=your_openai_key_here

# Gmail API (see gmail-setup.md)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_USER_EMAIL=notifications@your-app.com
```

## Step 4: Run Database Migrations

1. In Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run"

This will create:
- All necessary tables (profiles, partners, event_requests, etc.)
- Row Level Security policies
- Indexes for performance
- Triggers for timestamp updates

## Step 5: Set Up Storage Bucket

1. In Supabase dashboard, click "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Name it: `event-files`
4. Make it **public** (so uploaded files can be accessed)
5. Click "Create bucket"

### Set Storage Policies

Click on the `event-files` bucket, then "Policies":

1. **Upload policy:**
```sql
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-files');
```

2. **Download policy:**
```sql
CREATE POLICY "Anyone can download files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-files');
```

## Step 6: Configure Authentication

1. Click "Authentication" in the left sidebar
2. Click "Settings"
3. Under "Email Auth", ensure "Enable Email Signup" is checked
4. Configure your email templates if desired

## Step 7: Test the Connection

In your Next.js app, run:

```bash
npm run dev
```

Try to:
1. Register a new account
2. Log in
3. Check if the profile is created in the database

## Database Structure

The schema includes these main tables:

- **profiles**: User accounts (extends Supabase auth.users)
- **partners**: Service provider information
- **event_requests**: Event details from organizers
- **event_files**: Uploaded files (logos, designs)
- **event_inquiries**: Email tracking and history
- **event_selected_partners**: Many-to-many relationship

## Security Notes

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only view their own data
- Organizers can't see partner data
- Partners can only see inquiries sent to them

### Service Role Key

⚠️ **CRITICAL**: Never expose `SUPABASE_SERVICE_ROLE` in frontend code!

- This key bypasses all RLS policies
- Only use it in API routes or server-side code
- Store it securely in environment variables

## Backup and Maintenance

### Automatic Backups

Supabase automatically backs up your database:
- Free tier: Daily backups for 7 days
- Pro tier: Daily backups for 30 days

### Manual Backup

To create a manual backup:
1. Go to "Database" → "Backups"
2. Click "Create backup"

## Monitoring

Monitor your usage:
1. Go to "Settings" → "Usage"
2. Check:
   - Database size
   - Bandwidth usage
   - Storage usage
   - API requests

Free tier limits:
- 500MB database
- 1GB file storage
- 2GB bandwidth per month

## Troubleshooting

**"Failed to fetch" error:**
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Ensure you're using the correct API keys
- Check if RLS policies are blocking the query

**Authentication not working:**
- Verify email auth is enabled
- Check if user exists in `auth.users` table
- Ensure profile is created in `profiles` table

**Storage upload fails:**
- Verify the `event-files` bucket exists
- Check storage policies are set correctly
- Ensure file size is within limits

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

