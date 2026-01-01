/**
 * Job Service
 *
 * High-level service layer for job-related operations.
 * Orchestrates repository calls and transforms data to frontend format.
 *
 * All functions accept a Supabase client as the first parameter,
 * enabling use from both Server Components and Client Components.
 *
 * @example Server Component usage:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 * import { searchJobs } from '@/features/jobs/api/jobService'
 *
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const result = await searchJobs(supabase, filters, pagination)
 * }
 * ```
 */

import type { SupabaseAppError } from '@/lib/supabase/errors'
import type { SupabaseClient } from '@/lib/supabase/types'

import type { JobSearchFilters, JobSearchPagination } from '../types/filters'
import { toSearchJobsRpcParams } from '../types/filters'
import type { Job, SearchResponse } from '../types/models'
import { searchJobs as searchJobsRepository } from './jobRepository'
import {
  createEmptySearchResponse,
  transformSearchResponse,
} from './transformer'

// =============================================================================
// Types
// =============================================================================

/**
 * Search response with optional error information
 */
export interface JobSearchResponse extends SearchResponse {
  /** Error details if the search failed */
  error?: SupabaseAppError
}

/**
 * Result of fetching a single job
 */
export interface JobDetailResponse {
  /** The job if found */
  job: Job | null
  /** Error details if the fetch failed */
  error?: SupabaseAppError
}

// =============================================================================
// Search Operations
// =============================================================================

/**
 * Search for jobs with filters and pagination
 *
 * This is the main entry point for job searches. It:
 * 1. Converts frontend filters to RPC parameters
 * 2. Calls the repository to execute the search
 * 3. Transforms the results to frontend format
 * 4. Handles errors gracefully
 *
 * @param supabase - Supabase client (server or browser)
 * @param filters - Search filters including the query string
 * @param pagination - Pagination options (page, pageSize)
 * @returns Search results with jobs, pagination, and optional error
 */
export async function searchJobs(
  supabase: SupabaseClient,
  filters: JobSearchFilters,
  pagination: JobSearchPagination = {}
): Promise<JobSearchResponse> {
  const page = pagination.page ?? 1
  const pageSize = pagination.pageSize ?? 20

  // Convert frontend filters to RPC parameters
  const rpcParams = toSearchJobsRpcParams(filters, { page, pageSize })

  // Execute the search via repository
  const result = await searchJobsRepository(supabase, rpcParams)

  // Handle errors
  if (result.error) {
    return {
      ...createEmptySearchResponse(page, pageSize),
      error: result.error,
    }
  }

  // Transform and return successful results
  return transformSearchResponse({
    jobs: result.data,
    totalCount: result.totalCount,
    page,
    pageSize,
  })
}

// =============================================================================
// Service Object (Alternative API)
// =============================================================================

/**
 * Job service object
 *
 * Provides an object-based API for job operations.
 * Use this if you prefer dependency injection or method organization.
 */
export const jobService = {
  /**
   * Search for jobs
   * @see searchJobs
   */
  search: searchJobs,
} as const

export default jobService
