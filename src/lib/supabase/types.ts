/**
 * Supabase Client Types
 *
 * Unified types for Supabase clients that work in both server and client contexts.
 * This enables dependency injection pattern where repository functions accept
 * a Supabase client as a parameter, making them usable from both Server Components
 * and Client Components.
 */

// Import the actual client return types to ensure compatibility
import type { SupabaseClient as BrowserClient } from '@/lib/supabase/client'
import type { SupabaseServerClient } from '@/lib/supabase/server'

/**
 * Typed Supabase client for this application's database schema.
 * Can be either a server client or browser client.
 *
 * This union type ensures type compatibility with both client types.
 */
export type SupabaseClient = BrowserClient | SupabaseServerClient
