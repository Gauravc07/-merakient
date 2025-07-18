# 🧪 Multi-User Testing Guide

## Problem: All Windows Login as Same User

When testing locally, all browser windows share the same cookies, causing all tabs to show the same logged-in user.

## ✅ Solutions for Local Testing

### Method 1: Use Different Browsers (Recommended)
- **Chrome**: user1/password1
- **Firefox**: user2/password2  
- **Safari**: user3/password3
- **Edge**: user4/password4

### Method 2: Use Incognito/Private Windows
1. **Chrome**: Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
2. **Firefox**: Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)
3. **Safari**: Cmd+Shift+N (Mac)
4. **Edge**: Ctrl+Shift+N (Windows)

Each incognito window has separate cookies!

### Method 3: Use Chrome Profiles
1. Click your profile icon in Chrome
2. Click "Add" to create new profiles
3. Each profile has separate cookies
4. Open different profiles for different users

### Method 4: Use Different Ports (Advanced)
Run multiple instances of your app:
\`\`\`bash
# Terminal 1
npm run dev -- --port 3000

# Terminal 2  
npm run dev -- --port 3001

# Terminal 3
npm run dev -- --port 3002
\`\`\`

## 🌐 For Remote Testing

### Deploy and Share URL
1. Deploy to Vercel: \`vercel --prod\`
2. Share the URL with team members
3. Each person uses different devices/networks
4. Test with: user1-user40 / password1-password40

### Use Different Devices
- **Desktop**: user1/password1
- **Laptop**: user2/password2
- **Phone**: user3/password3
- **Tablet**: user4/password4

## 🔧 Quick Test Setup

### For 3 Users Locally:
1. **Chrome Normal**: Login as user1/password1
2. **Chrome Incognito**: Login as user2/password2
3. **Firefox**: Login as user3/password3

### For 5+ Users:
1. **Chrome**: user1
2. **Chrome Incognito**: user2
3. **Firefox**: user3
4. **Firefox Private**: user4
5. **Safari**: user5
6. **Edge**: user6

## 📱 Mobile Testing
- Use different mobile browsers
- Use mobile + desktop combination
- Test on different devices

## ⚡ Quick Commands

\`\`\`bash
# Open Chrome Incognito (Windows)
start chrome --incognito http://localhost:3000

# Open Chrome Incognito (Mac)
open -na "Google Chrome" --args --incognito http://localhost:3000

# Open Firefox Private (Windows)
start firefox -private-window http://localhost:3000

# Open Firefox Private (Mac)
open -na Firefox --args -private-window http://localhost:3000
\`\`\`

## 🎯 Best Testing Approach

1. **Use 3-4 different browsers** for main testing
2. **Deploy to Vercel** for real multi-device testing
3. **Share with team members** for genuine concurrent testing
4. **Use mobile devices** for mobile-specific testing

This way you can properly test:
- ✅ Concurrent bidding
- ✅ Real-time updates
- ✅ Conflict resolution
- ✅ Mobile responsiveness
