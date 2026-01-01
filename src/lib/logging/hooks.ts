'use client'

/**
 * Logging Hooks
 *
 * React hooks for easy component-level logging.
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { useLogger } from '@/lib/logging'
 *
 * function MyComponent() {
 *   const logger = useLogger('MyComponent')
 *
 *   logger.info('Something happened')
 *   logger.error('Error occurred', { action: 'submit' }, new Error('Failed'))
 *
 *   return <div>...</div>
 * }
 * ```
 */

import { useMemo } from 'react'

import { logger } from './logger'
import type { LogContext } from './types'

/**
 * Hook for easy component-level logging
 * Automatically includes the component name in all log entries
 *
 * Returns a memoized logger object that is stable across re-renders,
 * making it safe to use in useCallback/useEffect dependency arrays.
 */
export const useLogger = (componentName: string) => {
  return useMemo(
    () => ({
      error: (
        message: string,
        context?: Omit<LogContext, 'component'>,
        error?: Error
      ) =>
        logger.error(message, { ...context, component: componentName }, error),

      warn: (message: string, context?: Omit<LogContext, 'component'>) =>
        logger.warn(message, { ...context, component: componentName }),

      info: (message: string, context?: Omit<LogContext, 'component'>) =>
        logger.info(message, { ...context, component: componentName }),

      debug: (message: string, context?: Omit<LogContext, 'component'>) =>
        logger.debug(message, { ...context, component: componentName }),

      userAction: (action: string, data?: Record<string, unknown>) =>
        logger.userAction(action, componentName, data),

      performance: (metric: string, value: number) =>
        logger.performance(metric, value, componentName),
    }),
    [componentName]
  )
}
