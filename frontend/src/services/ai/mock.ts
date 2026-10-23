import {
  AIProviderInfo,
  BudgetAllocation,
  Currency,
  EventType,
  GeneratedTask,
  PlanRequest,
  PlanResponse,
  TimelineItem,
  VendorSuggestion,
} from '@/types';
import { nowISO } from '@/utils/helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic Mock AI Provider
// Always available, clearly labeled as Demo Mode.
// Returns realistic, structured plans based on event type and size.
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_PROVIDER_INFO: AIProviderInfo = {
  id: 'mock',
  name: 'Demo Mode (Mock AI)',
  status: 'available',
  isDemo: true,
  description: 'Built-in demo provider. Returns realistic plans without any AI API. Configure a real provider in Settings.',
};

function simulateDelay(ms = 1200): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function budgetAllocations(eventType: EventType, _currency: Currency, total: number): BudgetAllocation[] {
  const allocMap: Record<EventType, Array<{ category: string; pct: number; description: string }>> = {
    wedding: [
      { category: 'Venue', pct: 25, description: 'Venue rental, mandap, lighting setup' },
      { category: 'Catering', pct: 30, description: 'Food, beverages, service staff' },
      { category: 'Photography & Video', pct: 8, description: 'Photographer, videographer, drone' },
      { category: 'Decoration', pct: 15, description: 'Floral, draping, centrepieces, entrance' },
      { category: 'Music & Entertainment', pct: 5, description: 'DJ, live band, sangeet performances' },
      { category: 'Attire & Grooming', pct: 8, description: 'Bridal/groom outfits, jewellery, makeup' },
      { category: 'Invitations & Stationery', pct: 2, description: 'Cards, digital invites, programs' },
      { category: 'Transport & Logistics', pct: 4, description: 'Baraat, guest transfers, parking' },
      { category: 'Gifts & Favours', pct: 2, description: 'Return gifts, welcome kits' },
      { category: 'Contingency', pct: 1, description: 'Unexpected expenses buffer' },
    ],
    birthday: [
      { category: 'Venue', pct: 30, description: 'Venue hire or home setup' },
      { category: 'Catering & Cake', pct: 35, description: 'Food, drinks, birthday cake' },
      { category: 'Decoration', pct: 15, description: 'Balloons, banners, table settings' },
      { category: 'Entertainment', pct: 12, description: 'DJ, games, photo booth' },
      { category: 'Invitations', pct: 3, description: 'Digital or printed invites' },
      { category: 'Contingency', pct: 5, description: 'Buffer' },
    ],
    corporate: [
      { category: 'Venue & AV', pct: 35, description: 'Meeting room, projectors, microphones' },
      { category: 'Catering', pct: 25, description: 'Meals, refreshments, networking dinner' },
      { category: 'Speakers & Entertainment', pct: 15, description: 'Keynote, panel fees, entertainment' },
      { category: 'Branding & Materials', pct: 10, description: 'Banners, brochures, name badges' },
      { category: 'Photography', pct: 5, description: 'Event coverage' },
      { category: 'Technology', pct: 5, description: 'Live streaming, apps, registration' },
      { category: 'Contingency', pct: 5, description: 'Buffer' },
    ],
    fundraiser: [
      { category: 'Venue', pct: 20, description: 'Space rental' },
      { category: 'Catering', pct: 25, description: 'Food and beverages' },
      { category: 'Entertainment', pct: 15, description: 'Performances, auction setup' },
      { category: 'Marketing & Promotion', pct: 15, description: 'Ads, social media, PR' },
      { category: 'Logistics', pct: 15, description: 'Staffing, equipment, transport' },
      { category: 'Contingency', pct: 10, description: 'Buffer' },
    ],
    engagement: [
      { category: 'Venue', pct: 28, description: 'Venue and setup' },
      { category: 'Catering', pct: 30, description: 'Food and drinks' },
      { category: 'Decoration', pct: 18, description: 'Flowers and decor' },
      { category: 'Photography', pct: 10, description: 'Photo and video' },
      { category: 'Attire', pct: 8, description: 'Outfits and jewellery' },
      { category: 'Contingency', pct: 6, description: 'Buffer' },
    ],
    anniversary: [
      { category: 'Venue', pct: 30, description: 'Venue hire' },
      { category: 'Catering', pct: 30, description: 'Food and drinks' },
      { category: 'Decoration', pct: 18, description: 'Flowers, special setup' },
      { category: 'Photography', pct: 12, description: 'Memories captured' },
      { category: 'Entertainment', pct: 5, description: 'Music' },
      { category: 'Contingency', pct: 5, description: 'Buffer' },
    ],
    college_festival: [
      { category: 'Stage & AV', pct: 25, description: 'Stage, sound, lighting' },
      { category: 'Food Stalls', pct: 20, description: 'Food vendors, refreshments' },
      { category: 'Artists & Performers', pct: 25, description: 'Bands, DJs, speakers' },
      { category: 'Logistics', pct: 15, description: 'Passes, security, crew' },
      { category: 'Marketing', pct: 10, description: 'Posters, social media' },
      { category: 'Contingency', pct: 5, description: 'Buffer' },
    ],
    community_gathering: [
      { category: 'Venue', pct: 25, description: 'Space and setup' },
      { category: 'Catering', pct: 35, description: 'Community meals' },
      { category: 'Activities', pct: 20, description: 'Games, performances, programmes' },
      { category: 'Decoration', pct: 10, description: 'Setup and ambiance' },
      { category: 'Contingency', pct: 10, description: 'Buffer' },
    ],
    cultural_program: [
      { category: 'Venue & Stage', pct: 30, description: 'Hall and stage setup' },
      { category: 'Performers', pct: 30, description: 'Artists and troupes' },
      { category: 'Costumes & Props', pct: 15, description: 'Costumes, set pieces' },
      { category: 'AV & Lighting', pct: 15, description: 'Sound and lighting' },
      { category: 'Catering', pct: 7, description: 'Refreshments' },
      { category: 'Contingency', pct: 3, description: 'Buffer' },
    ],
    conference: [
      { category: 'Venue & AV', pct: 35, description: 'Conference hall and tech' },
      { category: 'Catering', pct: 20, description: 'Meals, tea, coffee' },
      { category: 'Speakers', pct: 20, description: 'Speaker fees, travel' },
      { category: 'Materials', pct: 10, description: 'Bags, notebooks, name tags' },
      { category: 'Marketing', pct: 10, description: 'Promotion and registration' },
      { category: 'Contingency', pct: 5, description: 'Buffer' },
    ],
    custom: [
      { category: 'Venue', pct: 30, description: 'Venue and setup' },
      { category: 'Catering', pct: 30, description: 'Food and drinks' },
      { category: 'Entertainment', pct: 15, description: 'Entertainment and activities' },
      { category: 'Decoration', pct: 15, description: 'Decor and ambiance' },
      { category: 'Contingency', pct: 10, description: 'Buffer' },
    ],
  };

  const allocs = allocMap[eventType] ?? allocMap.custom;
  return allocs.map(a => ({
    category: a.category,
    percentage: a.pct,
    estimatedAmount: Math.round((a.pct / 100) * total),
    description: a.description,
  }));
}

function timeline(eventType: EventType, guestCount: number): TimelineItem[] {
  const isLargeEvent = guestCount > 150;
  const base: TimelineItem[] = [
    {
      weeksBefore: isLargeEvent ? 24 : 16,
      title: 'Early Planning',
      description: 'Lock in the big-ticket decisions early',
      tasks: ['Set overall budget', 'Choose event date', 'Select and book venue', 'Begin guest list'],
    },
    {
      weeksBefore: isLargeEvent ? 16 : 12,
      title: 'Vendor Booking',
      description: 'Secure all primary service providers',
      tasks: ['Book caterer', 'Book photographer/videographer', 'Book entertainment', 'Order invitations'],
    },
    {
      weeksBefore: 8,
      title: 'Communication',
      description: 'Get responses and plan details',
      tasks: ['Send invitations', 'Confirm vendors', 'Plan menu in detail', 'Arrange accommodation for outstation guests'],
    },
    {
      weeksBefore: 4,
      title: 'Final Confirmations',
      description: 'Finalize all numbers and logistics',
      tasks: ['Collect RSVPs', 'Final headcount to caterer', 'Confirm all vendor timelines', 'Create day-of schedule'],
    },
    {
      weeksBefore: 1,
      title: 'Final Week',
      description: 'Last checks before the big day',
      tasks: ['Venue walkthrough', 'Briefing with all vendors', 'Prepare payments', 'Delegate day-of roles'],
    },
  ];

  if (eventType === 'wedding') {
    base.unshift({
      weeksBefore: 52,
      title: 'One Year Out',
      description: 'Start the big decisions',
      tasks: ['Set vision and style', 'Book popular venues', 'Set budget framework', 'Research photographers'],
    });
  }

  return base;
}

function tasks(eventType: EventType, guestCount: number): GeneratedTask[] {
  const isLarge = guestCount > 100;

  const common: GeneratedTask[] = [
    { title: 'Set and confirm total budget', description: 'Get agreement from all decision-makers on the final budget', weeksBefore: isLarge ? 24 : 12, priority: 'urgent' },
    { title: 'Research and book venue', description: 'Visit at least 3 venues and confirm availability', weeksBefore: isLarge ? 20 : 10, priority: 'urgent', category: 'Venue' },
    { title: 'Create master guest list', description: 'Compile names, contact details, and dietary needs', weeksBefore: 10, priority: 'high', category: 'Guests' },
    { title: 'Send invitations', description: 'Send via post or digital platform', weeksBefore: 8, priority: 'high', category: 'Invitations' },
    { title: 'Confirm final guest count with caterer', description: 'Typically 1-2 weeks before event', weeksBefore: 2, priority: 'urgent', category: 'Catering' },
    { title: 'Prepare event day schedule', description: 'Minute-by-minute timeline for the day', weeksBefore: 2, priority: 'high' },
    { title: 'Delegate day-of coordinator role', description: 'Assign someone to manage logistics on the day', weeksBefore: 1, priority: 'high' },
    { title: 'Confirm all vendor arrival times', description: 'Share schedule with all vendors', weeksBefore: 1, priority: 'high' },
    { title: 'Post-event thank you messages', description: 'Send to guests and vendors within a week', weeksBefore: -1, priority: 'medium' },
  ];

  const typeSpecific: Record<EventType, GeneratedTask[]> = {
    wedding: [
      { title: 'Book officiant / pandit', weeksBefore: 20, priority: 'urgent', category: 'Ceremony' },
      { title: 'Choose wedding attire', weeksBefore: 16, priority: 'high', category: 'Attire' },
      { title: 'Book bridal makeup artist', weeksBefore: 12, priority: 'high', category: 'Beauty' },
      { title: 'Plan sangeet / mehendi functions', weeksBefore: 10, priority: 'medium', category: 'Pre-events' },
      { title: 'Order wedding cake', weeksBefore: 6, priority: 'medium', category: 'Catering' },
      { title: 'Rehearsal dinner planning', weeksBefore: 2, priority: 'medium', category: 'Pre-events' },
    ],
    birthday: [
      { title: 'Choose party theme', weeksBefore: 8, priority: 'medium', category: 'Theme' },
      { title: 'Order custom birthday cake', weeksBefore: 3, priority: 'high', category: 'Catering' },
      { title: 'Set up photo booth area', weeksBefore: 1, priority: 'low', category: 'Entertainment' },
      { title: 'Plan party games and activities', weeksBefore: 4, priority: 'medium', category: 'Entertainment' },
    ],
    corporate: [
      { title: 'Confirm speakers and panelists', weeksBefore: 12, priority: 'urgent', category: 'Programme' },
      { title: 'Arrange AV and streaming setup', weeksBefore: 4, priority: 'high', category: 'Technology' },
      { title: 'Print name badges and materials', weeksBefore: 1, priority: 'medium', category: 'Materials' },
      { title: 'Set up registration system', weeksBefore: 8, priority: 'high', category: 'Registration' },
    ],
    fundraiser: [
      { title: 'Secure sponsorships', weeksBefore: 16, priority: 'urgent', category: 'Fundraising' },
      { title: 'Plan auction or raffle items', weeksBefore: 8, priority: 'high', category: 'Fundraising' },
      { title: 'Set up donation collection system', weeksBefore: 4, priority: 'high', category: 'Fundraising' },
    ],
    engagement: [
      { title: 'Choose ring or exchange gifts', weeksBefore: 8, priority: 'urgent', category: 'Ceremony' },
      { title: 'Plan surprise element if desired', weeksBefore: 6, priority: 'medium', category: 'Special' },
    ],
    anniversary: [
      { title: 'Create photo slideshow', weeksBefore: 4, priority: 'medium', category: 'Entertainment' },
      { title: 'Order anniversary cake', weeksBefore: 2, priority: 'medium', category: 'Catering' },
    ],
    college_festival: [
      { title: 'Form organizing committee', weeksBefore: 16, priority: 'urgent', category: 'Team' },
      { title: 'Secure permissions from institution', weeksBefore: 12, priority: 'urgent', category: 'Legal' },
      { title: 'Confirm headlining performers', weeksBefore: 10, priority: 'urgent', category: 'Entertainment' },
      { title: 'Sell sponsorships to local businesses', weeksBefore: 10, priority: 'high', category: 'Sponsorship' },
    ],
    community_gathering: [
      { title: 'Announce event to community', weeksBefore: 6, priority: 'high', category: 'Communication' },
      { title: 'Arrange volunteer team', weeksBefore: 4, priority: 'high', category: 'Volunteers' },
    ],
    cultural_program: [
      { title: 'Audition and select performers', weeksBefore: 10, priority: 'urgent', category: 'Performers' },
      { title: 'Design and print programme booklet', weeksBefore: 2, priority: 'medium', category: 'Materials' },
    ],
    conference: [
      { title: 'Build conference website / registration page', weeksBefore: 16, priority: 'urgent', category: 'Marketing' },
      { title: 'Launch call for papers / speakers', weeksBefore: 14, priority: 'high', category: 'Programme' },
      { title: 'Arrange accommodation partners', weeksBefore: 8, priority: 'medium', category: 'Logistics' },
    ],
    custom: [],
  };

  return [...common, ...(typeSpecific[eventType] ?? [])];
}

function vendors(eventType: EventType): VendorSuggestion[] {
  const common: VendorSuggestion[] = [
    {
      category: 'venue',
      description: 'The venue sets the tone for the entire event',
      selectionCriteria: ['Capacity and layout', 'Parking and accessibility', 'In-house catering policy', 'Cancellation terms'],
      questionsToAsk: ['What is included in the hire fee?', 'Is there a noise curfew?', 'What is the backup plan for bad weather?'],
      budgetGuidance: 'Typically 25–35% of total budget',
    },
    {
      category: 'catering',
      description: 'Food is one of the most remembered aspects of any event',
      selectionCriteria: ['Menu variety and dietary flexibility', 'Staff-to-guest ratio', 'Food hygiene certifications', 'Service style (buffet, sit-down, stations)'],
      questionsToAsk: ['Can you accommodate Jain / vegan / allergen needs?', 'What is the minimum order?', 'Do you provide crockery and cutlery?'],
      budgetGuidance: 'Typically 25–35% of total budget',
    },
    {
      category: 'photography',
      description: 'Your memories will be defined by the quality of the photography',
      selectionCriteria: ['Portfolio style match', 'Experience with similar events', 'Backup equipment', 'Editing turnaround time'],
      questionsToAsk: ['How many edited photos will we receive?', 'Do you have a second shooter?', 'What is the delivery timeline?'],
      budgetGuidance: 'Typically 8–12% of total budget',
    },
  ];

  const typeExtra: Partial<Record<EventType, VendorSuggestion[]>> = {
    wedding: [
      {
        category: 'decoration',
        description: 'Sets the visual theme and atmosphere',
        selectionCriteria: ['Portfolio and theme expertise', 'Sustainable material options', 'Setup/teardown timeline', 'Flexibility with DIY elements'],
        questionsToAsk: ['Can we see a mock setup?', 'Do you handle all the flowers?', 'What happens to the flowers after?'],
        budgetGuidance: '12–18% of total budget',
      },
      {
        category: 'music',
        description: 'Music creates the energy and mood',
        selectionCriteria: ['Live band vs DJ based on budget', 'Playlist flexibility', 'Equipment quality', 'Experience with sangeet events'],
        questionsToAsk: ['Do you have a setlist we can customise?', 'What is the setup time required?'],
        budgetGuidance: '5–8% of total budget',
      },
    ],
    corporate: [
      {
        category: 'equipment',
        description: 'AV and tech infrastructure for a professional event',
        selectionCriteria: ['Compatibility with venue systems', 'Technical support on-site', 'Streaming capabilities', 'Screen sizes for venue'],
        questionsToAsk: ['Do you provide a technician throughout the event?', 'What is the setup time?'],
        budgetGuidance: '8–15% of total budget',
      },
    ],
  };

  return [...common, ...(typeExtra[eventType] ?? [])];
}

function overview(req: PlanRequest): string {
  const guestWord = req.guestCount <= 20 ? 'intimate' : req.guestCount <= 80 ? 'medium-sized' : req.guestCount <= 200 ? 'large' : 'grand';
  return `This plan is tailored for **${req.eventName}** — a ${guestWord} ${req.eventType.replace('_', ' ')} for **${req.guestCount} guests** on **${new Date(req.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}**${req.location ? ` at ${req.location}` : ''}. The total budget is **${req.currency === 'INR' ? '₹' : req.currency}${req.budget.toLocaleString('en-IN')}**. All suggestions below are estimates and starting points — personalise them to your needs.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public function
// ─────────────────────────────────────────────────────────────────────────────

export async function mockGeneratePlan(req: PlanRequest): Promise<PlanResponse> {
  await simulateDelay(1400);

  return {
    overview: overview(req),
    assumptions: [
      `Guest count of ${req.guestCount} used for per-head cost estimates`,
      'Prices are indicative estimates for Indian tier-1 cities; actual costs vary by location',
      'Vegetarian catering assumed as base; non-vegetarian options add 10–20%',
      req.preferences.culturalPreferences
        ? `Cultural preferences noted: ${req.preferences.culturalPreferences}`
        : 'No specific cultural preferences noted; plan is generalised',
      'Timeline assumes no prior bookings have been made',
    ],
    themeIdeas: req.preferences.theme
      ? [
          req.preferences.theme,
          `${req.preferences.theme} with rustic touches`,
          `Modern minimalist inspired by ${req.preferences.theme}`,
          'Garden party with seasonal flowers',
          'Heritage venue with candlelight',
        ]
      : [
          'Classic Elegance — timeless whites and gold',
          'Bohemian Garden — wildflowers and string lights',
          'Royal Heritage — rich jewel tones and vintage props',
          'Modern Minimalist — clean lines, pastels, and greenery',
          'Festive Traditional — marigolds, kolam, and brass accents',
        ],
    budgetAllocations: budgetAllocations(req.eventType, req.currency, req.budget),
    timeline: timeline(req.eventType, req.guestCount),
    tasks: tasks(req.eventType, req.guestCount),
    vendorSuggestions: vendors(req.eventType),
    guestExperienceTips: [
      'Send a clear directions and parking guide with the invitation',
      'Set up a welcome drinks station near the entrance',
      `For ${req.guestCount} guests, consider staggered arrival times to avoid crowding`,
      req.preferences.dietaryRequirements
        ? `Clearly label all food stations for dietary requirements: ${req.preferences.dietaryRequirements}`
        : 'Label all food stations clearly with allergen and dietary information',
      req.preferences.accessibilityNeeds
        ? `Accessibility plan: ${req.preferences.accessibilityNeeds}. Assign a dedicated helper.`
        : 'Ensure accessible parking, ramps, and seating for guests who need it',
      'Create a memory table or guestbook area for a personal touch',
      'Brief all staff on the schedule and guest experience expectations',
    ],
    contingencyNotes: [
      'Purchase event insurance for large bookings',
      'Have a backup indoor space for outdoor elements',
      'Keep a 5–10% budget buffer for unexpected costs',
      'Have a point-of-contact for each vendor who can make on-day decisions',
      'Prepare a backup playlist in case the DJ/band has technical issues',
    ],
    sustainabilityTips: [
      'Choose a venue close to public transport to reduce guest travel emissions',
      'Use digital invitations instead of printed cards',
      'Work with caterers who use locally sourced, seasonal ingredients',
      'Choose potted plants over cut flowers for table centrepieces (guests can take them home)',
      'Arrange for leftover food donation to a local shelter',
      'Use reusable or compostable crockery for informal elements',
    ],
    providerId: 'mock',
    generatedAt: nowISO(),
  };
}
