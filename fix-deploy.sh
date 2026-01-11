#!/bin/bash
# Fix Render Deployment Script
# Run this in your terminal: bash fix-deploy.sh

set -e

echo "🔧 Fixing frontend package-lock.json for Render deployment..."

cd frontend

echo "📦 Removing old files..."
rm -rf node_modules package-lock.json

echo "🌐 Setting public npm registry..."
npm config set registry https://registry.npmjs.org

echo "📥 Installing dependencies (this may take a minute)..."
npm install

echo "✅ Verifying registry URLs..."
if grep -q "npm.dev.wixpress.com" package-lock.json; then
    echo "❌ ERROR: Still using Wix registry!"
    exit 1
else
    echo "✅ Using public registry!"
fi

echo "📤 Committing and pushing..."
cd ..
git add frontend/package-lock.json
git commit -m "fix: regenerate package-lock with public npm registry"
git push origin main

echo ""
echo "🎉 Done! Render will auto-deploy."
echo "👉 Frontend: https://simon-game-bd0t.onrender.com"
echo "👉 Backend: https://simon-game-backend-1094.onrender.com"
