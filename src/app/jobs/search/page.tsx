import type { Metadata } from 'next'

/**
 * Page Metadata
 * SEO configuration for the job search page
 */
export const metadata: Metadata = {
  title: 'Search Jobs',
  description:
    'Search for tech jobs in Costa Rica. Find remote and on-site positions from top tech companies.',
}

/**
 * Job Search Page
 *
 * This page will render the job search interface.
 * The JobLayout component will be added in Phase 4.
 */
export default function JobSearchPage(): React.ReactElement {
  return (
    <main>
      {/* 
        TODO: Add JobLayout component in Phase 4
        <JobLayout />
      */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1>Ticos in Tech - Job Search</h1>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Job search interface coming in Phase 4...
        </p>
        <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.875rem' }}>
          ✅ Phase 3 Complete: Providers are working!
        </p>
      </div>
    </main>
  )
}
