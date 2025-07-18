#!/bin/bash

# Deployment script for Meraki Entertainment Live Bidding
# Run with: chmod +x deploy.sh && ./deploy.sh

echo "🚀 Starting deployment process..."

# Check if required files exist
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your live bidding platform is now deployed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your event times in the database"
    echo "2. Test with multiple users"
    echo "3. Share the URL with your bidders"
    echo ""
    echo "🔧 Management commands:"
    echo "- Update event times: node scripts/update-event-times.js"
    echo "- Start event now: node scripts/start-event-now.js"
    echo "- Extend event: node scripts/extend-event.js 2"
else
    echo "❌ Deployment failed!"
    exit 1
fi
