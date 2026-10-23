import { Currency } from '@/types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
  SGD: 'S$',
  AUD: 'A$',
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  INR: 'Indian Rupee (₹)',
  USD: 'US Dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British Pound (£)',
  AED: 'UAE Dirham (د.إ)',
  SGD: 'Singapore Dollar (S$)',
  AUD: 'Australian Dollar (A$)',
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  engagement: 'Engagement Ceremony',
  birthday: 'Birthday Party',
  anniversary: 'Anniversary',
  college_festival: 'College Festival',
  community_gathering: 'Community Gathering',
  cultural_program: 'Cultural Program',
  fundraiser: 'Fundraiser',
  corporate: 'Corporate Event',
  conference: 'Conference',
  custom: 'Custom Event',
};

export const EVENT_TYPE_ICONS: Record<string, string> = {
  wedding: 'favorite',
  engagement: 'diamond',
  birthday: 'cake',
  anniversary: 'celebration',
  college_festival: 'school',
  community_gathering: 'groups',
  cultural_program: 'theater_comedy',
  fundraiser: 'volunteer_activism',
  corporate: 'business',
  conference: 'co_present',
  custom: 'event',
};

export const EVENT_STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  blocked: 'Blocked',
};

export const VENDOR_CATEGORY_LABELS: Record<string, string> = {
  venue: 'Venue',
  catering: 'Catering',
  photography: 'Photography',
  videography: 'Videography',
  decoration: 'Decoration',
  music: 'Music & DJ',
  transport: 'Transport',
  entertainment: 'Entertainment',
  equipment: 'Equipment',
  flowers: 'Flowers',
  cake: 'Cake & Desserts',
  security: 'Security',
  cleaning: 'Cleaning',
  other: 'Other',
};

export const VENDOR_STATUS_LABELS: Record<string, string> = {
  researching: 'Researching',
  contacted: 'Contacted',
  quoted: 'Quote Received',
  booked: 'Booked',
  rejected: 'Not Selected',
};

export const RSVP_STATUS_LABELS: Record<string, string> = {
  invited: 'Invited',
  confirmed: 'Confirmed',
  declined: 'Declined',
  tentative: 'Tentative',
  no_response: 'No Response',
};

export const PLANNING_PRIORITIES = [
  'Beautiful decorations & theme',
  'Delicious food & catering',
  'Professional photography',
  'Live music & entertainment',
  'Comfortable venue & seating',
  'Memorable guest experience',
  'Staying within budget',
  'Eco-friendly & sustainable',
  'Smooth logistics & coordination',
  'Personalized touches',
];

export const CATEGORY_COLORS = [
  '#E87524', '#287A4B', '#2563EB', '#7C3AED',
  '#DB2777', '#0891B2', '#D97706', '#65A30D',
  '#DC2626', '#0284C7', '#9333EA', '#059669',
];

export const DEFAULT_CURRENCY: Currency = 'INR';

export const APP_VERSION = '1.0.0';
