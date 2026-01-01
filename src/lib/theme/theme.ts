'use client'

/**
 * MUI Theme Configuration
 *
 * This module provides the Material UI theme configuration.
 * The theme is created with default settings and can be customized as needed.
 *
 * Usage:
 * ```typescript
 * import { theme } from '@/lib/theme'
 * ```
 */

import { createTheme } from '@mui/material/styles'

/**
 * Application theme
 *
 * Using MUI default theme with Roboto font (configured in layout.tsx via next/font).
 * Customize colors, typography, spacing, etc. here as needed.
 */
export const theme = createTheme({
  // You can customize the theme here
  // palette: {
  //   primary: {
  //     main: '#1976d2',
  //   },
  //   secondary: {
  //     main: '#dc004e',
  //   },
  // },
  // typography: {
  //   fontFamily: 'Roboto, sans-serif',
  // },
})
