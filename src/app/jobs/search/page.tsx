import { Box, CircularProgress } from '@mui/material'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import JobLayout from '@/components/JobLayout'

/**
 * Page Metadata
 * SEO configuration for the job search page
 */
export const metadata: Metadata = {
  title: 'Search Jobs',
  description:
    'Search for tech jobs in Costa Rica. Find remote and on-site positions from top tech companies.',
  keywords: [
    'job search',
    'tech jobs costa rica',
    'remote developer jobs',
    'software engineer positions',
    'IT careers',
    'buscar empleo',
    'trabajos tecnologia',
  ],
  openGraph: {
    title: 'Search Tech Jobs | Ticos in Tech',
    description:
      'Browse and filter tech job opportunities in Costa Rica. Find your next role in software development, engineering, and IT.',
    url: '/jobs/search',
  },
}

/**
 * Loading fallback for job search page
 */
function JobSearchLoading(): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <CircularProgress size={48} />
    </Box>
  )
}

/**
 * Job Search Page
 *
 * Main job search interface with filters, job list, and job details.
 * Wrapped in Suspense because it uses useSearchParams() which requires
 * a Suspense boundary in Next.js App Router.
 */
export default function JobSearchPage(): React.ReactElement {
  return (
    <Suspense fallback={<JobSearchLoading />}>
      <JobLayout />
    </Suspense>
  )
}
