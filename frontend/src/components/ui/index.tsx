import React from 'react';
import { clsx } from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  iconRight?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant];

  const sizeClass = { sm: 'btn-sm', md: '', lg: 'btn-lg' }[size];

  return (
    <button
      className={clsx('btn', variantClass, sizeClass, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {!loading && iconRight && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon Button
// ─────────────────────────────────────────────────────────────────────────────

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary';
  filled?: boolean;
}

export function IconButton({ icon, label, size = 'md', variant = 'ghost', filled = false, className, ...props }: IconButtonProps) {
  const sizeClass = { sm: 'w-7 h-7 text-[16px]', md: 'w-9 h-9 text-[20px]', lg: 'w-11 h-11 text-[22px]' }[size];
  const variantClass = variant === 'secondary'
    ? 'bg-bg-card border border-border-default text-text-secondary hover:text-text-main hover:bg-bg-base'
    : 'text-text-secondary hover:text-text-main hover:bg-bg-base';
  return (
    <button
      aria-label={label}
      title={label}
      className={clsx('inline-flex items-center justify-center rounded-lg transition-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus', sizeClass, variantClass, className)}
      {...props}
    >
      <span className={clsx('material-symbols-outlined leading-none', filled && 'icon-filled')}>{icon}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Input
// ─────────────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Input({ label, error, hint, required, id, className, ...props }: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="flex flex-col gap-0">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}{required && <span className="text-error-text ml-0.5" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={clsx('input', error && 'input-error', className)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        required={required}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="input-error-msg"><span className="material-symbols-outlined text-[14px]">error</span>{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="input-hint">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function Textarea({ label, error, hint, required, id, className, ...props }: TextareaProps) {
  const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="flex flex-col gap-0">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}{required && <span className="text-error-text ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={clsx('textarea', error && 'input-error', className)}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {error && <p className="input-error-msg"><span className="material-symbols-outlined text-[14px]">error</span>{error}</p>}
      {!error && hint && <p className="input-hint">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Select
// ─────────────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, hint, required, id, options, placeholder, className, ...props }: SelectProps) {
  const inputId = id ?? `select-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <div className="flex flex-col gap-0">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}{required && <span className="text-error-text ml-0.5">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={clsx('select', error && 'input-error', className)}
        aria-invalid={error ? 'true' : undefined}
        required={required}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="input-error-msg"><span className="material-symbols-outlined text-[14px]">error</span>{error}</p>}
      {!error && hint && <p className="input-hint">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────

interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'error';
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', icon, children, className }: BadgeProps) {
  const cls = { neutral: 'badge-neutral', accent: 'badge-accent', success: 'badge-success', warning: 'badge-warning', error: 'badge-error' }[variant];
  return (
    <span className={clsx('badge', cls, className)}>
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padded = true, onClick }: CardProps) {
  return (
    <div
      className={clsx('card', padded && 'p-5', onClick && 'cursor-pointer hover:shadow-elevated transition-shadow duration-150', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialog / Modal
// ─────────────────────────────────────────────────────────────────────────────

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Dialog({ open, onClose, title, children, size = 'md', footer }: DialogProps) {
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }[size];

  React.useEffect(() => {
    if (open) {
      const prev = document.activeElement as HTMLElement;
      return () => prev?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div className={clsx('relative bg-bg-card rounded-2xl shadow-elevated border border-border-default w-full', sizeClass, 'animate-fade-in')}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <h2 id="dialog-title" className="text-section-title font-semibold text-text-main">{title}</h2>
          <IconButton icon="close" label="Close dialog" onClick={onClose} />
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-border-default">{footer}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm Dialog
// ─────────────────────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  dangerous?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', dangerous = false }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={dangerous ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      }
    >
      <p className="text-body-md text-text-secondary">{message}</p>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading Spinner
// ─────────────────────────────────────────────────────────────────────────────

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <span
      className={clsx('material-symbols-outlined animate-spin text-orange-primary', className)}
      style={{ fontSize: size }}
      aria-label="Loading"
      role="status"
    >
      progress_activity
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 bg-orange-pale rounded-xl flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-orange-primary">{icon}</span>
      </div>
      <h3 className="text-section-title text-text-main mb-2">{title}</h3>
      {description && <p className="text-body-md text-text-secondary max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number; // 0–100
  showLabel?: boolean;
  danger?: boolean;
  className?: string;
}

export function ProgressBar({ value, showLabel = false, danger = false, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="progress-bar flex-1">
        <div
          className={clsx('progress-fill', (danger || value > 100) && 'progress-fill-danger')}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className="text-label-sm text-text-secondary tabular-nums w-9 text-right">{pct}%</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon, trend, trendLabel, accent }: StatCardProps) {
  return (
    <Card padded>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-label-sm text-text-secondary uppercase tracking-wide mb-2">{label}</p>
          <p className={clsx('text-numeric-stat font-semibold tabular-nums', accent ? 'text-orange-primary' : 'text-text-main')}>{value}</p>
          {trendLabel && (
            <p className={clsx('text-label-sm mt-1 flex items-center gap-1', trend === 'up' ? 'text-success-text' : trend === 'down' ? 'text-error-text' : 'text-text-secondary')}>
              {trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
              {trend === 'down' && <span className="material-symbols-outlined text-[14px]">trending_down</span>}
              {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-orange-pale flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] text-orange-primary">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-section-title text-text-main">{title}</h2>
        {subtitle && <p className="text-body-md text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox
// ─────────────────────────────────────────────────────────────────────────────

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const inputId = id ?? `cb-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <label htmlFor={inputId} className={clsx('flex items-start gap-2.5 cursor-pointer group', className)}>
      <input
        type="checkbox"
        id={inputId}
        className="mt-0.5 w-[18px] h-[18px] rounded accent-orange-primary border-text-secondary focus:ring-orange-primary focus:ring-offset-0 focus:ring-1 shrink-0"
        {...props}
      />
      <div>
        <span className="text-body-md text-text-main group-hover:text-text-main">{label}</span>
        {description && <p className="text-label-sm text-text-secondary">{description}</p>}
      </div>
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex gap-1 border-b border-border-default overflow-x-auto', className)} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-3 text-body-md-medium whitespace-nowrap border-b-2 transition-fast -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus focus-visible:ring-inset',
            active === tab.id
              ? 'border-orange-primary text-orange-primary'
              : 'border-transparent text-text-secondary hover:text-text-main hover:border-border-default',
          )}
        >
          {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className={clsx('text-label-sm px-1.5 py-0.5 rounded', active === tab.id ? 'bg-orange-pale text-orange-dark' : 'bg-bg-base text-text-secondary')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
