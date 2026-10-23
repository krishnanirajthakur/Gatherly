import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from '@/context/ToastContext';
import { EventProvider } from '@/context/EventContext';
import { AppShell } from '@/components/layout/AppShell';
import { Spinner } from '@/components/ui';
import { seedDemoData } from '@/services/storage';

// Eagerly import pages
import LandingPage from '@/features/landing/LandingPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import CreateEventWizard from '@/features/events/CreateEventWizard';
import EventWorkspace from '@/features/workspace/EventWorkspace';

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap demo data on first load
// ─────────────────────────────────────────────────────────────────────────────
seedDemoData();

// ─────────────────────────────────────────────────────────────────────────────
// App shell layout wrapper
// ─────────────────────────────────────────────────────────────────────────────

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <EventProvider>
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
                <Spinner size={40} />
              </div>
            }
          >
            <Routes>
              {/* Public landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* App routes inside shell */}
              <Route element={<ShellLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events/new" element={<CreateEventWizard />} />
                <Route path="/events/:eventId/*" element={<EventWorkspace />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </EventProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
