'use client'

/**
 * useJobFilters Hook
 *
 * Manages filter state for job search including:
 * - Multi-select filters (arrays)
 * - Single-select filters (radio buttons)
 * - Dropdown anchor elements
 * - URL synchronization (one-way: URL -> state only)
 *
 * Note: Filter changes do NOT automatically update the URL.
 * URL is only updated when user clicks the Search button (handled in JobLayout).
 * This optimizes performance by avoiding unnecessary requests on each filter toggle.
 */

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type {
  DatePreset,
  FilterKey,
  JobSearchFilters,
  MultiSelectFilterKey,
  SingleSelectFilterKey,
} from '../types/filters'
import {
  countFilterSelections,
  hasActiveFilters,
  MULTI_SELECT_FILTER_KEYS,
  SINGLE_SELECT_FILTER_KEYS,
  toggleFilterValue,
  urlParamsToFilters,
} from '../types/filters'

// =============================================================================
// Types
// =============================================================================

/**
 * Anchor elements state for filter dropdowns
 */
export type AnchorElements = Record<FilterKey, HTMLElement | null>

/**
 * Return type for the useJobFilters hook
 */
export interface UseJobFiltersReturn {
  // Filter values
  /** Current filter state */
  filters: Partial<JobSearchFilters>

  // Anchor elements for dropdowns
  /** Anchor elements for each filter dropdown */
  anchorEls: AnchorElements

  // Filter actions
  /** Toggle a value in a multi-select filter */
  toggleFilter: (key: MultiSelectFilterKey, value: string) => void
  /** Set a single-select filter value */
  setFilter: <K extends SingleSelectFilterKey>(
    key: K,
    value: K extends 'language' ? string : DatePreset
  ) => void
  /** Clear a specific filter */
  clearFilter: (key: FilterKey) => void
  /** Clear all filters */
  clearAllFilters: () => void

  // Dropdown actions
  /** Open a filter dropdown */
  openDropdown: (key: FilterKey, el: HTMLElement) => void
  /** Close a filter dropdown */
  closeDropdown: (key: FilterKey) => void
  /** Check if a dropdown is open */
  isDropdownOpen: (key: FilterKey) => boolean

  // Utilities
  /** Get the count of active selections for a filter */
  getActiveCount: (key: FilterKey) => number
  /** Get total count of all active filters */
  getTotalActiveCount: () => number
  /** Check if a specific value is selected in a filter */
  isFilterActive: (key: FilterKey, value: string) => boolean
  /** Check if any filters are active */
  hasFilters: boolean
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Initial anchor elements state
 */
const INITIAL_ANCHORS: AnchorElements = {
  experienceLevel: null,
  employmentType: null,
  workMode: null,
  province: null,
  jobFunction: null,
  company: null,
  language: null,
  datePreset: null,
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Hook for managing job search filters
 *
 * @param syncWithUrl - Whether to sync filter state with URL (default: true)
 * @returns Filter state and actions
 *
 * @example
 * ```typescript
 * const {
 *   filters,
 *   toggleFilter,
 *   setFilter,
 *   clearAllFilters,
 *   getActiveCount,
 * } = useJobFilters()
 *
 * // Toggle a multi-select filter
 * toggleFilter('experienceLevel', 'senior')
 *
 * // Set a single-select filter
 * setFilter('datePreset', 'week')
 *
 * // Get active count for a filter
 * const count = getActiveCount('experienceLevel') // Returns number of selected levels
 * ```
 */
export function useJobFilters(
  syncWithUrl: boolean = true
): UseJobFiltersReturn {
  // Next.js navigation hooks
  const searchParams = useSearchParams()

  // Filter state - initialize from URL on mount
  const [filters, setFilters] = useState<Partial<JobSearchFilters>>(() => {
    if (syncWithUrl) {
      const urlFilters = urlParamsToFilters(searchParams)
      // Default single-select filters if not specified
      return {
        ...urlFilters,
        language: urlFilters.language ?? 'english',
        datePreset: urlFilters.datePreset ?? 'any',
      }
    }
    return { language: 'english', datePreset: 'any' }
  })

  // Anchor elements for dropdowns
  const [anchorEls, setAnchorEls] = useState<AnchorElements>(INITIAL_ANCHORS)

  // Track if this is the initial mount (skip URL sync on mount)
  const isInitialMount = useRef(true)

  // ==========================================================================
  // URL Sync
  // ==========================================================================

  /**
   * Sync filters FROM URL when URL changes externally
   * (e.g., browser back/forward, or Search button updating URL)
   */
  useEffect(() => {
    // Skip if URL sync is disabled
    if (!syncWithUrl) return

    // Skip on initial mount (already initialized from URL in useState)
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Parse filters from current URL and update state
    const urlFilters = urlParamsToFilters(searchParams)
    // Default single-select filters if not specified
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: syncing state from external URL changes
    setFilters({
      ...urlFilters,
      language: urlFilters.language ?? 'english',
      datePreset: urlFilters.datePreset ?? 'any',
    })
  }, [searchParams, syncWithUrl])

  // ==========================================================================
  // Filter Actions
  // ==========================================================================

  /**
   * Toggle a value in a multi-select filter
   * Note: Does not sync to URL - URL is updated when user clicks Search
   */
  const toggleFilter = useCallback(
    (key: MultiSelectFilterKey, value: string): void => {
      setFilters(prev => {
        const currentValues = prev[key] as string[] | undefined
        const newValues = toggleFilterValue(currentValues, value)

        const newFilters = {
          ...prev,
          [key]: newValues.length > 0 ? newValues : undefined,
        }

        // Clean up undefined values
        if (newFilters[key] === undefined) {
          delete newFilters[key]
        }

        return newFilters
      })
    },
    []
  )

  /**
   * Set a single-select filter value
   * Note: Does not sync to URL - URL is updated when user clicks Search
   */
  const setFilter = useCallback(
    <K extends SingleSelectFilterKey>(
      key: K,
      value: K extends 'language' ? string : DatePreset
    ): void => {
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [key]: value,
        }

        return newFilters
      })
    },
    []
  )

  /**
   * Clear a specific filter
   * Note: Does not sync to URL - URL is updated when user clicks Search
   */
  const clearFilter = useCallback((key: FilterKey): void => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]

      return newFilters
    })
  }, [])

  /**
   * Clear all filters
   * Note: Does not sync to URL - URL is updated when user clicks Search
   */
  const clearAllFilters = useCallback((): void => {
    setFilters(prev => {
      const newFilters: Partial<JobSearchFilters> = {}

      // Preserve query if it exists
      if (prev.query) {
        newFilters.query = prev.query
      }

      return newFilters
    })
  }, [])

  // ==========================================================================
  // Dropdown Actions
  // ==========================================================================

  /**
   * Open a filter dropdown
   */
  const openDropdown = useCallback((key: FilterKey, el: HTMLElement): void => {
    setAnchorEls(prev => ({ ...prev, [key]: el }))
  }, [])

  /**
   * Close a filter dropdown
   */
  const closeDropdown = useCallback((key: FilterKey): void => {
    setAnchorEls(prev => ({ ...prev, [key]: null }))
  }, [])

  /**
   * Check if a dropdown is open
   */
  const isDropdownOpen = useCallback(
    (key: FilterKey): boolean => {
      return anchorEls[key] !== null
    },
    [anchorEls]
  )

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  /**
   * Get the count of active selections for a filter
   */
  const getActiveCount = useCallback(
    (key: FilterKey): number => {
      return countFilterSelections(filters, key)
    },
    [filters]
  )

  /**
   * Get total count of all active filters
   */
  const getTotalActiveCount = useCallback((): number => {
    let count = 0

    // Count multi-select filters
    for (const key of MULTI_SELECT_FILTER_KEYS) {
      const value = filters[key]
      if (Array.isArray(value)) {
        count += value.length
      }
    }

    // Count single-select filters (count as 1 if any value is set)
    for (const key of SINGLE_SELECT_FILTER_KEYS) {
      const value = filters[key]
      if (value) count += 1
    }

    return count
  }, [filters])

  /**
   * Check if a specific value is selected in a filter
   */
  const isFilterActive = useCallback(
    (key: FilterKey, value: string): boolean => {
      const filterValue = filters[key]

      if (Array.isArray(filterValue)) {
        return (filterValue as string[]).includes(value)
      }

      return filterValue === value
    },
    [filters]
  )

  /**
   * Check if any filters are active
   */
  const hasFilters = useMemo(
    (): boolean => hasActiveFilters(filters),
    [filters]
  )

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // Filter values
    filters,

    // Anchor elements
    anchorEls,

    // Filter actions
    toggleFilter,
    setFilter,
    clearFilter,
    clearAllFilters,

    // Dropdown actions
    openDropdown,
    closeDropdown,
    isDropdownOpen,

    // Utilities
    getActiveCount,
    getTotalActiveCount,
    isFilterActive,
    hasFilters,
  }
}
