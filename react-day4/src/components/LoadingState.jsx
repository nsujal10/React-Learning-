import React from 'react';

export function LoadingState({ message = 'Loading employee data...', minHeight = '300px' }) {
  return (
    <div
      className="loading-container"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <div className="spinner spinner-lg" aria-hidden="true"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default LoadingState;
