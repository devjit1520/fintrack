import { Component } from "react";

import ErrorFallback from "./ErrorFallback";

function createErrorReference() {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `FT-${timestamp}-${randomPart}`;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorReference: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorReference: createErrorReference(),
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo,
    });

    console.error(
      "FinTrack application error:",
      error
    );

    console.error(
      "FinTrack component stack:",
      errorInfo?.componentStack
    );
  }

  componentDidUpdate(previousProps) {
    const {
      resetKey,
    } = this.props;

    if (
      this.state.hasError &&
      previousProps.resetKey !== resetKey
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorReference: "",
    });

    if (
      typeof this.props.onReset ===
      "function"
    ) {
      this.props.onReset();
    }
  };

  render() {
    const {
      hasError,
      error,
      errorInfo,
      errorReference,
    } = this.state;

    const {
      children,
      fallback,
    } = this.props;

    if (hasError) {
      if (
        typeof fallback === "function"
      ) {
        return fallback({
          error,
          errorInfo,
          errorReference,
          resetErrorBoundary:
            this.resetErrorBoundary,
        });
      }

      if (fallback) {
        return fallback;
      }

      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          errorReference={
            errorReference
          }
          onRetry={
            this.resetErrorBoundary
          }
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;