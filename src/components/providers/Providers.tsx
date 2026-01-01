'use client'

/**
 * Application Providers
 *
 * This component wraps the application with all necessary providers:
 * - MUI ThemeProvider for Material UI styling
 * - React Query Provider for data fetching
 * - Error Boundary for graceful error handling
 *
 * Usage (in layout.tsx):
 * ```tsx
 * import { Providers } from '@/components/providers'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactElement, type ReactNode } from 'react'

import { getQueryClient } from '@/lib/query'
import { theme } from '@/lib/theme'

import { ErrorBoundaryProvider } from './ErrorBoundaryProvider'

// =============================================================================
// Types
// =============================================================================

interface ProvidersProps {
  children: ReactNode
}

// =============================================================================
// Provider Component
// =============================================================================

/**
 * Root Providers Component
 *
 * Wraps the application with all necessary context providers.
 * Order matters:
 * 1. ErrorBoundary (outermost - catches errors from all children)
 * 2. QueryClientProvider (for data fetching)
 * 3. ThemeProvider (for MUI styling)
 */
export function Providers({ children }: ProvidersProps): ReactElement {
  // Get or create the query client
  const queryClient = getQueryClient()

  return (
    <ErrorBoundaryProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline provides consistent baseline styles */}
          <CssBaseline />
          {children}
        </ThemeProvider>

        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundaryProvider>
  )
}
