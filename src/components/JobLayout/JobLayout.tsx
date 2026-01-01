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
import { useCallback, useEffect, useRef, useState } from 'react'

import { JobDetails, JobFilters, JobList } from '@/features/jobs/components'
import { PAGINATION } from '@/features/jobs/constants'
import {
  useCompanyOptions,
  useJobFilters,
  useJobPagination,
  useJobSearch,
} from '@/features/jobs/hooks'
import type { Job } from '@/features/jobs/types/models'

import Header from '../Header'

// =============================================================================
// Helpers
// =============================================================================

/**
 * Reset URL to page 1 (remove page parameter)
 * Updated for Next.js App Router
 */
const resetToPageOne = (
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams
): void => {
  const newSearchParams = new URLSearchParams(searchParams.toString())
  newSearchParams.delete('p')

  const newUrl = newSearchParams.toString()
    ? `${pathname}?${newSearchParams.toString()}`
    : pathname

  router.replace(newUrl)
}

// =============================================================================
// Component
// =============================================================================

export default function JobLayout(): ReactElement {
  // Next.js navigation hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('')

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

  // Build complete filters with query
  const buildFilters = useCallback(() => {
    return {
      ...filters,
      query: searchQuery,
    }
  }, [filters, searchQuery])

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
   */
  const handleSearch = useCallback(async (): Promise<void> => {
    if (!searchQuery.trim()) return

    // Reset to page 1 using Next.js router
    resetToPageOne(
      router,
      pathname,
      new URLSearchParams(searchParams.toString())
    )

    try {
      const searchFilters = buildFilters()

      await search(searchFilters, {
        page: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.PAGE_SIZE,
      })

      // Clear selection and update applied query
      setSelectedJobId(null)
      setAppliedSearchQuery(searchQuery)

      // Refresh company options based on new search
      await refreshForSearch(searchFilters)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }, [
    searchQuery,
    buildFilters,
    search,
    router,
    pathname,
    searchParams,
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

  // Track previous filters to detect changes
  const prevFiltersJsonRef = useRef<string>('')

  // Re-search when filters change (after initial search has been performed)
  useEffect(() => {
    // Skip if no search has been performed yet
    if (!appliedSearchQuery) {
      return
    }

    // Compare filters by JSON to detect actual changes
    const currentFiltersJson = JSON.stringify(filters)
    if (prevFiltersJsonRef.current === currentFiltersJson) {
      return
    }

    // Update ref and trigger search
    prevFiltersJsonRef.current = currentFiltersJson

    const searchFilters = {
      ...filters,
      query: appliedSearchQuery,
    }

    search(searchFilters, {
      page: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.PAGE_SIZE,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, appliedSearchQuery]) // search is stable from useJobSearch

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
