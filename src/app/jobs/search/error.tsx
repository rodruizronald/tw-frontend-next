'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary for Job Search Route
 *
 * Next.js native error handling specific to the job search page.
 * Provides a job-search-themed error UI with retry functionality.
 */
export default function JobSearchError({ error, reset }: ErrorProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Job search error:', error)
  }, [error])

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
      <Container maxWidth='sm'>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant='h5' gutterBottom fontWeight='bold'>
            Unable to load job search
          </Typography>
          <Typography variant='body1' color='text.secondary' paragraph>
            We encountered an error while loading the job search. This might be
            a temporary issue.
          </Typography>

          {isDevelopment && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                textAlign: 'left',
              }}
            >
              <Typography
                variant='caption'
                color='error'
                component='div'
                paragraph
              >
                <strong>Error:</strong> {error.message}
              </Typography>
              {error.digest && (
                <Typography variant='caption' color='text.secondary'>
                  Digest: {error.digest}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Button
              variant='contained'
              onClick={reset}
              sx={{
                mr: 1,
                bgcolor: '#0a66c2',
                '&:hover': { bgcolor: '#004182' },
              }}
            >
              Try Again
            </Button>
            <Button
              variant='outlined'
              onClick={() => (window.location.href = '/')}
              sx={{
                borderColor: '#0a66c2',
                color: '#0a66c2',
                '&:hover': { borderColor: '#004182', bgcolor: 'transparent' },
              }}
            >
              Go Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
