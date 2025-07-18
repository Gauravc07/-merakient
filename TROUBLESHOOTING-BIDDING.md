# 🚨 Bidding Issues Troubleshooting

## Quick Diagnosis

Run this command to check what's wrong:
\`\`\`bash
node scripts/quick-debug-bidding.js
\`\`\`

## Common Issues & Solutions

### 1. 🕐 Event Not Started
**Symptoms**: Button says "Event Not Started"
**Solution**:
\`\`\`bash
node scripts/fix-common-issues.js
\`\`\`

### 2. 🔐 Not Logged In
**Symptoms**: Redirected to login page
**Solution**: Login with user1/password1 (or any user1-40)

### 3. 🌐 Network/API Issues
**Symptoms**: "Failed to place bid" or loading forever
**Solutions**:
- Check internet connection
- Refresh the page
- Try incognito window
- Check browser console (F12) for errors

### 4. 🎯 Self-Outbid
**Symptoms**: "You are already the highest bidder"
**Solution**: Try a different table or wait for someone else to bid

### 5. 💰 Bid Too Low
**Symptoms**: "Bid must be at least ₹X"
**Solution**: Enter a higher amount (minimum is current bid + ₹1000)

### 6. ⚡ Rate Limited
**Symptoms**: "Please wait before placing another bid"
**Solution**: Wait 2 seconds between bids

## Step-by-Step Debugging

### Step 1: Check Event Status
Look for the colored banner at the top:
- 🟢 Green = Event is LIVE ✅
- 🟡 Yellow = Event not started yet
- 🔴 Red = Event ended

### Step 2: Check Login Status
Top of page should show: "Logged in as userX"

### Step 3: Check Browser Console
1. Press F12 to open dev tools
2. Click "Console" tab
3. Look for red error messages
4. Share any errors you see

### Step 4: Try Different Table
Some tables might have issues - try a different one

### Step 5: Check Network
- Refresh the page
- Try different browser
- Check internet connection

## Manual Fixes

### Start Event Immediately
\`\`\`bash
node scripts/start-event-now.js
\`\`\`

### Extend Event by 2 Hours
\`\`\`bash
node scripts/extend-event.js 2
\`\`\`

### Verify Complete Setup
\`\`\`bash
node scripts/verify-setup.js
\`\`\`

## Browser-Specific Issues

### Chrome
- Try incognito window
- Clear cache (Ctrl+Shift+Delete)

### Firefox
- Try private window
- Disable extensions

### Safari
- Try private window
- Check security settings

## Still Not Working?

1. **Run the debug script**:
   \`\`\`bash
   node scripts/quick-debug-bidding.js
   \`\`\`

2. **Check these things**:
   - Are you logged in?
   - Is the event live (green banner)?
   - Any errors in browser console?
   - Is your internet working?

3. **Try these fixes**:
   \`\`\`bash
   # Fix common issues
   node scripts/fix-common-issues.js
   
   # Restart dev server
   npm run dev
   \`\`\`

4. **Last resort**:
   - Close browser completely
   - Restart development server
   - Open fresh browser window
   - Login and try again
