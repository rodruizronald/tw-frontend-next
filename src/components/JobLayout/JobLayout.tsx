'use client'

/**
 * JobLayout Component
 *
 * Main layout component for the job search page.
 * Integrates header, filters, job list, and job details.
 */

import { Box } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { MouseEvent, ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { JobDetails, JobFilters, JobList } from '@/features/jobs/components'
import { PAGINATION } from '@/features/jobs/constants'
import {
  useCompanyOptions,
  useJobFilters,
  useJobPagination,
  useJobSearch,
} from '@/features/jobs/hooks'
import { filtersToURLParams } from '@/features/jobs/types/filters'
import type { Job } from '@/features/jobs/types/models'

import Header from '../Header'

// =============================================================================
// Constants
// =============================================================================

/** Default search query when none is provided */
const DEFAULT_SEARCH_QUERY = 'engineer'

// =============================================================================
// Component
// =============================================================================

export default function JobLayout(): ReactElement {
  // Next.js navigation hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get applied search query from URL (source of truth for executed searches)
  const appliedSearchQuery = useMemo(
    () => searchParams.get('q') ?? DEFAULT_SEARCH_QUERY,
    [searchParams]
  )

  // Search input state (controlled input, initialized from URL or default)
  const [searchQuery, setSearchQuery] = useState<string>(appliedSearchQuery)

  // Job search hook
  const {
    jobs: apiJobs,
    pagination: apiPagination,
    isFetching,
    search,
  } = useJobSearch()

  // Job filters hook
  const {
    filters,
    anchorEls,
    toggleFilter,
    setFilter,
    openDropdown,
    closeDropdown,
    getActiveCount,
  } = useJobFilters()

  // Company options hook
  const {
    companies,
    isLoading: isLoadingCompanies,
    refreshForSearch,
  } = useCompanyOptions()

  // Build complete filters with applied query (from URL)
  const buildFilters = useCallback(() => {
    return {
      ...filters,
      query: appliedSearchQuery,
    }
  }, [filters, appliedSearchQuery])

  // Pagination hook
  const {
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
  } = useJobPagination(apiJobs, apiPagination, search, buildFilters())

  // ==========================================================================
  // Handlers
  // ==========================================================================

  /**
   * Handle search button click
   * Updates URL with query and filters, which triggers the search via useEffect
   * If search query is empty, resets to default search query and submits
   */
  const handleSearch = useCallback(async (): Promise<void> => {
    // Use default search query if empty
    const queryToSearch = searchQuery.trim() || DEFAULT_SEARCH_QUERY

    // Reset input to default if it was empty
    if (!searchQuery.trim()) {
      setSearchQuery(DEFAULT_SEARCH_QUERY)
    }

    // Build filters with the search query
    const searchFilters = {
      ...filters,
      query: queryToSearch,
    }

    // Create URL params with query and existing filters
    const params = filtersToURLParams(searchFilters)

    // Update URL (this will trigger search via useEffect that watches URL)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })

    try {
      await search(searchFilters, {
        page: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.PAGE_SIZE,
      })

      // Clear selection
      setSelectedJobId(null)

      // Refresh company options based on new search
      await refreshForSearch(searchFilters)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }, [
    searchQuery,
    filters,
    search,
    router,
    pathname,
    setSelectedJobId,
    refreshForSearch,
  ])

  /**
   * Handle job selection
   */
  const handleJobSelect = useCallback(
    (job: Job): void => {
      setSelectedJobId(job.id)
    },
    [setSelectedJobId]
  )

  /**
   * Handle filter chip click to open dropdown
   */
  const handleFilterClick = useCallback(
    (filterKey: string, event: MouseEvent<HTMLElement>): void => {
      const chipElement =
        (event.currentTarget.closest('.MuiChip-root') as HTMLElement) ||
        event.currentTarget
      openDropdown(filterKey as Parameters<typeof openDropdown>[0], chipElement)
    },
    [openDropdown]
  )

  // Sync search input with URL when navigating (e.g., back/forward buttons)
  useEffect(() => {
    if (appliedSearchQuery && appliedSearchQuery !== searchQuery) {
      setSearchQuery(appliedSearchQuery)
    }
    // Only run when appliedSearchQuery changes (from URL navigation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearchQuery])

  // Perform initial search on mount with default query and filters
  useEffect(() => {
    const initialFilters = {
      ...filters,
      query: appliedSearchQuery,
    }

    search(initialFilters, {
      page: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.PAGE_SIZE,
    })

    refreshForSearch(initialFilters)
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header with search and filter chips */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        anchorEls={anchorEls}
        onFilterClick={handleFilterClick}
        getActiveFilterCount={getActiveCount}
      />

      {/* Filter dropdown menus */}
      <JobFilters
        filters={filters}
        anchorEls={anchorEls}
        onCloseDropdown={closeDropdown}
        onToggleFilter={toggleFilter}
        onSetDatePreset={(_, value) => setFilter('datePreset', value)}
        onSetLanguage={value => setFilter('language', value)}
        companyOptions={companies}
        isLoadingCompanies={isLoadingCompanies}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          bgcolor: '#f5f5f5',
          px: { xs: 2, sm: 4, md: 8, lg: 18, xl: 36 },
          py: 2,
        }}
      >
        {/* Job List */}
        <Box
          sx={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <JobList
            jobs={currentPageJobs}
            selectedJobId={selectedJobId ?? ''}
            onJobSelect={handleJobSelect}
            resultsCount={totalJobs}
            searchQuery={appliedSearchQuery}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isFetching={isFetching}
          />
        </Box>

        {/* Job Details */}
        <Box
          sx={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <JobDetails job={selectedJob} isFetching={isFetching} />
        </Box>
      </Box>
    </Box>
  )
}
