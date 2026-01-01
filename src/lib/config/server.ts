/**
 * Server-side Configuration
 *
 * This module provides type-safe access to ALL environment variables,
 * including sensitive ones that should never be exposed to the browser.
 *
 * IMPORTANT: Only import this in:
 * - Server Components
 * - Route Handlers (API routes)
 * - Server Actions
 * - Middleware
 *
 * Usage:
 * ```typescript
 * // In a Server Component or Route Handler
 * import { serverConfig } from '@/lib/config/server'
 *
 * console.log(serverConfig.logEndpoint) // Server-only!
 * ```
 */

import { z } from 'zod'

/**
 * Server configuration schema
 * Includes both public and private environment variables
 */
const serverConfigSchema = z.object({
  // Supabase (public)
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),

  // API (public)
  apiBaseUrl: z.string().url().optional(),

  // Logging (mixed)
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  logEndpoint: z.string().optional(), // Server-only
  logApiKey: z.string().optional(), // Server-only

  // Environment
  isProduction: z.boolean(),
  isDevelopment: z.boolean(),
  nodeEnv: z.enum(['development', 'production', 'test']),
})

export type ServerConfig = z.infer<typeof serverConfigSchema>

/**
 * Create and validate server configuration
 */
function createServerConfig(): ServerConfig {
  const rawConfig = {
    // Public variables
    supabaseUrl: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
    supabaseAnonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
    apiBaseUrl: process.env['NEXT_PUBLIC_API_BASE_URL'],
    logLevel: process.env['NEXT_PUBLIC_LOG_LEVEL'] ?? 'info',

    // Server-only variables (no NEXT_PUBLIC_ prefix)
    logEndpoint: process.env['LOG_ENDPOINT'],
    logApiKey: process.env['LOG_API_KEY'],

    // Environment
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }

  const result = serverConfigSchema.safeParse(rawConfig)

  if (!result.success) {
    const errors = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')

    console.error('Invalid server configuration:', errors)

    // In development, throw to make issues obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Invalid server configuration: ${errors}`)
    }

    // In production, return with defaults
    return {
      supabaseUrl: rawConfig.supabaseUrl,
      supabaseAnonKey: rawConfig.supabaseAnonKey,
      apiBaseUrl: rawConfig.apiBaseUrl,
      logLevel: 'error',
      logEndpoint: undefined,
      logApiKey: undefined,
      isProduction: true,
      isDevelopment: false,
      nodeEnv: 'production',
    }
  }

  return result.data
}

/**
 * Server-side configuration singleton
 * ONLY use in server-side code!
 */
export const serverConfig = createServerConfig()
