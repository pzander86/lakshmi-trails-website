# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lakshmi Trails** is an Astro-based website for a spiritual travel company offering sacred wellness journeys to South India. The site features tour listings, contact forms, and cultural immersion experiences focused on Kerala and Karnataka regions.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## Architecture & Structure

### Framework Configuration
- **Astro 5.13.2** with SSR enabled (`output: 'server'`)
- **Vercel adapter** for deployment with web analytics
- **TypeScript** support configured

### Key Directories
- `src/components/` - Reusable Astro components (Hero, Tours, Contact, etc.)
- `src/pages/` - Route pages including API endpoints
- `src/data/` - JSON data files (tours, FAQs)
- `src/layouts/` - Base layout templates
- `public/assets/` - Static assets (images, videos, PDFs)

### Data Architecture
- **Tours data**: Structured in `src/data/tours.en.json` with schema.org markup
- **Tour routing**: Dynamic routes via `src/pages/tours/[slug].astro`
- Each tour includes pricing, dates, highlights, and SEO metadata

### API Layer
- Contact form endpoint at `src/pages/api/contact.js`
- Uses **Resend** service for email delivery
- Requires `RESEND_API_KEY` environment variable

### Styling System
- Global styles in `src/layouts/Layout.astro`
- CSS custom properties for brand colors:
  - `--color-gold` (#D4AF37)
  - `--color-coral` (#D65A3A)
  - `--color-stone` (#333333)
- Font stack: Playfair Display (headings) + Lato (body)

### Performance Features
- Custom performance boost script in `public/js/performance-boost.js`
- Lazy loading for videos and images
- Optimized assets with WebP format

### Content Strategy
- Three main tours: Kerala New Year, North Kerala Cultural, Karnataka Wellness
- PDF downloads for detailed itineraries
- Structured data for SEO optimization
- Multi-language support structure (currently English only)

## Environment Setup

Required environment variables:
- `RESEND_API_KEY` - For contact form email functionality

## Performance Considerations

### Video Optimization
- Hero videos are large (28MB desktop, 13MB mobile) - consider compressing further
- Target: <10MB desktop, <5MB mobile for better performance
- Use tools like FFmpeg: `ffmpeg -i input.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k output.mp4`

### Image Optimization
- Current WebP images are well optimized (~320KB desktop hero, ~100KB mobile)
- Logo remains PNG format - consider WebP conversion for further savings
- Ensure all images have appropriate `loading="lazy"` attributes

### Font Performance
- Fonts use `font-display: swap` for better loading performance
- Google Fonts loaded asynchronously to prevent render blocking
- Fallback fonts configured (Georgia, system-ui)

## Deployment

Configured for Vercel deployment with automatic builds from Git.

## Production Security & Monitoring

### Content Security Policy (CSP)
For enhanced security, consider implementing CSP headers in production. Add to `vercel.json` or server configuration:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
        },
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
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### Error Monitoring Setup
The site includes a built-in error monitoring utility (`src/utils/errorMonitoring.js`). To enable production monitoring:

1. **Sentry Integration** (Recommended):
   ```bash
   npm install @sentry/astro
   ```
   
2. **LogRocket Integration**:
   ```bash
   npm install logrocket
   ```

3. **Custom Analytics**: Update the `sendErrorToEndpoint()` function to send to your preferred service.

### Security Checklist
- ✅ No dangerous HTML injection patterns
- ✅ Environment variables for sensitive data
- ✅ Input validation on forms
- ✅ HTTPS enforcement (via Vercel)
- ✅ Proper CORS handling
- ⚠️ Consider adding rate limiting for contact form
- ⚠️ Implement CSP headers (see above)
- ⚠️ Add security monitoring alerts

### Performance Monitoring
The error monitoring utility includes performance tracking. Monitor these key metrics:
- Page load time (< 3 seconds)
- API response time (< 5 seconds)
- Component render time (< 100ms)

### Production Checklist
Before deploying:
1. Remove all backup/development files ✅
2. Replace development alerts with proper UI feedback ✅
3. Configure error monitoring service
4. Set up security headers
5. Test all forms and user interactions
6. Verify all environment variables are set
7. Run accessibility audit
8. Test on multiple devices/browsers