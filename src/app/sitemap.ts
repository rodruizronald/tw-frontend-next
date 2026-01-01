import type { MetadataRoute } from 'next'

/**
 * Sitemap Configuration
 *
 * Generates a sitemap.xml for search engine discovery.
 * Currently includes static routes; can be extended to include dynamic job pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for production URL or fallback
  const baseUrl =
    process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://ticosintech.com'

  // Current date for lastModified
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs/search`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    // Future: Add dynamic job detail pages
    // {
    //   url: `${baseUrl}/jobs/${jobId}`,
    //   lastModified: job.updatedAt,
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}
