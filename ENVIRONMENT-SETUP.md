# 🔧 Environment Variables Setup Guide

## ❌ Error: "Missing Supabase credentials in environment variables"

This error occurs when the scripts can't find your Supabase credentials. Here's how to fix it:

## 🔑 Step 1: Get Your Supabase Credentials

1. **Go to your Supabase dashboard**: [supabase.com](https://supabase.com)
2. **Select your project**
3. **Navigate to**: Settings → API
4. **Copy these values**:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (long string starting with `eyJ`)
   - **service_role key** (long string starting with `eyJ`)

## 📝 Step 2: Create .env.local File

Create a file named `.env.local` in your project root:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xqomzculduyiekqwcpgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL (optional)
DATABASE_URL=postgresql://postgres:Gaurav1806@db.xqomzculduyiekqwcpgj.supabase.co:5432/postgres
\`\`\`

## 🚀 Step 3: Automated Setup

Run the setup script to create the template:

\`\`\`bash
chmod +x setup-env.sh
./setup-env.sh
\`\`\`

## ✅ Step 4: Verify Setup

Test your environment variables:

\`\`\`bash
# Test the update script
node scripts/update-event-times.js

# If successful, you should see:
# ✅ Loaded environment variables from .env.local
# ✅ Event times updated successfully!
\`\`\`

## 🔍 Troubleshooting

### Issue 1: "JWT expired" or "Invalid JWT"
- **Solution**: Check your `SUPABASE_SERVICE_ROLE_KEY`
- Make sure you copied the **service_role** key, not the anon key

### Issue 2: "Project not found"
- **Solution**: Check your `NEXT_PUBLIC_SUPABASE_URL`
- Make sure the URL matches your project exactly

### Issue 3: ".env.local not found"
- **Solution**: Make sure the file is in your project root directory
- File should be at the same level as `package.json`

### Issue 4: "Permission denied"
- **Solution**: Check file permissions
- Run: `chmod 644 .env.local`

## 📂 File Structure

Your project should look like this:

\`\`\`
meraki-entertainment-website/
├── .env.local                 ← Your environment file
├── package.json
├── scripts/
│   ├── update-event-times.js
│   └── ...
└── ...
\`\`\`

## 🔐 Security Notes

- **Never commit** `.env.local` to git
- **Keep your service role key secret**
- **Use different keys** for development and production

## 🎯 Quick Fix Commands

\`\`\`bash
# Create environment file template
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
EOF

# Edit the file with your actual values
nano .env.local

# Test the setup
node scripts/update-event-times.js
\`\`\`

## 🌐 For Vercel Deployment

After local setup works, add the same variables to Vercel:

1. **Go to Vercel dashboard**
2. **Select your project**
3. **Settings → Environment Variables**
4. **Add each variable**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## ✨ Success Indicators

When everything is set up correctly, you'll see:

\`\`\`
✅ Loaded environment variables from .env.local
🔍 Checking environment variables...
Supabase URL: ✅ Found
Service Key: ✅ Found
🕐 Updating event times...
✅ Event times updated successfully!
\`\`\`
