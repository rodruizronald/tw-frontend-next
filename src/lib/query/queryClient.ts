/**
 * React Query Client Configuration
 *
 * Provides a configured QueryClient factory with sensible defaults.
 * The QueryClient instance is created and managed in the Providers component
 * using useState, which is TanStack Query's recommended pattern for Next.js.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * Create a new QueryClient instance with application defaults
 *
 * This factory function is called once in the Providers component via useState.
 * Using useState ensures the client is created once per component lifecycle,
 * avoiding hydration mismatches and unnecessary re-creation.
 */
export function makeQueryClient(): QueryClient {
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

        // Refetch on window focus
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutation defaults
        retry: false, // Usually don't retry mutations
      },
    },
  })
}
