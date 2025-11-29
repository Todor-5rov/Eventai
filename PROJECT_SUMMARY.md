# EventAI - Project Summary

## Overview

EventAI is a comprehensive event planning automation platform that connects event organizers with service providers (venues, caterers, merchandise companies, and sponsors) through AI-powered email outreach.

## Key Features Implemented

### 1. Dual User System
- **Organizers**: Create events and send automated inquiries
- **Partners**: Receive inquiries and respond via email

### 2. Authentication & User Management
- Email/password authentication via Supabase
- Separate registration flows for organizers and partners
- Protected dashboards with role-based access
- Session persistence and secure logout

### 3. Event Creation (Multi-Step Form)
- **Step 1**: Event basics (name, type, date, attendees, budget, city)
- **Step 2**: Venue selection (filtered by city)
- **Step 3**: Catering services (optional)
- **Step 4**: Merchandise/printing with file uploads
- **Step 5**: Sponsor selection (optional)
- **Step 6**: Additional details and notes
- **Step 7**: Review and confirmation

### 4. File Upload System
- Drag-and-drop interface using react-dropzone
- Upload to Supabase Storage
- 5MB per file limit, max 3 files
- Support for images and PDFs
- Files automatically attached to merchandise inquiries

### 5. AI-Powered Email Generation
- OpenAI GPT-4 integration
- Personalized email content for each partner
- Dynamic subject lines
- Context-aware based on event details
- Professional tone and formatting

### 6. Gmail API Integration
- OAuth2 authentication
- Central relay model (one sender account)
- Reply-To header points to organizer
- Automatic file attachment handling
- Message ID tracking
- Daily limit monitoring (500/day standard, 2000/day workspace)

### 7. Organizer Dashboard
- View all event requests
- Track status (draft, sent, completed, cancelled)
- See contacted partners
- Event details and inquiry history
- Create new event requests

### 8. Event Detail Pages
- Complete event information
- Attached files display
- List of contacted partners
- Status tracking
- Timeline of actions

### 9. Confirmation Flow
- Email preview before sending
- Edit capability
- Send confirmation page
- Success tracking with partner list
- Clear next steps

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind
- **State Management**: React hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API Routes**: Next.js API routes
- **Email**: Gmail API with OAuth2
- **AI**: OpenAI GPT-4

### Database Schema

**Tables:**
1. `profiles` - User accounts (organizer/partner)
2. `partners` - Service provider details
3. `event_requests` - Event information
4. `event_files` - Uploaded files
5. `event_inquiries` - Email tracking
6. `event_selected_partners` - Partner selections

**Security:**
- Row Level Security (RLS) on all tables
- User-scoped queries
- Service role for admin operations
- Secure file storage

### API Routes

1. `/api/generate-email` - OpenAI email generation
2. `/api/send-emails` - Gmail API email sending

## User Flows

### Organizer Flow
1. Register → Login
2. Create Event Request (7-step form)
3. Select Partners (by service type and city)
4. Upload Files (if needed)
5. Review Email Previews
6. Send Inquiries
7. View Confirmation
8. Track Responses (via email)

### Partner Flow
1. Register with business details
2. Login
3. View Dashboard
4. Receive Email Inquiries
5. Review Event Details
6. Reply via Email (direct to organizer)

## Email System Architecture

### Central Relay Model
- Single Gmail account sends all emails
- From: `notifications@your-app.com`
- Reply-To: Organizer's actual email
- Partners see organizer email when replying

### Email Content
- AI-generated subject and body
- Personalized per partner
- Includes event details
- Professional formatting
- File attachments for merchandise

### Tracking
- Message ID storage
- Status updates (sent, opened, replied)
- Timestamp recording
- Attachment tracking

## Security Features

### Authentication
- Secure password hashing (Supabase)
- Session tokens
- Protected routes
- Auto-redirect for unauthorized access

### Data Protection
- Row Level Security policies
- User-scoped queries
- Service role restricted to API routes
- Environment variables for secrets

### File Security
- Public bucket with controlled access
- File size limits
- Type validation
- Secure URLs

## Performance Optimizations

### Database
- Indexed columns (city, service_type, user_id)
- Efficient queries with joins
- Connection pooling

### Frontend
- Client-side navigation (Next.js)
- Component code splitting
- Image optimization ready
- Minimal bundle size

### Caching
- Static page generation
- API response caching ready
- Browser caching headers

## Scalability Considerations

### Current Limits
- 500 emails/day (Gmail standard)
- 500MB database (Supabase free)
- 1GB file storage
- 2GB bandwidth/month

### Scaling Path
1. Upgrade to Google Workspace (2000 emails/day)
2. Upgrade Supabase plan (more storage/bandwidth)
3. Consider transactional email service (SendGrid, Mailgun)
4. Add Redis caching for frequent queries
5. Implement job queue for email sending

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE

# OpenAI
OPENAI_KEY

# Gmail API
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
GMAIL_USER_EMAIL
```

## Deployment Ready

The application is production-ready and can be deployed to:
- ✅ Vercel (recommended)
- ✅ Netlify
- ✅ AWS Amplify
- ✅ Any Node.js hosting

See `docs/deployment.md` for detailed instructions.

## Testing Checklist

- [x] User registration (organizer/partner)
- [x] User authentication
- [x] Event creation (all steps)
- [x] File upload
- [x] Partner selection
- [x] Email generation
- [x] Email sending
- [x] Dashboard display
- [x] Event tracking
- [x] Partner inquiry view

## Known Limitations

1. **Email Tracking**: Opens/reads not tracked (Gmail API limitation)
2. **Reply Tracking**: Replies happen via email, not in platform
3. **Daily Limits**: 500 emails/day on standard Gmail
4. **File Size**: 5MB per file, 3 files max
5. **AI Costs**: OpenAI API charges per request

## Future Enhancements (Not Implemented)

- Email open tracking (requires pixel tracking service)
- In-platform messaging between organizer and partner
- Payment processing integration
- Review and rating system
- Advanced analytics dashboard
- Mobile app
- Multi-language support
- Calendar integration
- PDF proposal generation
- Contract management

## Documentation

- ✅ `README.md` - Project overview
- ✅ `SETUP.md` - Setup instructions
- ✅ `docs/supabase-setup.md` - Database setup
- ✅ `docs/gmail-setup.md` - Email configuration
- ✅ `docs/deployment.md` - Deployment guide
- ✅ `.env.example` - Environment variables template

## Code Quality

- TypeScript for type safety
- ESLint configuration
- Consistent naming conventions
- Component modularity
- Separation of concerns
- Error handling
- Loading states
- User feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Form validation
- Error messages
- Focus states

## License

MIT License - Free to use, modify, and distribute

## Support

See documentation in `docs/` folder for setup and deployment help.

---

**Status**: ✅ Complete and ready for deployment

**Last Updated**: November 2025

**Version**: 1.0.0

