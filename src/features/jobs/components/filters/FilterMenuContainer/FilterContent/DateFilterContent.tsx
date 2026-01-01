'use client'

/**
 * DateFilterContent Component
 *
 * Radio button list for selecting date presets.
 */

import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import type { ChangeEvent } from 'react'

import type { DatePreset } from '../../../../types/filters'
import type { FilterOption } from '../../filterConfig'

// =============================================================================
// Types
// =============================================================================

interface DateFilterContentProps {
  /** Available date preset options */
  options: FilterOption[]
  /** Currently selected value */
  value: DatePreset
  /** Change handler */
  onChange: (value: DatePreset) => void
}

// =============================================================================
// Component
// =============================================================================

/**
 * Date filter content with radio buttons
 */
export default function DateFilterContent({
  options,
  value,
  onChange,
}: DateFilterContentProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as DatePreset)
  }

  return (
    <RadioGroup value={value} onChange={handleChange}>
      {options.map(option => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              sx={{
                color: '#057642',
                '&.Mui-checked': {
                  color: '#057642',
                },
              }}
            />
          }
          label={option.label}
          sx={{
            px: 1.5,
          }}
        />
      ))}
    </RadioGroup>
  )
}
