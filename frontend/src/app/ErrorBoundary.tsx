import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { hasError: true, message };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="text-[40px]">⚠️</span>
          <h1 className="text-[20px] font-bold text-[var(--color-simulation-text)]">
            Something went wrong
          </h1>
          <p className="max-w-[400px] text-[14px] text-gray-500">{this.state.message}</p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-2 rounded-[8px] bg-[var(--color-mint)] px-6 py-2 text-[14px] font-semibold text-white"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
