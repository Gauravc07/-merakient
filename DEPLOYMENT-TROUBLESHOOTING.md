# 🚨 Vercel Deployment Troubleshooting

## Common Issues & Solutions

### 1. Build Failures

#### Error: "Module not found"
**Solution**: Check your imports and file paths
\`\`\`bash
# Test build locally first
npm run build
\`\`\`

#### Error: "Type errors"
**Solution**: Fix TypeScript errors
\`\`\`bash
# Check for type errors
npm run lint
\`\`\`

### 2. Environment Variables Missing

#### Error: "Missing environment variables"
**Solution**: Add them in Vercel dashboard
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Git Issues

#### Error: "No such file or directory"
**Solution**: Ensure all files are committed
\`\`\`bash
# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Fix deployment issues"

# Push to GitHub
git push origin main
\`\`\`

### 4. Vercel Configuration

#### Error: "Build command failed"
**Solution**: Check vercel.json configuration

#### Error: "Function timeout"
**Solution**: Increase timeout in vercel.json

### 5. Node.js Version Issues

#### Error: "Unsupported Node.js version"
**Solution**: Specify Node.js version in package.json

## Step-by-Step Deployment

### 1. Pre-deployment Checklist
\`\`\`bash
# Run deployment check
chmod +x scripts/deploy-check.sh
./scripts/deploy-check.sh
\`\`\`

### 2. Commit and Push
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### 3. Deploy to Vercel
\`\`\`bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

### 4. Configure Environment Variables
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all required variables

### 5. Test Deployment
1. Visit your deployed URL
2. Test login functionality
3. Test bidding features

## Quick Fixes

### Fix 1: Clean Build
\`\`\`bash
# Remove build artifacts
rm -rf .next
rm -rf node_modules

# Reinstall dependencies
npm install

# Test build
npm run build
\`\`\`

### Fix 2: Update Dependencies
\`\`\`bash
# Update to latest versions
npm update

# Check for vulnerabilities
npm audit fix
\`\`\`

### Fix 3: Simplify Configuration
Remove complex configurations that might cause issues:
- Remove experimental features from next.config.mjs
- Simplify vercel.json
- Check for conflicting dependencies

## Environment Variables Template

Create these in Vercel dashboard:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

## Common Error Messages

### "Build failed with exit code 1"
- Check build logs in Vercel dashboard
- Test build locally: `npm run build`
- Fix any TypeScript/ESLint errors

### "Function execution timed out"
- Increase timeout in vercel.json
- Optimize slow API routes
- Check database connection

### "Module not found: Can't resolve"
- Check import paths
- Ensure all dependencies are in package.json
- Check file case sensitivity

## Getting Help

If deployment still fails:
1. Check Vercel build logs
2. Test locally with `npm run build`
3. Verify all environment variables
4. Check GitHub repository has all files
5. Try deploying a minimal version first
