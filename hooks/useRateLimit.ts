import { useRef, useCallback } from 'react';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

/**
 * Hook to implement client-side rate limiting
 * Prevents abuse by limiting the number of requests within a time window
 *
 * @param config - Configuration with maxRequests and windowMs
 * @returns checkRateLimit function to verify if request is allowed
 */
export const useRateLimit = (config: RateLimitConfig) => {
  const requestTimestamps = useRef<number[]>([]);

  const checkRateLimit = useCallback((): RateLimitResult => {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Remove timestamps outside the current window
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => timestamp > windowStart
    );

    // Check if limit exceeded
    if (requestTimestamps.current.length >= config.maxRequests) {
      const oldestRequest = requestTimestamps.current[0];
      const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Add current timestamp
    requestTimestamps.current.push(now);
    return { allowed: true };
  }, [config]);

  const reset = useCallback(() => {
    requestTimestamps.current = [];
  }, []);

  return { checkRateLimit, reset };
};
