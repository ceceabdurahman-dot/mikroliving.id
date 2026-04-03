import React, { ErrorInfo, ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background px-4 py-16 text-on-surface sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
              Render Error
            </p>
            <h1 className="mt-4 text-3xl font-headline text-red-900">
              The page could not finish loading.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-red-800">
              Please refresh the page. If this keeps happening, check the latest
              browser console error and server logs.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
