'use client'

/**
 * Client-side Logger
 *
 * A browser-compatible logger using Pino.
 * This logger is designed for use in Client Components.
 *
 * Usage:
 * ```typescript
 * 'use client'
 * import { logger } from '@/lib/logging'
 *
 * logger.info('Something happened', { component: 'MyComponent' })
 * logger.error('Error occurred', { action: 'submit' }, new Error('Failed'))
 * ```
 */

import { pino } from 'pino'

import type { LogContext } from './types'

// =============================================================================
// Configuration
// =============================================================================

const LOG_LEVEL = process.env['NEXT_PUBLIC_LOG_LEVEL'] ?? 'info'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// =============================================================================
// Session Management
// =============================================================================

/**
 * Get or create a session ID for log correlation
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') {
    return 'server-render'
  }

  try {
    let sessionId = sessionStorage.getItem('log-session-id')
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
      sessionStorage.setItem('log-session-id', sessionId)
    }
    return sessionId
  } catch {
    // sessionStorage might not be available
    return `fallback-${Date.now()}`
  }
}

// =============================================================================
// External Logging
// =============================================================================

/**
 * Send log to external logging service (production only)
 */
const sendLogToExternal = async (
  logEvent: Record<string, unknown>
): Promise<void> => {
  // External logging would be configured here
  // For now, this is a placeholder for future integration
  if (!IS_PRODUCTION) return

  // Example: Send to external service
  // const LOG_ENDPOINT = process.env['NEXT_PUBLIC_LOG_ENDPOINT']
  // if (!LOG_ENDPOINT) return
  //
  // try {
  //   await fetch(LOG_ENDPOINT, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       ...logEvent,
  //       userAgent: navigator.userAgent,
  //       url: window.location.href,
  //       sessionId: getSessionId(),
  //     }),
  //   })
  // } catch (error) {
  //   console.warn('Failed to send log to external service:', error)
  // }

  // Suppress unused variable warning
  void logEvent
}

// =============================================================================
// Pino Logger Instance
// =============================================================================

/**
 * Create browser-compatible Pino logger
 */
const baseLogger = pino({
  browser: {
    serialize: true,
    asObject: IS_PRODUCTION,
  },
  level: LOG_LEVEL,
  formatters: {
    level: label => ({ level: label.toUpperCase() }),
  },
})

// =============================================================================
// Logger Class
// =============================================================================

class Logger {
  private logger = baseLogger

  /**
   * Log an error message
   */
  error(message: string, context?: LogContext, error?: Error): void {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      ...(error && {
        err: error,
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    }

    this.logger.error(logData, message)

    if (IS_PRODUCTION) {
      sendLogToExternal({ level: 'error', message, ...logData })
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    }

    this.logger.warn(logData, message)

    if (IS_PRODUCTION) {
      sendLogToExternal({ level: 'warn', message, ...logData })
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    }

    this.logger.info(logData, message)
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void {
    const logData = {
      ...context,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    }

    this.logger.debug(logData, message)
  }

  // ===========================================================================
  // React-specific Methods
  // ===========================================================================

  /**
   * Log component mount
   */
  componentMount(componentName: string, props?: Record<string, unknown>): void {
    const context: LogContext = {
      component: componentName,
      action: 'mount',
    }

    const sanitizedProps = this.sanitizeProps(props)
    if (sanitizedProps !== undefined) {
      context['props'] = sanitizedProps
    }

    this.info('Component mounted', context)
  }

  /**
   * Log component unmount
   */
  componentUnmount(componentName: string): void {
    this.debug('Component unmounted', {
      component: componentName,
      action: 'unmount',
    })
  }

  /**
   * Log user action
   */
  userAction(
    action: string,
    component: string,
    data?: Record<string, unknown>
  ): void {
    this.info('User action', {
      component,
      action,
      ...data,
    })
  }

  /**
   * Log API call
   */
  apiCall(
    method: string,
    url: string,
    status?: number,
    duration?: number
  ): void {
    const context: LogContext = {
      action: 'api-call',
      method,
      url,
      ...(status !== undefined && { status }),
      ...(duration !== undefined && { duration }),
    }

    const isError = status !== undefined && status >= 400
    const message = `API call ${method} ${url}`

    if (isError) {
      this.error(message, context)
    } else {
      this.info(message, context)
    }
  }

  /**
   * Log performance metric
   */
  performance(metric: string, value: number, component?: string): void {
    const context: LogContext = {
      action: 'performance',
      metric,
      value,
    }

    if (component !== undefined) {
      context['component'] = component
    }

    this.debug('Performance metric', context)
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  /**
   * Sanitize props to avoid logging sensitive data
   */
  private sanitizeProps(
    props?: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    if (!props) return undefined

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'key']
    const sanitized = { ...props }

    Object.keys(sanitized).forEach(key => {
      if (
        sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
      ) {
        sanitized[key] = '[REDACTED]'
      }
    })

    return sanitized
  }
}

// =============================================================================
// Export
// =============================================================================

/**
 * Logger singleton instance
 */
export const logger = new Logger()

export default logger
