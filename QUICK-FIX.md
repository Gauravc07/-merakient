# 🚨 Quick Fix: Missing Supabase Credentials

## ⚡ Immediate Solution

Run these commands in order:

\`\`\`bash
# 1. Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xqomzculduyiekqwcpgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:Gaurav1806@db.xqomzculduyiekqwcpgj.supabase.co:5432/postgres
EOF

# 2. Get your Supabase keys
echo "🔑 Go to: https://supabase.com/dashboard/project/xqomzculduyiekqwcpgj/settings/api"
echo "📋 Copy the anon key and service_role key"

# 3. Edit the file with your actual keys
nano .env.local
# OR
code .env.local

# 4. Verify setup
node scripts/verify-setup.js

# 5. Update event times
node scripts/update-event-times.js
\`\`\`

## 🔑 Where to Find Your Keys

1. **Go to Supabase Dashboard**: https://supabase.com
2. **Select your project**: xqomzculduyiekqwcpgj
3. **Navigate to**: Settings → API
4. **Copy these values**:
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

## ✅ Verification

After setting up, you should see:

\`\`\`
✅ Loaded environment variables from .env.local
🔍 Checking environment variables...
Supabase URL: ✅ Found
Service Key: ✅ Found
🕐 Updating event times...
✅ Event times updated successfully!
\`\`\`

## 🆘 Still Having Issues?

Run the verification script:

\`\`\`bash
npm run verify
\`\`\`

This will check:
- ✅ Environment variables
- ✅ Database connection  
- ✅ Required tables
- ✅ Event configuration
- ✅ File structure
