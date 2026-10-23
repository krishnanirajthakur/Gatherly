import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Card, Button, Badge, Spinner, ConfirmDialog } from '@/components/ui';
import { orchestrateGeneratePlan } from '@/services/ai/orchestrator';
import { taskStorage, categoryStorage, expenseStorage, activityStorage } from '@/services/storage';
import { formatCurrency } from '@/utils/helpers';
import type {
  Event, PlanResponse, GeneratedTask, BudgetAllocation, VendorSuggestion,
} from '@/types';

interface PlannerTabProps {
  event: Event;
  onRefresh: () => void;
}

type Section = 'overview' | 'budget' | 'timeline' | 'tasks' | 'vendors' | 'guest' | 'contingency' | 'sustainability';

const SECTION_LABELS: Record<Section, string> = {
  overview: 'Event Overview',
  budget: 'Budget Allocation',
  timeline: 'Preparation Timeline',
  tasks: 'Task Checklist',
  vendors: 'Vendor Guide',
  guest: 'Guest Experience',
  contingency: 'Contingency Plans',
  sustainability: 'Sustainability Tips',
};

const SECTION_ICONS: Record<Section, string> = {
  overview: 'info',
  budget: 'account_balance_wallet',
  timeline: 'timeline',
  tasks: 'checklist',
  vendors: 'store',
  guest: 'emoji_people',
  contingency: 'cloud_off',
  sustainability: 'eco',
};

export default function PlannerTab({ event, onRefresh }: PlannerTabProps) {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [savingTasks, setSavingTasks] = useState(false);
  const [savingBudget, setSavingBudget] = useState(false);
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());
  const [confirmReplace, setConfirmReplace] = useState<null | 'tasks' | 'budget'>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  const planRequest = {
    eventId: event.id,
    eventName: event.name,
    eventType: event.type,
    startDate: event.startDate,
    guestCount: event.guestCount,
    budget: event.budget,
    currency: event.currency,
    format: event.format,
    location: event.location,
    preferences: event.preferences,
  };

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setProviderUsed(null);
    setSavedSections(new Set());
    try {
      const { result, providerId } = await orchestrateGeneratePlan(planRequest);
      setPlan(result);
      setProviderUsed(providerId);
      activityStorage.log(event.id, 'plan_generated', `AI plan generated via ${providerId}`);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [event]);

  const addTasksToEvent = () => {
    if (!plan) return;
    setSavingTasks(true);
    const eventDate = new Date(event.startDate);
    plan.tasks.forEach(gt => {
      const due = new Date(eventDate);
      due.setDate(due.getDate() - gt.weeksBefore * 7);
      taskStorage.create({
        eventId: event.id,
        title: gt.title,
        description: gt.description,
        dueDate: due.toISOString().split('T')[0],
        priority: gt.priority,
        status: 'todo',
        category: gt.category,
        source: 'ai_suggestion',
      });
    });
    setSavedSections(s => new Set([...s, 'tasks']));
    setSavingTasks(false);
    onRefresh();
  };

  const addBudgetToEvent = () => {
    if (!plan) return;
    setSavingBudget(true);
    plan.budgetAllocations.forEach((alloc) => {
      const cat = categoryStorage.create({
        eventId: event.id,
        name: alloc.category,
        plannedAmount: alloc.estimatedAmount,
      });
      expenseStorage.create({
        eventId: event.id,
        categoryId: cat.id,
        description: alloc.description,
        estimatedAmount: alloc.estimatedAmount,
        status: 'pending',
        source: 'ai_suggestion',
      });
    });
    setSavedSections(s => new Set([...s, 'budget']));
    setSavingBudget(false);
    onRefresh();
  };

  const makeMoreAffordable = () => {
    if (!plan) return;
    setPlan({
      ...plan,
      budgetAllocations: plan.budgetAllocations.map(a => ({
        ...a,
        estimatedAmount: Math.round(a.estimatedAmount * 0.85),
        description: `${a.description} (optimized with budget-friendly alternatives)`,
      })),
      sustainabilityTips: [
        ...plan.sustainabilityTips,
        'Opt for DIY decor accents and rental packages to cut expenses by 15-20%.',
      ],
    });
  };

  const copyPlan = async () => {
    if (!plan) return;
    const text = `# ${event.name} — Event Plan\n\n${plan.overview}\n\n## Budget Allocations\n${
      plan.budgetAllocations.map(a => `- ${a.category}: ${formatCurrency(a.estimatedAmount, event.currency)} (${a.percentage}%)`).join('\n')
    }\n\n## Timeline\n${
      plan.timeline.map(t => `- ${t.weeksBefore} weeks before: ${t.title}`).join('\n')
    }\n\n## Tasks\n${
      plan.tasks.map(t => `- [ ] ${t.title} (${t.priority} priority, ${t.weeksBefore}w before)`).join('\n')
    }`;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const sections: Section[] = ['overview', 'budget', 'timeline', 'tasks', 'vendors', 'guest', 'contingency', 'sustainability'];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2 className="text-[16px] font-bold text-[#252525]">AI Event Planner</h2>
          <p className="text-[13px] text-[#747474] mt-0.5">
            Generate a personalized plan for {event.name} based on your event details.
          </p>
        </div>
        <div className="flex gap-2">
          {plan && (
            <>
              <Button variant="secondary" size="sm" icon="savings" onClick={makeMoreAffordable} title="Reduce costs by 15% with alternative options">
                Make Affordable
              </Button>
              <Button variant="secondary" size="sm" icon={copySuccess ? 'check' : 'content_copy'} onClick={copyPlan}>
                {copySuccess ? 'Copied!' : 'Copy Plan'}
              </Button>
              <Button variant="secondary" size="sm" icon="refresh" onClick={generate} disabled={loading}>
                Regenerate
              </Button>
            </>
          )}
          <Button icon="smart_toy" onClick={generate} disabled={loading}>
            {loading ? 'Generating…' : plan ? 'New Plan' : 'Generate Plan'}
          </Button>
        </div>
      </div>

      {/* Info callout about AI */}
      {!plan && !loading && (
        <Card padded>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[32px] text-[#E87524] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <div className="space-y-2">
              <h3 className="text-[14px] font-semibold text-[#252525]">What the AI Planner does</h3>
              <p className="text-[13px] text-[#747474]">
                The planner analyzes your event type, date, guest count, budget, and preferences to produce
                a structured plan with budget allocations, preparation timeline, tasks, vendor guidance, and personalized tips.
              </p>
              <p className="text-[13px] text-[#747474]">
                All suggestions are <strong>editable</strong> before saving. You can add selected tasks and budget
                categories to your event with one click.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  'Personalized budget breakdown',
                  'Preparation timeline',
                  'Vendor categories & tips',
                  'Guest experience ideas',
                  'Contingency planning',
                  'Sustainability suggestions',
                ].map(f => (
                  <span key={f} className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] bg-[#FFF1E5] text-[#C95D16] border border-[#FBD9BE]">
                    {f}
                  </span>
                ))}
              </div>
              <p className="text-[12px] text-[#747474] italic mt-2">
                Note: Currently using demo mode. AI cost estimates are illustrative, not verified local prices.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size={40} />
          <p className="text-[14px] text-[#747474]">Generating your personalized event plan…</p>
          <p className="text-[12px] text-[#747474]">This may take a few seconds</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <Card padded>
          <div className="flex items-center gap-3 text-[#DC2626]">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <div>
              <p className="text-[14px] font-medium">{error}</p>
              <p className="text-[13px] text-[#747474] mt-1">You can still plan your event manually using the other tabs.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-3" onClick={generate}>Try Again</Button>
        </Card>
      )}

      {/* Plan display */}
      {plan && !loading && (
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Section nav */}
          <div className="lg:col-span-1">
            <Card padded={false}>
              <div className="p-2">
                {sections.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSection(s)}
                    className={clsx(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-left transition-colors',
                      activeSection === s
                        ? 'bg-[#FFF1E5] text-[#E87524] font-medium'
                        : 'text-[#747474] hover:bg-[#F7F7F5] hover:text-[#252525]'
                    )}
                  >
                    <span className="material-symbols-outlined text-[16px]">{SECTION_ICONS[s]}</span>
                    {SECTION_LABELS[s]}
                    {savedSections.has(s) && (
                      <span className="ml-auto material-symbols-outlined text-[14px] text-[#287A4B]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </button>
                ))}
              </div>
              {providerUsed && (
                <div className="px-3 py-2 border-t border-[#E7E5E2] text-[11px] text-[#747474]">
                  Generated by: <strong>{providerUsed === 'mock' ? 'Demo Mode' : providerUsed}</strong>
                </div>
              )}
            </Card>
          </div>

          {/* Section content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Overview */}
            {activeSection === 'overview' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-3">Event Overview</h3>
                <p className="text-[14px] text-[#252525] leading-relaxed">{plan.overview}</p>
                {plan.assumptions.length > 0 && (
                  <>
                    <h4 className="text-[13px] font-semibold text-[#747474] mt-4 mb-2">Planning Assumptions</h4>
                    <ul className="space-y-1">
                      {plan.assumptions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#747474]">
                          <span className="material-symbols-outlined text-[14px] text-[#E87524] mt-0.5 shrink-0">info</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {plan.themeIdeas.length > 0 && (
                  <>
                    <h4 className="text-[13px] font-semibold text-[#252525] mt-4 mb-2">Theme &amp; Decoration Ideas</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.themeIdeas.map((idea, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] bg-[#FFF1E5] text-[#C95D16] border border-[#FBD9BE]">
                          ✨ {idea}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            )}

            {/* Budget */}
            {activeSection === 'budget' && (
              <Card padded>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-[#252525]">Budget Allocation</h3>
                  <Button
                    size="sm"
                    icon={savedSections.has('budget') ? 'check' : 'add'}
                    disabled={savingBudget || savedSections.has('budget')}
                    onClick={() => {
                      const hasBudget = categoryStorage.getByEvent(event.id).length > 0;
                      if (hasBudget) setConfirmReplace('budget');
                      else addBudgetToEvent();
                    }}
                  >
                    {savedSections.has('budget') ? 'Added to Budget' : 'Add to My Budget'}
                  </Button>
                </div>
                <div className="bg-[#FEF9C3] border border-[#D97706]/30 rounded-lg px-3 py-2 mb-4 text-[12px] text-[#D97706]">
                  ⚠ These are illustrative estimates based on typical costs. Always verify prices with actual vendors.
                </div>
                <div className="space-y-3">
                  {plan.budgetAllocations.map((alloc, i) => (
                    <BudgetAllocRow key={i} alloc={alloc} event={event} total={event.budget} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#E7E5E2] flex justify-between text-[14px]">
                  <span className="font-semibold text-[#252525]">Total</span>
                  <span className="font-bold tabular-nums text-[#252525]">
                    {formatCurrency(plan.budgetAllocations.reduce((s, a) => s + a.estimatedAmount, 0), event.currency)}
                  </span>
                </div>
              </Card>
            )}

            {/* Timeline */}
            {activeSection === 'timeline' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-4">Preparation Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E7E5E2]" aria-hidden />
                  <div className="space-y-6">
                    {plan.timeline.map((item, i) => (
                      <div key={i} className="pl-10 relative">
                        <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[#E87524] border-2 border-white ring-2 ring-[#E87524]/30" />
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[12px] font-semibold text-[#E87524] uppercase tracking-wide">
                            {item.weeksBefore} weeks before
                          </span>
                          <h4 className="text-[14px] font-semibold text-[#252525]">{item.title}</h4>
                        </div>
                        <p className="text-[13px] text-[#747474] mb-2">{item.description}</p>
                        {item.tasks.length > 0 && (
                          <ul className="space-y-1">
                            {item.tasks.map((t, j) => (
                              <li key={j} className="flex items-center gap-1.5 text-[13px] text-[#252525]">
                                <span className="material-symbols-outlined text-[14px] text-[#287A4B]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Tasks */}
            {activeSection === 'tasks' && (
              <Card padded>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-semibold text-[#252525]">Task Checklist ({plan.tasks.length} tasks)</h3>
                  <Button
                    size="sm"
                    icon={savedSections.has('tasks') ? 'check' : 'add'}
                    disabled={savingTasks || savedSections.has('tasks')}
                    onClick={() => {
                      const hasTasks = taskStorage.getByEvent(event.id).length > 0;
                      if (hasTasks) setConfirmReplace('tasks');
                      else addTasksToEvent();
                    }}
                  >
                    {savedSections.has('tasks') ? 'Added to Tasks' : 'Add to My Tasks'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {plan.tasks.map((task, i) => (
                    <GeneratedTaskRow key={i} task={task} />
                  ))}
                </div>
              </Card>
            )}

            {/* Vendors */}
            {activeSection === 'vendors' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-4">Vendor Guide</h3>
                <p className="text-[12px] text-[#747474] mb-4 italic">
                  These are category guides, not real vendor recommendations. Use them to guide your research.
                </p>
                <div className="space-y-4">
                  {plan.vendorSuggestions.map((vs, i) => (
                    <VendorSuggestionCard key={i} suggestion={vs} event={event} />
                  ))}
                </div>
              </Card>
            )}

            {/* Guest experience */}
            {activeSection === 'guest' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-4">Guest Experience Tips</h3>
                <ul className="space-y-3">
                  {plan.guestExperienceTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#252525]">
                      <span className="material-symbols-outlined text-[18px] text-[#E87524] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_people</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Contingency */}
            {activeSection === 'contingency' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-4">Contingency Plans</h3>
                <ul className="space-y-3">
                  {plan.contingencyNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#252525]">
                      <span className="material-symbols-outlined text-[18px] text-[#D97706] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_off</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Sustainability */}
            {activeSection === 'sustainability' && (
              <Card padded>
                <h3 className="text-[15px] font-semibold text-[#252525] mb-4">Sustainability Tips</h3>
                <ul className="space-y-3">
                  {plan.sustainabilityTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-[#252525]">
                      <span className="material-symbols-outlined text-[18px] text-[#287A4B] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Confirm replace dialog */}
      <ConfirmDialog
        open={!!confirmReplace}
        onClose={() => setConfirmReplace(null)}
        onConfirm={() => {
          if (confirmReplace === 'tasks') addTasksToEvent();
          else if (confirmReplace === 'budget') addBudgetToEvent();
          setConfirmReplace(null);
        }}
        title="Add AI Suggestions"
        message={`Your event already has ${confirmReplace}. The AI suggestions will be added alongside existing ones (not replaced). Continue?`}
        confirmLabel="Add Anyway"
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BudgetAllocRow({ alloc, event, total }: { alloc: BudgetAllocation; event: Event; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((alloc.estimatedAmount / total) * 100)) : alloc.percentage;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[13px] mb-1">
          <span className="font-medium text-[#252525] truncate">{alloc.category}</span>
          <span className="tabular-nums text-[#252525] shrink-0 ml-2">{formatCurrency(alloc.estimatedAmount, event.currency)}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#E7E5E2] overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-[#E87524] rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-[#747474] mt-0.5">{alloc.description}</p>
      </div>
      <span className="text-[12px] text-[#747474] w-10 text-right shrink-0">{pct}%</span>
    </div>
  );
}

function GeneratedTaskRow({ task }: { task: GeneratedTask }) {
  const PRIORITY_COLORS: Record<string, string> = {
    low: 'bg-[#287A4B]',
    medium: 'bg-[#D97706]',
    high: 'bg-[#E87524]',
    urgent: 'bg-[#DC2626]',
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#E7E5E2] last:border-0">
      <span className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', PRIORITY_COLORS[task.priority])} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[#252525]">{task.title}</p>
        {task.description && <p className="text-[12px] text-[#747474] mt-0.5">{task.description}</p>}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {task.category && (
            <span className="text-[11px] px-1.5 py-0.5 bg-[#F7F7F5] text-[#747474] rounded border border-[#E7E5E2]">
              {task.category}
            </span>
          )}
          <span className="text-[11px] px-1.5 py-0.5 bg-[#F7F7F5] text-[#747474] rounded border border-[#E7E5E2]">
            {task.weeksBefore}w before
          </span>
        </div>
      </div>
      <Badge variant={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'accent' : 'neutral'}>
        {task.priority}
      </Badge>
    </div>
  );
}

function VendorSuggestionCard({ suggestion, event: _ }: { suggestion: VendorSuggestion; event: Event }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-[#E7E5E2] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F5] transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div>
          <p className="text-[14px] font-semibold text-[#252525] capitalize">{suggestion.category}</p>
          <p className="text-[12px] text-[#747474]">{suggestion.description}</p>
        </div>
        <span className="material-symbols-outlined text-[20px] text-[#747474] shrink-0">
          {expanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#E7E5E2] pt-3 space-y-3">
          <div>
            <p className="text-[12px] font-semibold text-[#747474] uppercase tracking-wide mb-1">Budget Guidance</p>
            <p className="text-[13px] text-[#252525]">{suggestion.budgetGuidance}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#747474] uppercase tracking-wide mb-1">Selection Criteria</p>
            <ul className="space-y-1">
              {suggestion.selectionCriteria.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[13px] text-[#252525]">
                  <span className="material-symbols-outlined text-[14px] text-[#287A4B]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#747474] uppercase tracking-wide mb-1">Questions to Ask</p>
            <ul className="space-y-1">
              {suggestion.questionsToAsk.map((q, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[13px] text-[#252525]">
                  <span className="material-symbols-outlined text-[14px] text-[#E87524]">help</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
