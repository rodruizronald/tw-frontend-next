/**
 * Supabase Server Client
 *
 * This client is used in Server Components, Route Handlers, and Server Actions.
 * It uses the @supabase/ssr package for proper cookie handling.
 *
 * Usage in Server Components:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('jobs').select('*')
 *   return <div>{JSON.stringify(data)}</div>
 * }
 * ```
 *
 * Usage in Route Handlers:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 * import { NextResponse } from 'next/server'
 *
 * export async function GET() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('jobs').select('*')
 *   return NextResponse.json(data)
 * }
 * ```
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from './types/database'

/**
 * Create a Supabase client for server-side usage
 *
 * This function creates a new client instance with read-only cookie access.
 * Use this in Server Components and Route Handlers for data fetching.
 *
 * Note: This is an async function because `cookies()` is async in Next.js 15+
 */
export async function createClient() {
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

  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(
        cookiesToSet: Array<{
          name: string
          value: string
          options?: Parameters<typeof cookieStore.set>[2]
        }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              cookieStore.set(name, value, options)
            } else {
              cookieStore.set(name, value)
            }
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Type alias for the typed Supabase server client
 */
export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>
