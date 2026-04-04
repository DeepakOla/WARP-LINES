# Deployment Guide for Warp Board

This guide covers deploying Warp Board to various hosting platforms.

## Table of Contents
- [GitHub Pages](#github-pages)
- [Cloudflare Pages](#cloudflare-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Custom Static Hosting](#custom-static-hosting)

---

## GitHub Pages

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Setup:**

1. Go to repository **Settings** > **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to main branch - deployment will happen automatically
4. Access your site at: `https://[username].github.io/WARP-LINES/`

### Manual Deployment

If you prefer manual deployment:

1. **Update base path in vite.config.ts**:
   ```typescript
   export default defineConfig({
     base: '/WARP-LINES/', // Your repo name
     // ... rest of config
   });
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy using gh-pages**:
   ```bash
   # Install gh-pages
   npm install -g gh-pages

   # Deploy dist folder
   gh-pages -d dist
   ```

4. **Configure GitHub Pages**:
   - Go to Settings > Pages
   - Select `gh-pages` branch
   - Click Save

---

## Cloudflare Pages

### Via Dashboard

1. **Log in** to Cloudflare Dashboard
2. Go to **Pages** > **Create a project**
3. **Connect to Git** and select your repository
4. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Framework preset: Vite
5. **Deploy**

### Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Build the project
npm run build

# Deploy
wrangler pages deploy dist --project-name=warp-board
```

**Benefits:**
- Free tier with unlimited bandwidth
- Global CDN
- Automatic HTTPS
- Preview deployments for PRs

---

## Vercel

### Via Dashboard

1. **Import project** from GitHub
2. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**

### Via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Benefits:**
- Automatic deployments from Git
- Preview URLs for PRs
- Fast global CDN
- Free SSL

---

## Netlify

### Via Dashboard

1. **Connect to Git** provider
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy**

### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Create netlify.toml (optional)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Benefits:**
- Instant rollbacks
- Form handling
- Split testing
- Edge functions

---

## Custom Static Hosting

For any static hosting service (AWS S3, DigitalOcean Spaces, etc.):

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload contents of `dist/` folder** to your hosting service

3. **Configure**:
   - Set `index.html` as the index document
   - Configure 404 to redirect to `index.html` (for client-side routing)
   - Enable gzip compression
   - Set cache headers for assets

### Example: AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## Environment Variables

If you need to use environment variables:

1. Create `.env.production`:
   ```
   VITE_API_URL=https://api.example.com
   ```

2. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. **Add to hosting platform**:
   - GitHub Pages: Use repository secrets
   - Vercel/Netlify: Add in dashboard settings
   - Cloudflare: Use environment variables in Pages settings

---

## Build Optimization

### Analyze Bundle Size

```bash
npm run build -- --mode production

# View bundle analysis
npx vite-bundle-visualizer
```

### Reduce Bundle Size

1. **Enable gzip compression** in hosting config
2. **Lazy load routes** (if adding React Router)
3. **Optimize images** before committing
4. **Tree shake unused code**

Current build size:
- HTML: ~0.4 KB
- CSS: ~10 KB (gzipped: ~2.7 KB)
- JS: ~362 KB (gzipped: ~114 KB)

---

## Performance Tips

1. **Enable CDN caching**:
   - Cache static assets for 1 year
   - Cache HTML for 5 minutes

2. **Enable compression**:
   - gzip or brotli compression
   - Most platforms enable this by default

3. **Use HTTP/2**:
   - Enabled by default on modern platforms

4. **Add security headers**:
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```

---

## Troubleshooting

### Blank Page After Deployment

- Check base path in `vite.config.ts` matches your deployment URL
- Verify all assets are loaded correctly (check browser console)
- Ensure redirect rules are set for SPA routing

### Assets Not Loading

- Check base path configuration
- Verify assets are included in `dist/` folder
- Check CORS settings if loading from different domain

### Build Fails

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run clean && npm run build`
- Check Node version: `node --version` (should be 18+)

---

## Monitoring

Consider adding analytics:

1. **Google Analytics**:
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   ```

2. **Plausible** (privacy-friendly):
   ```html
   <script defer data-domain="yourdomain.com"
           src="https://plausible.io/js/script.js"></script>
   ```

3. **Cloudflare Web Analytics** (free):
   - Enable in Cloudflare dashboard
   - Zero performance impact

---

## Next Steps

After deployment:

1. ✅ Test the game on multiple devices
2. ✅ Check performance with Lighthouse
3. ✅ Verify sound effects work
4. ✅ Test all game modes
5. ✅ Share with friends!

---

**Need help?** Open an issue on GitHub: https://github.com/DeepakOla/WARP-LINES/issues
