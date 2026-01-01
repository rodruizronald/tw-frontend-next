import type { MetadataRoute } from 'next'

/**
 * Robots.txt Configuration
 *
 * Controls how search engines crawl and index the site.
 * Generated dynamically by Next.js.
 */
export default function robots(): MetadataRoute.Robots {
  // Use environment variable for production URL or fallback
  const baseUrl =
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://ticosintech.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
