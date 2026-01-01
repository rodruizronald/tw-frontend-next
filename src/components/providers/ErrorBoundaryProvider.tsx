'use client'

/**
 * Error Boundary Provider
 *
 * Wraps the application with a React error boundary for graceful error handling.
 * Shows a user-friendly error UI when React components crash.
 */

import { Box, Button, Container, Typography } from '@mui/material'
import { type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { logger } from '@/lib/logging'

// =============================================================================
// Types
// =============================================================================

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProviderProps {
  children: ReactNode
}

// =============================================================================
// Error Handler
// =============================================================================

/**
 * Log errors caught by the error boundary
 */
function handleError(error: Error, errorInfo: ErrorInfo): void {
  const errorContext = {
    component: 'ErrorBoundaryProvider',
    action: 'catch-error',
    componentStack: errorInfo.componentStack ?? 'No component stack available',
    errorBoundary: true,
    // Only access browser APIs if available
    ...(typeof window !== 'undefined' && {
      userAgent: navigator.userAgent,
      url: window.location.href,
    }),
    timestamp: new Date().toISOString(),
  }
  logger.error('React Error Boundary caught an error', errorContext, error)
}

// =============================================================================
// Fallback Component
// =============================================================================

/**
 * Error fallback UI shown when an error is caught
 */
function GlobalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps): ReactElement {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const handleRetry = (): void => {
    logger.userAction('error-boundary-retry', 'ErrorBoundaryProvider', {
      errorMessage: error.message,
    })
    resetErrorBoundary()
  }

  const handleRefresh = (): void => {
    logger.userAction('error-boundary-refresh', 'ErrorBoundaryProvider', {
      errorMessage: error.message,
    })
    window.location.reload()
  }

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
          We&apos;re sorry for the inconvenience. Please try refreshing the
          page.
        </Typography>

        {/* Show error details in development */}
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
            {error.stack && (
              <Typography
                variant='caption'
                color='error'
                component='pre'
                sx={{
                  fontSize: '0.7rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  textAlign: 'left',
                }}
              >
                {error.stack}
              </Typography>
            )}
          </Box>
        )}

        <Box mt={2}>
          <Button variant='contained' onClick={handleRetry} sx={{ mr: 1 }}>
            Try Again
          </Button>
          <Button variant='outlined' onClick={handleRefresh}>
            Refresh Page
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

// =============================================================================
// Provider Component
// =============================================================================

/**
 * Error Boundary Provider
 *
 * Wraps children with a React error boundary.
 * Catches JavaScript errors in child component tree and displays fallback UI.
 */
export function ErrorBoundaryProvider({
  children,
}: ErrorBoundaryProviderProps): ReactElement {
  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  )
}
