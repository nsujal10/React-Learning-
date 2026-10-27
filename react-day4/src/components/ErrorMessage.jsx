import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  const displayMessage =
    message || 'An unexpected error occurred while communicating with the server.';

  return (
    <div
      className={`alert alert-danger ${className}`}
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={22} style={{ flexShrink: 0, color: 'var(--danger)' }} />
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.975rem', color: '#fca5a5' }}>
            {title}
          </h4>
          <p style={{ fontSize: '0.875rem', marginTop: '0.2rem', color: '#fecaca' }}>
            {displayMessage}
          </p>
        </div>
      </div>

      {onRetry && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={onRetry}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorMessage;
