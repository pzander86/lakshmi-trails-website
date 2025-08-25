// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lakshmitrails.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [
        'https://lakshmitrails.com/',
        'https://lakshmitrails.com/tours/living-traditions',
        'https://lakshmitrails.com/tours/mysore-mystique', 
        'https://lakshmitrails.com/tours/sacred-waters',
      ],
      serialize(item) {
        // Customize priority based on page importance
        if (item.url === 'https://lakshmitrails.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/tours/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor libraries
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // Split forms into separate chunk
            if (id.includes('BookingForm')) {
              return 'forms';
            }
          },
          // Optimize chunk loading
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]'
        },
      },
    },
  },
});