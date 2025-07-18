#!/bin/bash
# .env.local

# Supabase Configuration (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://xqomzculduyiekqwcpgj.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxb216Y3VsZHV5aWVrcXdjcGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTI1ODUsImV4cCI6MjA2NzUyODU4NX0.jJ3PzX8g63Rj-zfHXhlsNjb0IOswhkALNn2AfhvdmmE
    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxb216Y3VsZHV5aWVrcXdjcGdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTk1MjU4NSwiZXhwIjoyMDY3NTI4NTg1fQ.oJPFkCiYUGWztHFvgTkuA7ceM__ZqItOcgv2kv-lJ48
    DATABASE_URL=postgresql://postgres:Gaurav1806@db.xqomzculduyiekqwcpgj.supabase.co:5432/postgres

# Session Secret (IMPORTANT: Generate a strong, random string for production!)
# You can generate one using: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
SESSION_SECRET=gauravchindhevitvellore




# Environment setup script for Meraki Entertainment Live Bidding
# Run with: chmod +x setup-env.sh && ./setup-env.sh

echo "🔧 Setting up environment variables..."

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
else
    echo "📝 Creating .env.local file..."
    
    # Create .env.local template
    cat > .env.local << 'EOF'
# Supabase Configuration
# Get these values from your Supabase dashboard: Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xqomzculduyiekqwcpgj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URL (optional, for direct connections)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
EOF

    echo "📋 .env.local template created!"
    echo ""
    echo "🔑 Please update .env.local with your actual Supabase credentials:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to Settings → API"
    echo "3. Copy the Project URL and paste it as NEXT_PUBLIC_SUPABASE_URL"
    echo "4. Copy the anon/public key and paste it as NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "5. Copy the service_role key and paste it as SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "⚠️  After updating .env.local, run this script again to verify the setup"
    exit 1
fi

# Load and verify environment variables
source .env.local

echo "🔍 Verifying environment variables..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "https://your-project-id.supabase.co" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set or still has placeholder value"
    echo "Please update it with your actual Supabase project URL"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your-anon-key-here" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or still has placeholder value"
    echo "Please update it with your actual Supabase anon key"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ "$SUPABASE_SERVICE_ROLE_KEY" = "your-service-role-key-here" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set or still has placeholder value"
    echo "Please update it with your actual Supabase service role key"
    exit 1
fi

echo "✅ All environment variables are properly configured!"
echo ""
echo "🎯 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev (to test locally)"
echo "3. Run: node scripts/update-event-times.js (to set your event times)"
echo "4. Run: vercel --prod (to deploy)"
