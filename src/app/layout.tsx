import './globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

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
  ],
  icons: {
    icon: '/favicon.svg',
  },
}

/**
 * Root Layout
 *
 * The root layout wraps all pages. Providers (MUI Theme, React Query, etc.)
 * will be added in Phase 3 of the migration.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang='en'>
      <body className={roboto.className}>
        {/* TODO: Add Providers wrapper in Phase 3 */}
        {children}
      </body>
    </html>
  )
}
