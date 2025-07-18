# Meraki Entertainment - Live Bidding System

A production-ready real-time bidding platform built with Next.js, Supabase, and PostgreSQL.

## 🚀 Features

- **Real-time bidding** with live updates across all connected devices
- **Conflict resolution** using optimistic locking and database functions
- **Multi-user support** for up to 40 concurrent bidders
- **Production-ready** with proper error handling and monitoring
- **Mobile responsive** design for bidding on any device
- **Secure authentication** with session management

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes with server actions
- **Database**: Supabase PostgreSQL with real-time subscriptions
- **Authentication**: Custom session-based auth with bcrypt
- **Real-time**: Supabase real-time for live updates

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd meraki-entertainment-website
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your Supabase credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://xqomzculduyiekqwcpgj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=postgresql://postgres:Gaurav1806@db.xqomzculduyiekqwcpgj.supabase.co:5432/postgres
   \`\`\`

4. **Run database migrations**
   \`\`\`bash
   # Execute the SQL script in your Supabase dashboard or using psql
   psql "postgresql://postgres:Gaurav1806@db.xqomzculduyiekqwcpgj.supabase.co:5432/postgres" -f scripts/create-tables-v2.sql
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧪 Testing Multi-User Bidding

### Local Testing

1. **Open multiple browser tabs/windows**
   - Navigate to `http://localhost:3000/bidding`
   - Login with different users (user1/password1, user2/password2, etc.)
   - Place bids simultaneously to test conflict resolution

2. **Use the testing dashboard**
   - Navigate to `http://localhost:3000/test` (login as user1)
   - Activate multiple test users
   - Start simulation to see automated bidding

### Remote Testing

1. **Deploy to Vercel**
   \`\`\`bash
   vercel --prod
   \`\`\`

2. **Share the URL** with multiple testers
   - Each tester uses different credentials (user1-user40)
   - Test concurrent bidding from different devices/locations

3. **Monitor in real-time**
   - Watch the live activity feed
   - Check database for proper bid recording
   - Verify conflict resolution works correctly

## 🔧 Database Schema

### Tables
- **users**: 40 test users with authentication
- **tables**: Available tables for bidding with version control
- **bids**: Complete bid history with conflict tracking

### Key Features
- **Optimistic locking** prevents bid conflicts
- **Atomic transactions** ensure data consistency
- **Proper indexing** for high-performance queries
- **Real-time triggers** for live updates

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
vercel --prod
\`\`\`

### Docker
\`\`\`bash
docker build -t meraki-bidding .
docker run -p 3000:3000 meraki-bidding
\`\`\`

### Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

## 🔐 User Credentials

Test with any of these 40 users:
- **Username**: user1 to user40
- **Password**: password1 to password40

Example:
- Username: `user1`, Password: `password1`
- Username: `user15`, Password: `password15`

## 📊 Monitoring

- **Health check**: `/api/health`
- **Real-time status**: Connection indicator in UI
- **Error tracking**: Console logs and user feedback
- **Performance**: Database query optimization

## 🛡️ Security Features

- **Session-based authentication**
- **Rate limiting** on bid placement
- **Input validation** and sanitization
- **SQL injection protection**
- **CORS configuration**
- **Environment variable protection**

## 🔄 Real-time Features

- **Live bid updates** across all connected users
- **Connection status** monitoring
- **Automatic reconnection** on network issues
- **Optimistic UI updates** with rollback on errors
- **Live activity feed** showing recent bids

## 📱 Mobile Support

- **Responsive design** works on all screen sizes
- **Touch-friendly** interface for mobile bidding
- **Offline detection** and reconnection
- **Performance optimized** for mobile networks

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check Supabase credentials
   - Verify database URL format
   - Ensure RLS policies are set correctly

2. **Real-time not working**
   - Check Supabase real-time is enabled
   - Verify WebSocket connections
   - Check browser console for errors

3. **Bid conflicts**
   - This is expected behavior
   - System will show appropriate error messages
   - Users should refresh and try again

### Performance Tips

- **Enable database connection pooling**
- **Use CDN for static assets**
- **Monitor database query performance**
- **Set up proper caching headers**

## 📈 Scaling Considerations

- **Database**: Use read replicas for high traffic
- **Real-time**: Consider Redis for pub/sub at scale
- **CDN**: Use Vercel Edge Network or CloudFlare
- **Monitoring**: Add APM tools like DataDog or New Relic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to Meraki Entertainment.
