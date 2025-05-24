import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ToastErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Toast Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
          <p className="font-medium">Something went wrong with the notification system.</p>
          <p className="text-sm opacity-90">Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
} 