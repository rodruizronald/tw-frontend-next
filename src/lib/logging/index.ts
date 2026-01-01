/**
 * Logging Module Exports
 *
 * Provides structured logging for the application.
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { logger, useLogger } from '@/lib/logging'
 *
 * // Direct logger usage
 * logger.info('Message', { context: 'value' })
 *
 * // Hook usage in components
 * const log = useLogger('MyComponent')
 * log.info('Component message')
 * ```
 */

export { useLogger } from './hooks'
export { logger } from './logger'
export type { LogContext, LogLevel } from './types'
