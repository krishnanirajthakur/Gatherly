// ─────────────────────────────────────────────────────────────────────────────
// Core Data Models for Gatherly
// ─────────────────────────────────────────────────────────────────────────────

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD' | 'AUD';

export type EventType =
  | 'wedding'
  | 'engagement'
  | 'birthday'
  | 'anniversary'
  | 'college_festival'
  | 'community_gathering'
  | 'cultural_program'
  | 'fundraiser'
  | 'corporate'
  | 'conference'
  | 'custom';

export type EventStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';

export type EventFormat = 'in_person' | 'online' | 'hybrid';

// ─────────────────────────────────────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────────────────────────────────────

export interface EventPreferences {
  style?: string;
  theme?: string;
  culturalPreferences?: string;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  planningPriorities?: string[];
  notes?: string;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startDate: string; // ISO date string
  endDate?: string;
  format: EventFormat;
  location?: string;
  guestCount: number;
  budget: number;
  currency: Currency;
  preferences: EventPreferences;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget
// ─────────────────────────────────────────────────────────────────────────────

export type ExpenseStatus = 'pending' | 'paid' | 'cancelled';

export interface BudgetCategory {
  id: string;
  eventId: string;
  name: string;
  plannedAmount: number;
  color?: string;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  eventId: string;
  categoryId?: string;
  description: string;
  estimatedAmount: number;
  actualAmount?: number;
  date?: string;
  status: ExpenseStatus;
  paymentDueDate?: string;
  vendor?: string;
  notes?: string;
  source: 'manual' | 'ai_suggestion';
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────────────────────

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category?: string;
  assignee?: string;
  dependsOn?: string[];
  source: 'manual' | 'ai_suggestion';
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendors
// ─────────────────────────────────────────────────────────────────────────────

export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'videography'
  | 'decoration'
  | 'music'
  | 'transport'
  | 'entertainment'
  | 'equipment'
  | 'flowers'
  | 'cake'
  | 'security'
  | 'cleaning'
  | 'other';

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked' | 'rejected';
export type VendorPaymentStatus = 'none' | 'deposit_paid' | 'partially_paid' | 'fully_paid';

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  quotedPrice?: number;
  finalPrice?: number;
  status: VendorStatus;
  paymentStatus: VendorPaymentStatus;
  notes?: string;
  comparisonNotes?: string;
  source: 'manual' | 'ai_suggestion';
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guests
// ─────────────────────────────────────────────────────────────────────────────

export type RSVPStatus = 'invited' | 'confirmed' | 'declined' | 'tentative' | 'no_response';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: RSVPStatus;
  partySize: number;
  group?: string;
  tableAssignment?: string;
  dietaryNotes?: string;
  accessibilityNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI
// ─────────────────────────────────────────────────────────────────────────────

export type AIProviderStatus = 'available' | 'unavailable' | 'unconfigured' | 'error';

export interface AIProviderInfo {
  id: string;
  name: string;
  status: AIProviderStatus;
  isDemo: boolean;
  description: string;
}

export interface PlanRequest {
  eventId: string;
  eventName: string;
  eventType: EventType;
  startDate: string;
  guestCount: number;
  budget: number;
  currency: Currency;
  format: EventFormat;
  location?: string;
  preferences: EventPreferences;
}

export interface BudgetAllocation {
  category: string;
  percentage: number;
  estimatedAmount: number;
  description: string;
}

export interface TimelineItem {
  weeksBefore: number;
  title: string;
  description: string;
  tasks: string[];
}

export interface VendorSuggestion {
  category: VendorCategory;
  description: string;
  selectionCriteria: string[];
  questionsToAsk: string[];
  budgetGuidance: string;
}

export interface GeneratedTask {
  title: string;
  description?: string;
  weeksBefore: number;
  priority: TaskPriority;
  category?: string;
}

export interface PlanResponse {
  overview: string;
  assumptions: string[];
  themeIdeas: string[];
  budgetAllocations: BudgetAllocation[];
  timeline: TimelineItem[];
  tasks: GeneratedTask[];
  vendorSuggestions: VendorSuggestion[];
  guestExperienceTips: string[];
  contingencyNotes: string[];
  sustainabilityTips: string[];
  providerId: string;
  generatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityType =
  | 'event_created'
  | 'event_updated'
  | 'task_created'
  | 'task_completed'
  | 'expense_added'
  | 'vendor_added'
  | 'guest_added'
  | 'plan_generated';

export interface ActivityRecord {
  id: string;
  eventId: string;
  type: ActivityType;
  description: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget calculation results (always computed deterministically)
// ─────────────────────────────────────────────────────────────────────────────

export interface BudgetSummary {
  totalBudget: number;
  plannedExpenditure: number;
  actualExpenditure: number;
  remaining: number;
  percentUsed: number;
  isOverBudget: boolean;
  isNearLimit: boolean; // within 10%
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  plannedAmount: number;
  actualAmount: number;
  expenseCount: number;
  color: string;
}
