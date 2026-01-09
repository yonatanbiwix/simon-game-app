# 🚀 Render.com Deployment Rules

**For AI Assistants:** This document contains critical rules and patterns for deploying this application to Render.com.

---

## 📋 Deployment Structure

### Services Configuration (`render.yaml`)

This project deploys **2 services** to Render:

1. **Backend Web Service** (`simon-game-backend`)
   - Type: `web` (Node.js)
   - Handles: API + WebSocket server
   - Port: 10000

2. **Frontend Static Site** (`simon-game-frontend`)
   - Type: `static`
   - Serves: React SPA (Single Page Application)
   - Build output: `frontend/dist`

---

## 🔧 Critical Rules

### 1. **TypeScript Path Aliases Resolution**

**Problem:** TypeScript path aliases (`@shared/*`, `@backend/*`, `@frontend/*`) don't work in compiled JavaScript.

**Solution:** Use `tsc-alias` after TypeScript compilation.

```json
{
  "scripts": {
    "build": "tsc && tsc-alias"
  }
}
```

**⚠️ CRITICAL:** `tsc-alias` MUST be in `dependencies`, NOT `devDependencies`.

```json
{
  "dependencies": {
    "tsc-alias": "^1.8.16",
    "typescript": "^5.9.3"
  }
}
```

**Why?** Render production builds don't install `devDependencies`.

---

### 2. **TypeScript Configuration for Production**

Use **CommonJS** module system, not ESNext:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

**Why?** Node.js runtime requires CommonJS in production. ESNext modules cause `ERR_MODULE_NOT_FOUND` errors.

---

### 3. **Build-Time Dependencies**

All packages needed during the **build process** must be in `dependencies`:

- `typescript` - For `tsc` compiler
- `tsc-alias` - For path alias resolution
- `@types/*` packages - For TypeScript compilation
- Any build tools used in `npm run build`

**Test locally:**
```bash
npm run build
```

If it works locally but fails on Render, check if build tools are in `dependencies`.

---

### 4. **Environment Variables**

#### Backend Required:
- `NODE_ENV=production`
- `PORT=10000` (Render assigns this)
- `JWT_SECRET` (generate secure random string)
- `FRONTEND_URL` (frontend service URL for CORS)

#### Frontend Required:
- `VITE_API_URL` (backend service URL)
- `VITE_SOCKET_URL` (backend WebSocket URL, same as API URL)

**⚠️ Important:** Set `FRONTEND_URL` on backend AFTER frontend deployment to get the correct URL.

---

### 5. **CORS Configuration**

Backend must allow frontend domain:

```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
```

**For WebSocket (Socket.io):**
```typescript
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});
```

---

### 6. **Health Check Endpoint**

**Required** for Render to monitor service health:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
```

Configure in `render.yaml`:
```yaml
healthCheckPath: /health
```

---

## 📦 Deployment Workflow

### Initial Deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: description"
   git push
   ```

2. **Deploy Backend First:**
   - Render auto-deploys from `main` branch
   - Wait for build to complete
   - Note the backend URL: `https://[service-name].onrender.com`

3. **Update Frontend Environment Variables:**
   ```bash
   # Set VITE_API_URL and VITE_SOCKET_URL to backend URL
   ```

4. **Deploy Frontend:**
   - Render auto-deploys from `main` branch
   - Note the frontend URL

5. **Update Backend CORS:**
   ```bash
   # Set FRONTEND_URL to frontend URL
   # Backend will auto-redeploy
   ```

### Subsequent Deployments:

- **Auto-deploy:** Push to `main` branch
- Both services redeploy automatically
- Monitor via Render dashboard

---

## 🐛 Common Issues & Fixes

### Issue 1: `Cannot find module '@shared/types'`
**Cause:** Path aliases not resolved in compiled JS  
**Fix:** Ensure `tsc-alias` is in `dependencies` and build script is `tsc && tsc-alias`

### Issue 2: `tsc-alias: not found`
**Cause:** `tsc-alias` is in `devDependencies`  
**Fix:** Move to `dependencies`

### Issue 3: `ERR_MODULE_NOT_FOUND`
**Cause:** Using ESNext modules with Node.js  
**Fix:** Change `tsconfig.json` to `"module": "commonjs"`

### Issue 4: CORS Errors in Browser
**Cause:** `FRONTEND_URL` not set or incorrect  
**Fix:** Update backend env var with correct frontend URL

### Issue 5: WebSocket Connection Fails
**Cause:** Socket.io CORS not configured  
**Fix:** Ensure Socket.io has same CORS origin as Express

### Issue 6: Build Succeeds but Server Won't Start
**Cause:** Missing runtime dependencies  
**Fix:** Check `package.json` - all imports must have corresponding packages in `dependencies`

---

## 📊 Service URLs (Current Deployment)

- **Backend:** https://simon-game-backend-m2xh.onrender.com
- **Frontend:** https://simon-game-frontend.onrender.com

**Test Health Check:**
```bash
curl https://simon-game-backend-m2xh.onrender.com/health
```

---

## 🔍 Monitoring & Debugging

### View Logs:
```bash
# Using Render MCP (via AI assistant)
mcp_render_list_logs --resource srv-[SERVICE_ID] --type app --limit 50
```

### Check Deployment Status:
```bash
# Using Render MCP
mcp_render_get_service --serviceId srv-[SERVICE_ID]
mcp_render_list_deploys --serviceId srv-[SERVICE_ID] --limit 5
```

### Manual Dashboard:
- Backend: https://dashboard.render.com/web/srv-d5gd6dp4tr6s73e90a10
- Frontend: https://dashboard.render.com/static/srv-d5gd6gchg0os73bhrrj0

---

## ⚡ Performance Tips

1. **Enable Caching:** Render caches `node_modules` between builds
2. **Optimize Build:** Only build what's needed (backend OR frontend)
3. **Health Checks:** Keep `/health` endpoint fast (<100ms)
4. **Auto-Deploy:** Use for `main` branch only, disable for dev branches

---

## 🔐 Security Checklist

- ✅ `JWT_SECRET` is randomly generated (32+ bytes)
- ✅ CORS restricted to frontend domain only
- ✅ Cookies are HTTP-only (`httpOnly: true`)
- ✅ Environment variables are not committed to Git
- ✅ `.env` files are in `.gitignore`

---

## 📝 Quick Reference

**Backend Build Command:**
```bash
npm install && npm run build
```

**Backend Start Command:**
```bash
npm start
```

**Frontend Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Frontend Publish Path:**
```
frontend/dist
```

---

## 🎯 AI Assistant Instructions

When modifying deployment configuration:

1. **Always** test build locally first: `npm run build`
2. **Always** check if new packages are in `dependencies` vs `devDependencies`
3. **Never** use ESNext modules for Node.js backend
4. **Always** ensure `tsc-alias` runs after `tsc` in build script
5. **Always** update CORS when frontend/backend URLs change
6. **Always** commit and push before expecting Render to deploy

---

**Last Updated:** 2026-01-09  
**Deployment Status:** ✅ Both services live and operational
