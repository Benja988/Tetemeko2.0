/**
 * Retry utility for handling transient failures in async operations
 * @module utils/retry
 */

/**
 * Configuration options for retry attempts
 */
interface RetryOptions {
  /** Number of retry attempts (default: 2) */
  retries?: number;
  /** Initial delay between retries in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay between retries in milliseconds (default: 5000) */
  maxDelay?: number;
  /** Backoff factor for exponential delay (default: 2) */
  backoffFactor?: number;
}

/**
 * Error types considered transient and retryable
 */
const TRANSIENT_ERRORS = [
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ECONNREFUSED',
  'EHOSTUNREACH',
  // HTTP status codes that might be transient
  429, // Too Many Requests
  502, // Bad Gateway
  503, // Service Unavailable
  504  // Gateway Timeout
];

/**
 * Determines if an error is retryable
 * @param error - The error to check
 * @returns Whether the error is retryable
 */
const isRetryableError = (error: any): boolean => {
  // Network-related errors
  if (error.code && TRANSIENT_ERRORS.includes(error.code)) return true;

  // HTTP status codes
  if (error.response?.status && TRANSIENT_ERRORS.includes(error.response.status)) return true;

  // Timeout messages
  if (error.message?.toLowerCase().includes('timeout') || error.message?.toLowerCase().includes('time out')) return true;

  return false;
};

/**
 * Executes a function with retry logic and exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration
 * @returns The result of the function execution
 * @throws The last error if all retries fail
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 2,
    initialDelay = 1000,
    maxDelay = 5000,
    backoffFactor = 2
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (!isRetryableError(error)) throw error;

      if (attempt === retries + 1) throw error;

      const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      const jitter = Math.random() * 100;

      console.warn(`Retry attempt ${attempt}/${retries} after ${Math.round(delay + jitter)}ms: ${error.message}`);

      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

/**
 * Optional helper wrapper for quick usage:
 * retryWithDefault(() => fetchData())
 * @param fn - Async function to retry
 * @param options - Optional retry configuration
 */
export const retryWithDefault = <T>(fn: () => Promise<T>, options?: RetryOptions) => retry(fn, options);
