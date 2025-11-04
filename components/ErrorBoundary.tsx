import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing and shows a user-friendly error message
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service in production (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h1>
            <p className="text-stone-400 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
              Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left text-sm">
                <summary className="cursor-pointer text-stone-500 hover:text-stone-300 mb-2">
                  Error details (development only)
                </summary>
                <div className="bg-black/30 p-4 rounded-lg overflow-auto max-h-40">
                  <p className="text-red-300 font-mono text-xs break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="bg-white/10 text-white py-2 px-6 rounded-lg font-semibold hover:bg-white/20 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
