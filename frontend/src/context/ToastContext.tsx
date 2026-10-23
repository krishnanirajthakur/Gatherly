import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { generateId } from '@/utils/helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Toast system
// ─────────────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = generateId();
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toast,
        success: (m) => toast(m, 'success'),
        error: (m) => toast(m, 'error', 6000),
        warning: (m) => toast(m, 'warning'),
        info: (m) => toast(m, 'info'),
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast UI
// ─────────────────────────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  const icons: Record<ToastType, string> = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const styles: Record<ToastType, string> = {
    success: 'bg-success-bg text-success-text border-success-text/30',
    error: 'bg-error-bg text-error-text border-error-text/30',
    warning: 'bg-warning-bg text-warning-text border-warning-text/30',
    info: 'bg-orange-pale text-orange-dark border-orange-primary/30',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-elevated text-body-md pointer-events-auto animate-fade-in max-w-sm ${styles[toast.type]}`}
    >
      <span className="material-symbols-outlined icon-filled text-[18px] mt-0.5 shrink-0">{icons[toast.type]}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current rounded"
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  );
}
