# Deployment Guide

This guide covers deploying EventAI to production.

## Prerequisites

- A Vercel account (recommended for Next.js)
- Supabase project set up
- Gmail API credentials configured
- OpenAI API key

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/eventai.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework: Next.js (auto-detected)
   - Root directory: ./
   - Build command: `npm run build`
   - Output directory: .next

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# OpenAI
OPENAI_KEY=your_openai_key

# Gmail API
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_USER_EMAIL=notifications@your-app.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Option 2: Deploy to Other Platforms

### Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### AWS Amplify

1. Connect GitHub repository
2. Add build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
3. Add environment variables
4. Deploy

## Post-Deployment Checklist

### 1. Test Authentication

- [ ] Register as organizer
- [ ] Register as partner
- [ ] Login/logout
- [ ] Session persistence

### 2. Test Event Creation

- [ ] Create event request
- [ ] Upload files
- [ ] Select partners
- [ ] Review page loads

### 3. Test Email Sending

- [ ] Generate email previews
- [ ] Send test emails
- [ ] Verify Reply-To headers
- [ ] Check attachments

### 4. Test Partner Dashboard

- [ ] View inquiries
- [ ] Check email content display
- [ ] Verify organizer information

### 5. Security Checks

- [ ] Verify RLS policies work
- [ ] Test unauthorized access attempts
- [ ] Check API routes require authentication
- [ ] Ensure service role key is not exposed

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for:
- Page views
- Performance metrics
- User behavior

### Supabase Monitoring

Monitor in Supabase dashboard:
- Database size
- API requests
- Active users
- Storage usage

### Gmail API Quota

Monitor Gmail sending:
- Track daily email count
- Set up alerts near limits
- Consider upgrading if needed

## Performance Optimization

### 1. Enable Caching

Vercel automatically caches:
- Static pages
- API responses
- Images

### 2. Optimize Images

Use Next.js Image component:
```tsx
import Image from 'next/image'

<Image src="/logo.png" width={200} height={50} alt="Logo" />
```

### 3. Enable Compression

Vercel automatically compresses:
- HTML
- CSS
- JavaScript

### 4. Database Indexes

Already configured in schema:
- City + service type for partners
- Organizer ID for events
- Partner ID for inquiries

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Database connections > 60% of limit
- API response time > 1 second
- Daily emails approaching 400+
- Storage > 80% of quota

### Scaling Options

**Supabase:**
- Free: 500MB database, 2GB bandwidth
- Pro ($25/mo): 8GB database, 50GB bandwidth
- Team ($599/mo): 100GB database, 250GB bandwidth

**Gmail API:**
- Standard Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day
- Consider SendGrid/Mailgun for > 2,000/day

**Vercel:**
- Hobby: Free for personal projects
- Pro ($20/mo): Higher limits, analytics
- Enterprise: Custom limits

## Backup Strategy

### Database Backups

Supabase handles automatic backups:
- Daily automated backups
- Point-in-time recovery (Pro+)

### Manual Backups

Schedule weekly manual backups:
1. Export SQL from Supabase
2. Download storage bucket files
3. Store in secure location

### Code Backups

GitHub automatically backs up code:
- Push regularly
- Tag releases
- Use branches for features

## Troubleshooting

### Build Fails

Check Vercel logs for:
- Missing environment variables
- TypeScript errors
- Missing dependencies

Fix:
```bash
# Test build locally
npm run build

# Check for errors
npm run lint
```

### Email Sending Fails

Check:
- Gmail API credentials
- Daily quota usage
- Refresh token validity

### Database Connection Issues

Check:
- Supabase URL is correct
- RLS policies configured
- Connection pooling settings

## Security Updates

### Regular Maintenance

1. Update dependencies monthly:
```bash
npm outdated
npm update
```

2. Check for security vulnerabilities:
```bash
npm audit
npm audit fix
```

3. Monitor Dependabot alerts on GitHub

### Environment Variables

Never commit `.env` to version control:
- Add to `.gitignore` (already done)
- Use Vercel environment variables
- Rotate keys periodically

## Support and Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Gmail API Documentation](https://developers.google.com/gmail/api)

## Getting Help

If you encounter issues:
1. Check error logs in Vercel
2. Review Supabase logs
3. Test locally with production env vars
4. Check GitHub issues for similar problems

