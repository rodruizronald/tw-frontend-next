import './globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { Providers } from '@/components/providers'

/**
 * Roboto font configuration
 * Matches MUI's default typography
 */
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

/**
 * Site Metadata
 * SEO and social sharing configuration
 */
export const metadata: Metadata = {
  // Base URL for resolving relative URLs in metadata
  metadataBase: new URL(
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://ticosintech.com'
  ),

  title: {
    default: 'Ticos in Tech - Costa Rica Tech Jobs',
    template: '%s | Ticos in Tech',
  },
  description:
    'Find the best tech jobs in Costa Rica. Browse remote and on-site positions from top tech companies.',
  keywords: [
    'tech jobs',
    'costa rica',
    'remote work',
    'software developer',
    'programming jobs',
    'IT jobs',
    'empleos tecnologia',
    'trabajo remoto',
  ],
  authors: [{ name: 'Ticos in Tech' }],
  creator: 'Ticos in Tech',
  publisher: 'Ticos in Tech',

  // Favicon and icons
  // TODO: Add apple-touch-icon.png (180x180) for iOS devices
  icons: {
    icon: '/favicon.svg',
    // apple: '/apple-touch-icon.png', // Uncomment when available
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  // TODO: Create og-image.png (1200x630) for better social sharing previews
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_CR',
    url: '/',
    siteName: 'Ticos in Tech',
    title: 'Ticos in Tech - Costa Rica Tech Jobs',
    description:
      'Find the best tech jobs in Costa Rica. Browse remote and on-site positions from top tech companies.',
    // images: [
    //   {
    //     url: '/og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Ticos in Tech - Find Tech Jobs in Costa Rica',
    //   },
    // ],
  },

  // Twitter Card
  // TODO: Create twitter-image.png (1200x600) for Twitter previews
  twitter: {
    card: 'summary',
    title: 'Ticos in Tech - Costa Rica Tech Jobs',
    description:
      'Find the best tech jobs in Costa Rica. Browse remote and on-site positions from top tech companies.',
    // images: ['/og-image.png'], // Uncomment when available
    creator: '@ticosintech',
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * Root Layout
 *
 * The root layout wraps all pages with:
 * - Providers: MUI Theme, React Query, Error Boundary
 * - Roboto font from next/font/google
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
