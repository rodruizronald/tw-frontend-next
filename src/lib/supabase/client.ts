'use client'

/**
 * Supabase Browser Client
 *
 * This client is used in Client Components (browser-side).
 * It uses the @supabase/ssr package for proper cookie handling.
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data, error } = await supabase.from('jobs').select('*')
 * ```
 */

import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './types/database'

/**
 * Create a Supabase client for browser/client-side usage
 *
 * This function creates a new client instance each time it's called.
 * The client handles authentication state automatically via cookies.
 */
export function createClient() {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
        'Please add it to your .env.local file.'
    )
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
        'Please add it to your .env.local file.'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Type alias for the typed Supabase client
 * Useful for function parameters and return types
 */
export type SupabaseClient = ReturnType<typeof createClient>
