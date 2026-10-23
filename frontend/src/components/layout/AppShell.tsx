import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar navigation
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: 'grid_view', label: 'Dashboard', exact: true },
  { to: '/events', icon: 'event', label: 'My Events' },
  { to: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (item: NavItem) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-60 bg-bg-card border-r border-border-default z-30 flex flex-col transition-transform duration-200',
          'lg:relative lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus rounded">
            <div className="w-8 h-8 bg-orange-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white icon-filled text-[18px]">celebration</span>
            </div>
            <div>
              <span className="text-body-lg font-semibold text-text-main leading-none">Gatherly</span>
            </div>
          </Link>
          <button
            className="lg:hidden text-text-secondary hover:text-text-main"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto" aria-label="Navigation">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md-medium transition-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus',
                isActive(item)
                  ? 'bg-orange-pale text-orange-primary'
                  : 'text-text-secondary hover:text-text-main hover:bg-bg-base',
              )}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              <span className={clsx('material-symbols-outlined text-[20px]', isActive(item) && 'icon-filled')}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-border-default">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-orange-pale">
            <span className="material-symbols-outlined text-[16px] text-orange-primary icon-filled">smart_toy</span>
            <div className="flex-1 min-w-0">
              <p className="text-label-sm font-medium text-orange-dark leading-none truncate">Demo Mode</p>
              <p className="text-[10px] text-orange-dark/70 mt-0.5">Mock AI active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Top Bar
// ─────────────────────────────────────────────────────────────────────────────

interface TopBarProps {
  title?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
  back?: { to: string; label: string };
}

export function TopBar({ title, onMenuClick, actions, back }: TopBarProps) {
  return (
    <header className="bg-bg-card border-b border-border-default px-4 lg:px-6 h-14 flex items-center gap-3 shrink-0">
      <button
        className="lg:hidden text-text-secondary hover:text-text-main"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {back && (
        <Link
          to={back.to}
          className="text-text-secondary hover:text-text-main flex items-center gap-1 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus rounded"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="hidden sm:inline">{back.label}</span>
        </Link>
      )}

      {title && (
        <h1 className="text-section-title text-text-main flex-1 truncate">{title}</h1>
      )}
      {!title && <div className="flex-1" />}

      {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App Shell
// ─────────────────────────────────────────────────────────────────────────────

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Children provide their own TopBar */}
        <main className="flex-1 overflow-y-auto">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<{ onMenuClick?: () => void }>, {
                onMenuClick: () => setSidebarOpen(true),
              });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}

// Export a hook for menu trigger
export function useMenuTrigger() {
  const [open, setOpen] = React.useState(false);
  return { sidebarOpen: open, openSidebar: () => setOpen(true), closeSidebar: () => setOpen(false) };
}
