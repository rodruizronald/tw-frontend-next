/**
 * Supabase Client Exports
 *
 * This module provides both server and client Supabase clients.
 *
 * Usage:
 * - For Client Components: import { createClient } from '@/lib/supabase/client'
 * - For Server Components: import { createClient } from '@/lib/supabase/server'
 *
 * Note: Don't import from this index file directly. Import from the specific
 * client or server module to ensure proper tree-shaking and avoid mixing
 * server/client code.
 */

// Re-export types and errors
export * from './errors'
export type { SupabaseClient } from './types'
export type { Database } from './types/database'
