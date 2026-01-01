'use client'

/**
 * Client-side Configuration
 *
 * This module provides type-safe access to environment variables
 * that are available in the browser (NEXT_PUBLIC_* prefixed).
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { clientConfig } from '@/lib/config/client'
 *
 * console.log(clientConfig.supabaseUrl)
 * console.log(clientConfig.isProduction)
 * ```
 */

import { z } from 'zod'

/**
 * Client configuration schema
 * Only includes NEXT_PUBLIC_* variables that are safe for the browser
 */
const clientConfigSchema = z.object({
  // Supabase
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Environment
  isProduction: z.boolean(),
  isDevelopment: z.boolean(),
  nodeEnv: z.enum(['development', 'production', 'test']),
})

export type ClientConfig = z.infer<typeof clientConfigSchema>

/**
 * Create and validate client configuration
 */
function createClientConfig(): ClientConfig {
  const rawConfig = {
    supabaseUrl: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
    supabaseAnonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
    logLevel: process.env['NEXT_PUBLIC_LOG_LEVEL'] ?? 'info',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }

  const result = clientConfigSchema.safeParse(rawConfig)

  if (!result.success) {
    const errors = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')

    console.error('Invalid client configuration:', errors)

    // In development, throw to make issues obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Invalid client configuration: ${errors}`)
    }

    // In production, return defaults to prevent crashes
    return {
      supabaseUrl: rawConfig.supabaseUrl,
      supabaseAnonKey: rawConfig.supabaseAnonKey,
      logLevel: 'error',
      isProduction: true,
      isDevelopment: false,
      nodeEnv: 'production',
    }
  }

  return result.data
}

/**
 * Client-side configuration singleton
 * Safe to use in Client Components
 */
export const clientConfig = createClientConfig()
