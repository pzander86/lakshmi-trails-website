# Deployment Guide for Lakshmi Trails

## Vercel Deployment

### Environment Variables to Set in Vercel Dashboard

**Required for production:**
```
RESEND_API_KEY=your_actual_resend_api_key_here
```

**How to set:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `RESEND_API_KEY` with your actual Resend API key
3. Set environment to "Production" (and "Preview" if desired)
4. Save and redeploy

### Build Settings

**Framework Preset:** Astro
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `.vercel/output` (auto-configured by adapter)
**Install Command:** `npm install` (auto-detected)
**Node.js Version:** 18.x (specified in .nvmrc)

### Domain Configuration

**Primary Domain:** `lakshmitrails.com`
**SSL:** Automatic via Vercel
**Redirects:** Configure www → non-www if needed

### Deployment Triggers

**Branch:** `main` (or your primary branch)
**Auto-deploy:** Enabled on push to main branch
**Preview deployments:** Enabled for pull requests

### Post-Deployment Checklist

1. ✅ Verify RESEND_API_KEY is set in environment variables
2. ✅ Test contact form functionality
3. ✅ Check all images load correctly
4. ✅ Verify SSL certificate is active
5. ✅ Test domain redirects (if applicable)
6. ✅ Confirm sitemap is accessible at /sitemap.xml
7. ✅ Replace placeholder images with real content

### Monitoring

- **Analytics:** Enabled via Vercel Web Analytics
- **Functions:** API routes automatically deployed as serverless functions
- **Error Monitoring:** Ready for integration (currently disabled for dev)

### Security Headers (Optional)

If needed, add to vercel.json:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```