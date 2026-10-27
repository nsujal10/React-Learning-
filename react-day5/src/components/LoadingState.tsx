import React from 'react';

export interface LoadingStateProps {
  message?: string;
  minHeight?: string;
  variant?: 'spinner' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading intelligence data...',
  minHeight = '280px',
  variant = 'spinner',
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="skeleton-container" role="status" aria-live="polite">
        <span className="sr-only">{message}</span>
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="loading-container"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <div className="spinner spinner-lg" aria-hidden="true" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingState;
