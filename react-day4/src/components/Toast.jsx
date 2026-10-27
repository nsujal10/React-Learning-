import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 1000,
          maxWidth: '400px',
          width: 'calc(100% - 48px)',
        }}
      >
        {toasts.map((toast) => {
          let bg = 'var(--bg-surface)';
          let border = 'var(--border-subtle)';
          let Icon = CheckCircle2;
          let iconColor = 'var(--success)';

          if (toast.type === 'error') {
            border = 'rgba(239, 68, 68, 0.4)';
            Icon = AlertCircle;
            iconColor = 'var(--danger)';
          } else if (toast.type === 'warning') {
            border = 'rgba(245, 158, 11, 0.4)';
            Icon = AlertTriangle;
            iconColor = 'var(--warning)';
          } else if (toast.type === 'info') {
            border = 'rgba(14, 165, 233, 0.4)';
            Icon = Info;
            iconColor = 'var(--info)';
          } else {
            border = 'rgba(16, 185, 129, 0.4)';
          }

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { addToast: (msg) => console.log('Toast:', msg) };
  }
  return ctx;
}
