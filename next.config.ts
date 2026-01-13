import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server packages that should not be bundled
  serverExternalPackages: ['@react-pdf/renderer', 'puppeteer'],

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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'poze.prynt.ro',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-6b8f161e90f040688bbfecff19d5cac3.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbxt.replicate.delivery',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return [

      {
        source: '/banner',
        destination: 'https://www.shopprint.ro/banner',
        permanent: true,
      },
      {
        source: '/banner/:path*',
        destination: 'https://www.shopprint.ro/banner/:path*',
        permanent: true,
      },
      {
        source: '/rollup',
        destination: 'https://www.shopprint.ro/rollup',
        permanent: true,
      },
      {
        source: '/rollup/:path*',
        destination: 'https://www.shopprint.ro/rollup/:path*',
        permanent: true,
      },
      {
        source: '/autocolante',
        destination: 'https://www.shopprint.ro/autocolante',
        permanent: true,
      },
      {
        source: '/autocolante/:path*',
        destination: 'https://www.shopprint.ro/autocolante/:path*',
        permanent: true,
      },
      {
        source: '/materiale',
        destination: 'https://www.shopprint.ro/materiale',
        permanent: true,
      },
      {
        source: '/materiale/:path*',
        destination: 'https://www.shopprint.ro/materiale/:path*',
        permanent: true,
      },
      {
        source: '/product/materiale/:path*',
        destination: '/materiale/:path*',
        permanent: true,
      },
      {
        source: '/product/autocolante/:path*',
        destination: '/autocolante/:path*',
        permanent: true,
      },
      {
        source: '/product/banner/:path*',
        destination: '/banner/:path*',
        permanent: true,
      },
      {
        source: '/product/canvas/:path*',
        destination: '/canvas/:path*',
        permanent: true,
      },
      {
        source: '/product/afise/:path*',
        destination: '/afise/:path*',
        permanent: true,
      },
      {
        source: '/product/tapet/:path*',
        destination: '/tapet/:path*',
        permanent: true,
      },
      {
        source: '/tapet/sustenabilitate',
        destination: '/tapet',
        permanent: true,
      },
      {
        source: '/tapet/montaj',
        destination: '/tapet',
        permanent: true,
      },
      {
        source: '/tapet/instructiuni',
        destination: '/tapet',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</_next/static/css/app/layout.css>; rel=preload; as=style, <https://www.googletagmanager.com>; rel=preconnect, <https://res.cloudinary.com>; rel=preconnect',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
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
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;