#!/bin/bash

echo "🔍 Pre-deployment checks..."

# Check if required files exist
echo "📁 Checking required files..."
required_files=("package.json" "next.config.mjs" "app/layout.tsx" "app/page.tsx")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check package.json for required scripts
echo "📦 Checking package.json scripts..."
if grep -q '"build"' package.json; then
    echo "✅ Build script found"
else
    echo "❌ Build script missing"
    exit 1
fi

# Test build locally
echo "🔨 Testing local build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed"
    exit 1
fi

echo "🎉 All checks passed! Ready for deployment."
