'use client'

/**
 * React Query Client Configuration
 *
 * Provides a configured QueryClient with sensible defaults for the application.
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Create a new QueryClient instance
 *
 * Note: In Next.js, we need to be careful about creating the QueryClient.
 * For client components, we create it once and reuse it.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: How long until a query is considered stale
        staleTime: 5 * 60 * 1000, // 5 minutes

        // Cache time: How long to keep unused data in cache
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

        // Retry configuration
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          const hasStatus =
            error && typeof error === 'object' && 'status' in error
          if (
            hasStatus &&
            typeof (error as { status: unknown }).status === 'number'
          ) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) {
              return false
            }
          }

          // Retry up to 3 times for other errors
          return failureCount < 3
        },

        // Retry delay with exponential backoff
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (good for search results)
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutation defaults
        retry: false, // Usually don't retry mutations
      },
    },
  })
}

// Browser-side singleton
let browserQueryClient: QueryClient | undefined

/**
 * Get the QueryClient instance
 *
 * - On the server: Creates a new client for each request
 * - On the browser: Reuses the same client instance
 */
export function getQueryClient(): QueryClient {
  // Server-side: always create a new client
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }

  // Browser-side: create once and reuse
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}
