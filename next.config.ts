import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server packages that should not be bundled
  serverExternalPackages: ['@react-pdf/renderer', 'puppeteer', 'zeptomatch', 'grammex'],

  // Standalone output for smaller production footprint (recommended for Railway/Docker)
  output: 'standalone',

  async redirects() {
    return [
      // Canonicalize non-www -> www
      {
        source: "/:path*",
        has: [{ type: "host", value: "tablou.net" }],
        destination: "https://www.tablou.net/:path*",
        permanent: true,
      },
      {
        source: '/banner',
        destination: '/configurator/banner',
        permanent: true,
      },
      {
        source: '/autocolante',
        destination: '/configurator/autocolante',
        permanent: true,
      },
      {
        source: '/canvas',
        destination: '/configurator/canvas',
        permanent: true,
      },
      {
        source: '/afise',
        destination: '/configurator/afise',
        permanent: true,
      },
      {
        source: '/pliante',
        destination: '/configurator/pliante',
        permanent: true,
      },
      {
        source: '/flayere',
        destination: '/configurator/flyere',
        permanent: true,
      },
      {
        source: '/rollup',
        destination: '/configurator/rollup',
        permanent: true,
      },
      {
        source: '/tapet',
        destination: '/configurator/tapet',
        permanent: true,
      },
      {
        source: '/window-graphics',
        destination: '/configurator/window-graphics',
        permanent: true,
      },
      {
        source: '/tricouri',
        destination: '/configurator/tricouri',
        permanent: true,
      },
      {
        source: '/hanorace',
        destination: '/configurator/hanorace',
        permanent: true,
      },
      {
        source: '/sepci',
        destination: '/configurator/sepci',
        permanent: true,
      },
      {
        source: '/carti-vizita',
        destination: '/configurator/carti-vizita',
        permanent: true,
      },
      {
        source: '/banner-verso',
        destination: '/configurator/banner-verso',
        permanent: true,
      },
      {
        source: '/materiale/carton',
        destination: '/configurator/materiale/carton',
        permanent: true,
      },
      {
        source: '/materiale/plexiglass',
        destination: '/configurator/materiale/plexiglass',
        permanent: true,
      },
      {
        source: '/materiale/alucobond',
        destination: '/configurator/materiale/alucobond',
        permanent: true,
      },
      {
        source: '/materiale/polipropilena',
        destination: '/configurator/materiale/polipropilena',
        permanent: true,
      },
      {
        source: '/materiale/pvc-forex',
        destination: '/configurator/materiale/pvc-forex',
        permanent: true,
      },
    ];
  },

  // Configure for modern browsers (ES2020+)
  env: {
    BROWSERSLIST_ENV: 'modern',
  },

  // Production optimizations
  /*
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  */

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // SWC compiler options for modern browsers
  // This tells Next.js to NOT transpile modern JS features
  experimental: {
    /*
    serverActions: {
      bodySizeLimit: '10mb',
    },
    */

    // Modern JavaScript features for browsers that support them natively
    // esmExternals: true,

    // Optimize for modern browsers - reduces bundle size
    // optimizePackageImports: ['lucide-react', 'framer-motion'],

    // CSS optimizations - disabled to fix Turbopack build failure
    // optimizeCss: true,
    // cssChunking: 'strict',
  },

  /*
  // Turbopack configuration for modern browsers
  turbopack: {
    resolveAlias: {
      // Modern JavaScript targeting to eliminate polyfills
    },
  },
  */

  images: {
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'poze.tablou.net', pathname: '/**' },
      { protocol: 'https', hostname: '*.r2.dev', pathname: '/**' },
      { protocol: 'https', hostname: 'shop.printcenter.ro', pathname: '/**' },
      { protocol: 'https', hostname: 'www.printcenter.ro', pathname: '/**' },
      { protocol: 'https', hostname: 'dotcomcanvas.de', pathname: '/**' },
      { protocol: 'http', hostname: 'dotcomcanvas.de', pathname: '/**' }
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com *.googleadservices.com *.googlesyndication.com *.doubleclick.net connect.facebook.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' blob: data: res.cloudinary.com images.unsplash.com poze.tablou.net *.r2.dev shop.printcenter.ro www.printcenter.ro dotcomcanvas.de *.hotnews.ro hotnews.ro *.replicate.delivery replicate.delivery pbxt.replicate.delivery *.google-analytics.com *.googletagmanager.com *.googlesyndication.com *.googleadservices.com *.doubleclick.net *.google.com *.google.ro *.facebook.com; font-src 'self' fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.googletagmanager.com *.analytics.google.com *.googlesyndication.com *.googleadservices.com *.doubleclick.net *.google.com *.google.ro *.facebook.com connect.facebook.net; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com *.doubleclick.net *.google.com *.facebook.com;",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          }
        ],
      },
      {
        source: '/globals.css',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;