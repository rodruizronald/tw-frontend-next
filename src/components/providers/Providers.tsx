'use client'

/**
 * Application Providers
 *
 * This component wraps the application with all necessary providers:
 * - MUI ThemeProvider for Material UI styling
 * - React Query Provider for data fetching
 *
 * Note: Error handling is done via Next.js native error.tsx files.
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
import { type ReactElement, type ReactNode, useState } from 'react'

import { makeQueryClient } from '@/lib/query'
import { theme } from '@/lib/theme'

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
 * Error handling is done via Next.js native error.tsx files.
 *
 * QueryClient is created using useState to ensure:
 * - Single instance per component lifecycle
 * - No hydration mismatches (avoids typeof window checks)
 * - Follows TanStack Query's recommended Next.js pattern
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */
export function Providers({ children }: ProvidersProps): ReactElement {
  // Create QueryClient once using useState (TanStack Query recommended pattern)
  const [queryClient] = useState(makeQueryClient)

  return (
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
  )
}
