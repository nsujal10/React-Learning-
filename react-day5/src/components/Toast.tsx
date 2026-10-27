import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3500) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let iconClass = 'toast-icon-success';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            iconClass = 'toast-icon-danger';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconClass = 'toast-icon-warning';
          } else if (toast.type === 'info') {
            Icon = Info;
            iconClass = 'toast-icon-info';
          }

          return (
            <div key={toast.id} className={`toast-card toast-${toast.type}`} role="alert">
              <Icon size={18} className={iconClass} />
              <div className="toast-message">{toast.message}</div>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: (msg: string) => console.log('Toast:', msg),
      removeToast: () => {},
    };
  }
  return ctx;
};

export default ToastProvider;
