/**
 * Custom error class for application errors with user-friendly messages
 */
export class AppError extends Error {
  constructor(
    public userMessage: string,
    public systemMessage: string,
    public code: string,
    public statusCode?: number
  ) {
    super(systemMessage);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Handles errors securely without exposing internal details to users
 * Logs detailed errors in development only
 */
export const handleError = (error: unknown, context: string): AppError => {
  // Log full error in development only (never in production)
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }

  // Return existing AppError as-is
  if (error instanceof AppError) {
    return error;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError(
      'Network error. Please check your connection and try again.',
      error.message,
      'NETWORK_ERROR'
    );
  }

  // Handle timeout errors
  if (error instanceof Error && error.name === 'AbortError') {
    return new AppError(
      'Request timed out. Please try again.',
      'Fetch timeout',
      'TIMEOUT_ERROR'
    );
  }

  // Default error with no internal details exposed
  return new AppError(
    'An unexpected error occurred. Please try again.',
    error instanceof Error ? error.message : 'Unknown error',
    'UNKNOWN_ERROR'
  );
};

/**
 * Fetch with automatic timeout and AbortController
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError(
        'Request timed out. Please try again.',
        `Fetch timeout after ${timeout}ms`,
        'TIMEOUT_ERROR'
      );
    }
    throw error;
  }
};
