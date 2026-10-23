import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { icon: 'favorite', label: 'Weddings', color: 'text-pink-500' },
  { icon: 'cake', label: 'Birthdays', color: 'text-orange-primary' },
  { icon: 'diamond', label: 'Engagements', color: 'text-blue-500' },
  { icon: 'school', label: 'College Festivals', color: 'text-green-500' },
  { icon: 'groups', label: 'Community Events', color: 'text-purple-500' },
  { icon: 'volunteer_activism', label: 'Fundraisers', color: 'text-red-500' },
  { icon: 'business', label: 'Corporate Events', color: 'text-slate-600' },
  { icon: 'theater_comedy', label: 'Cultural Programs', color: 'text-amber-500' },
];

const FEATURES = [
  {
    icon: 'smart_toy',
    title: 'AI-Powered Planning',
    desc: 'Generate personalised event plans, budget breakdowns, timelines, and vendor guides in seconds. The AI assists — you decide.',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Budget Control',
    desc: 'Set your budget, track every rupee, see category breakdowns. Calculations are always exact — never AI-estimated totals.',
  },
  {
    icon: 'checklist',
    title: 'Tasks & Timeline',
    desc: 'Get a customised preparation timeline with tasks weeks before your event. Filter by priority, status, or due date.',
  },
  {
    icon: 'store',
    title: 'Vendor Management',
    desc: 'Compare vendors, track quotes, record booking status, and manage payments — all from one workspace.',
  },
  {
    icon: 'group',
    title: 'Guest & RSVP Tracking',
    desc: 'Manage your guest list, collect RSVPs, track dietary needs, and see live headcount summaries.',
  },
  {
    icon: 'calendar_month',
    title: 'Calendar View',
    desc: 'See your event, tasks, and milestones on a unified calendar. Navigate months, click to open details.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base font-sans">
      {/* Nav */}
      <header className="bg-bg-card border-b border-border-default sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white icon-filled text-[18px]">celebration</span>
            </div>
            <span className="text-body-lg font-semibold text-text-main">Gatherly</span>
          </div>
          <Link
            to="/dashboard"
            className="btn btn-primary btn-sm"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Open App
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-pale border border-[#FBD9BE] rounded-lg px-3 py-1.5 mb-6">
          <span className="material-symbols-outlined text-[14px] text-orange-primary icon-filled">smart_toy</span>
          <span className="text-label-md text-orange-dark">GenAI-Powered Event Planning</span>
        </div>
        <h1 className="text-[48px] sm:text-[64px] font-semibold text-text-main leading-tight tracking-tight mb-4">
          Bring your plans<br />
          <span className="text-orange-primary">together.</span>
        </h1>
        <p className="text-body-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
          Gatherly is your AI-powered assistant for planning any event — from intimate birthdays to grand weddings. Budgets, timelines, vendors, and guests, all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/events/new" className="btn btn-primary btn-lg">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Start Planning Free
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            See Demo
          </Link>
        </div>

        {/* Privacy note */}
        <p className="text-label-sm text-text-secondary mt-6 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          No account required. Data stored locally in your browser. AI planning uses a built-in demo provider by default.
        </p>
      </section>

      {/* App preview card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-bg-card border border-border-default rounded-2xl shadow-elevated overflow-hidden">
          <div className="bg-bg-base border-b border-border-default px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error-text/50" />
            <div className="w-3 h-3 rounded-full bg-warning-text/50" />
            <div className="w-3 h-3 rounded-full bg-success-text/50" />
            <span className="text-label-sm text-text-secondary ml-3">Gatherly — Event Dashboard</span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Events', value: '3', icon: 'event' },
                { label: 'Total Budget', value: '₹27.5L', icon: 'account_balance_wallet' },
                { label: 'Tasks Done', value: '8/15', icon: 'checklist' },
                { label: 'Guests Confirmed', value: '247', icon: 'group' },
              ].map(s => (
                <div key={s.label} className="bg-bg-base border border-border-default rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-orange-primary">{s.icon}</span>
                    <span className="text-label-sm text-text-secondary">{s.label}</span>
                  </div>
                  <p className="text-[22px] font-semibold text-text-main tabular-nums">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-bg-base border border-border-default rounded-xl p-4">
                <p className="text-label-md font-semibold text-text-main mb-3">Upcoming Events</p>
                {[
                  { name: "Ananya & Rohan's Wedding", date: 'Feb 14, 2025', status: 'In Progress', type: 'wedding' },
                  { name: "Priya's 30th Birthday", date: 'Mar 15, 2025', status: 'Planning', type: 'birthday' },
                ].map(e => (
                  <div key={e.name} className="flex items-center gap-3 py-2.5 border-b border-border-default last:border-0">
                    <div className="w-8 h-8 bg-orange-pale rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-orange-primary">{e.type === 'wedding' ? 'favorite' : 'cake'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md-medium text-text-main truncate">{e.name}</p>
                      <p className="text-label-sm text-text-secondary">{e.date}</p>
                    </div>
                    <span className={clsx('badge text-[10px]', e.status === 'In Progress' ? 'badge-accent' : 'badge-neutral')}>{e.status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-orange-pale border border-[#FBD9BE] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[18px] text-orange-primary icon-filled">smart_toy</span>
                  <p className="text-label-md font-semibold text-orange-dark">AI Planner Ready</p>
                </div>
                <p className="text-body-md text-text-secondary mb-3">Generate a complete event plan in seconds — budget allocation, task timeline, vendor checklist, and personalised ideas.</p>
                <div className="space-y-2">
                  {['Complete wedding plan', 'Budget breakdown', 'Vendor categories'].map(s => (
                    <div key={s} className="flex items-center gap-2 text-body-md text-text-main">
                      <span className="material-symbols-outlined text-[14px] text-success-text icon-filled">check_circle</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event types */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-headline-md text-text-main mb-2">Plan any event</h2>
          <p className="text-body-lg text-text-secondary">From intimate gatherings to grand celebrations</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EVENT_TYPES.map(et => (
            <div key={et.label} className="bg-bg-card border border-border-default rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-card transition-shadow">
              <span className={clsx('material-symbols-outlined text-[28px] icon-filled', et.color)}>{et.icon}</span>
              <span className="text-body-md-medium text-text-main text-center">{et.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-headline-md text-text-main mb-2">Everything you need to plan</h2>
          <p className="text-body-lg text-text-secondary">A complete workspace from first idea to celebration day</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-bg-card border border-border-default rounded-xl p-5">
              <div className="w-10 h-10 bg-orange-pale rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[20px] text-orange-primary">{f.icon}</span>
              </div>
              <h3 className="text-body-lg font-semibold text-text-main mb-2">{f.title}</h3>
              <p className="text-body-md text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-orange-primary rounded-2xl px-8 py-12 text-center">
          <h2 className="text-headline-md text-white mb-3">Ready to start planning?</h2>
          <p className="text-body-lg text-white/80 mb-6">Create your first event in under 2 minutes.</p>
          <Link to="/events/new" className="inline-flex items-center gap-2 bg-white text-orange-primary font-medium rounded-lg px-6 py-3 hover:bg-orange-pale transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Create Your First Event
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-primary rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-white icon-filled text-[12px]">celebration</span>
            </div>
            <span className="text-body-md font-semibold text-text-main">Gatherly</span>
            <span className="text-label-sm text-text-secondary">— Bring your plans together</span>
          </div>
          <div className="flex items-center gap-4 text-label-sm text-text-secondary">
            <span>Built for Google PromptWars 2025</span>
            <span>·</span>
            <span>AI-powered. Privacy-first.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
