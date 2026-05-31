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
        <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
          <h2 style={{ fontSize: '24px', color: '#e53e3e', marginBottom: '8px' }}>Đã có lỗi hệ thống xảy ra</h2>
          <p style={{ color: '#4a5568', marginBottom: '20px' }}>Ứng dụng không thể tải nội dung này. Vui lòng làm mới trang hoặc liên hệ hỗ trợ.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
