'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error Boundary for App Routes
 *
 * Next.js native error handling - catches errors in route segments.
 * This replaces the need for react-error-boundary.
 */
export default function Error({ error, reset }: ErrorProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route error:', error)
  }, [error])

  return (
    <Container maxWidth='sm'>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        minHeight='100vh'
        textAlign='center'
      >
        <Typography variant='h4' gutterBottom>
          Oops! Something went wrong
        </Typography>
        <Typography variant='body1' color='text.secondary' paragraph>
          We&apos;re sorry for the inconvenience. Please try again.
        </Typography>

        {isDevelopment && (
          <Box mt={2} p={2} bgcolor='grey.100' borderRadius={1} width='100%'>
            <Typography
              variant='caption'
              color='error'
              paragraph
              component='div'
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

        <Box mt={2}>
          <Button variant='contained' onClick={reset} sx={{ mr: 1 }}>
            Try Again
          </Button>
          <Button variant='outlined' onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
