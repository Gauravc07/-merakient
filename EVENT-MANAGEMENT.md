# 🎯 Live Event Management Guide

## ⏰ Setting Your Event Times

### Method 1: Before Deployment (Recommended)
Edit `scripts/create-tables-v2.sql` and find this section:
\`\`\`sql
-- *** CHANGE THESE TIMES FOR YOUR LIVE EVENT ***
bidding_starts_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-01-20 18:00:00+05:30', -- Event start time in IST
bidding_ends_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-01-20 23:00:00+05:30',   -- Event end time in IST
\`\`\`

**Change to your event times:**
\`\`\`sql
-- Example: Event on Feb 15, 2024 from 7:30 PM to 11:30 PM IST
bidding_starts_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-02-15 19:30:00+05:30',
bidding_ends_at TIMESTAMP WITH TIME ZONE DEFAULT '2024-02-15 23:30:00+05:30',
\`\`\`

### Method 2: After Deployment
Use the management scripts:
\`\`\`bash
# Update event times
node scripts/update-event-times.js

# Start event immediately
node scripts/start-event-now.js

# Extend event by 2 hours
node scripts/extend-event.js 2
\`\`\`

## 📅 Time Format Guide

### IST Timezone Format
Always use: `'YYYY-MM-DD HH:MM:SS+05:30'`

### Common Event Times
- **Evening Event**: `'2024-02-15 19:00:00+05:30'` (7:00 PM)
- **Afternoon Event**: `'2024-02-15 14:30:00+05:30'` (2:30 PM)
- **Late Night**: `'2024-02-15 22:00:00+05:30'` (10:00 PM)
- **Weekend Morning**: `'2024-02-17 10:00:00+05:30'` (10:00 AM)

## 🎮 Event Control Dashboard

### During Your Event
1. **Monitor Status**: Watch the live status banner
2. **Extend Time**: Use scripts if needed
3. **Support Users**: Help with login issues
4. **Track Activity**: Monitor bid activity feed

### Emergency Controls
\`\`\`sql
-- Start event immediately
UPDATE tables SET bidding_starts_at = NOW() WHERE is_active = true;

-- Extend by 1 hour
UPDATE tables SET bidding_ends_at = bidding_ends_at + INTERVAL '1 hour' WHERE is_active = true;

-- End event now
UPDATE tables SET bidding_ends_at = NOW() WHERE is_active = true;
\`\`\`

## 📊 Event Phases

### Phase 1: Pre-Event (1 hour before)
- [ ] Verify event times
- [ ] Test user logins
- [ ] Check real-time updates
- [ ] Send login credentials to bidders

### Phase 2: Event Start
- [ ] Monitor live status
- [ ] Support user questions
- [ ] Watch for technical issues

### Phase 3: During Event
- [ ] Track bidding activity
- [ ] Monitor server performance
- [ ] Handle any conflicts

### Phase 4: Event End
- [ ] Verify final bids
- [ ] Export results
- [ ] Announce winners

## 🎯 Quick Reference

### User Credentials
- user1/password1 through user40/password40
- Share different credentials with each bidder

### Important URLs
- Main site: `https://your-domain.com`
- Bidding: `https://your-domain.com/bidding`
- Health check: `https://your-domain.com/api/health`

### Support Commands
\`\`\`bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Update environment variables
vercel env add VARIABLE_NAME
