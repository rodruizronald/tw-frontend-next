import { Box, CircularProgress } from '@mui/material'

/**
 * Loading UI for Job Search Page
 *
 * Next.js native loading pattern - automatically wraps page in Suspense.
 * This file replaces manual <Suspense> in page.tsx.
 */
export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <CircularProgress size={48} />
    </Box>
  )
}
