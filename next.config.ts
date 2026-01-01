import type { NextConfig } from 'next'

/**
 * Next.js Configuration
 *
 * Production-ready configuration for the Ticos in Tech job board.
 * Includes security headers, image optimization, and performance settings.
 */
const nextConfig: NextConfig = {
  // ==========================================================================
  // Image Optimization
  // ==========================================================================
  images: {
    // Remote patterns for company logos and external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
    // Supported formats for optimization
    formats: ['image/avif', 'image/webp'],
  },

  // ==========================================================================
  // Security Headers
  // ==========================================================================
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
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // ==========================================================================
  // Redirects
  // ==========================================================================
  async redirects() {
    return [
      // Redirect old routes if migrating from different URL structure
      // {
      //   source: '/search',
      //   destination: '/jobs/search',
      //   permanent: true,
      // },
    ]
  },

  // ==========================================================================
  // Performance & Build Settings
  // ==========================================================================

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Powered by header (disable for security)
  poweredByHeader: false,

  // Compression is usually handled by the hosting platform (Vercel, etc.)
  // compress: true,

  // ==========================================================================
  // Experimental Features
  // ==========================================================================
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@tanstack/react-query',
      'date-fns',
    ],
  },

  // ==========================================================================
  // Logging
  // ==========================================================================
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
