// Global React Error Boundary Component (SPEC_CORE_FE)
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-10 text-center bg-white rounded-lg border border-gray-200 my-5">
          <h2 className="text-2xl text-red-600 mb-2">Đã có lỗi hệ thống xảy ra</h2>
          <p className="text-gray-600 mb-5">Ứng dụng không thể tải nội dung này. Vui lòng làm mới trang hoặc liên hệ hỗ trợ.</p>
          <button 
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer border-none hover:bg-blue-700 transition-colors"
          >
            Tải Lại Trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
