import {
  ActivityRecord,
  BudgetCategory,
  Event,
  Expense,
  Guest,
  Task,
  Vendor,
} from '@/types';
import { generateId, nowISO } from '@/utils/helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Storage keys
// ─────────────────────────────────────────────────────────────────────────────

const KEYS = {
  events: 'gatherly:events',
  tasks: 'gatherly:tasks',
  expenses: 'gatherly:expenses',
  categories: 'gatherly:categories',
  vendors: 'gatherly:vendors',
  guests: 'gatherly:guests',
  activity: 'gatherly:activity',
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic helpers
// ─────────────────────────────────────────────────────────────────────────────

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ─────────────────────────────────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────────────────────────────────

export const eventStorage = {
  getAll(): Event[] {
    return read<Event>(KEYS.events).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getById(id: string): Event | undefined {
    return read<Event>(KEYS.events).find(e => e.id === id);
  },
  create(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const events = read<Event>(KEYS.events);
    const event: Event = {
      ...data,
      id: generateId(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    write(KEYS.events, [...events, event]);
    return event;
  },
  update(id: string, data: Partial<Omit<Event, 'id' | 'createdAt'>>): Event | null {
    const events = read<Event>(KEYS.events);
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const updated = { ...events[idx], ...data, updatedAt: nowISO() };
    events[idx] = updated;
    write(KEYS.events, events);
    return updated;
  },
  delete(id: string): void {
    const events = read<Event>(KEYS.events).filter(e => e.id !== id);
    write(KEYS.events, events);
    // Cascade delete related data
    [KEYS.tasks, KEYS.expenses, KEYS.categories, KEYS.vendors, KEYS.guests].forEach(key => {
      const items = read<{ eventId: string }>(key).filter(i => i.eventId !== id);
      write(key, items);
    });
    const activity = read<ActivityRecord>(KEYS.activity).filter(a => a.eventId !== id);
    write(KEYS.activity, activity);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Budget Categories
// ─────────────────────────────────────────────────────────────────────────────

export const categoryStorage = {
  getByEvent(eventId: string): BudgetCategory[] {
    return read<BudgetCategory>(KEYS.categories).filter(c => c.eventId === eventId);
  },
  create(data: Omit<BudgetCategory, 'id' | 'createdAt'>): BudgetCategory {
    const items = read<BudgetCategory>(KEYS.categories);
    const item: BudgetCategory = { ...data, id: generateId(), createdAt: nowISO() };
    write(KEYS.categories, [...items, item]);
    return item;
  },
  update(id: string, data: Partial<Omit<BudgetCategory, 'id' | 'eventId' | 'createdAt'>>): BudgetCategory | null {
    const items = read<BudgetCategory>(KEYS.categories);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    write(KEYS.categories, items);
    return items[idx];
  },
  delete(id: string): void {
    write(KEYS.categories, read<BudgetCategory>(KEYS.categories).filter(i => i.id !== id));
    // un-categorise expenses
    const expenses = read<Expense>(KEYS.expenses).map(e =>
      e.categoryId === id ? { ...e, categoryId: undefined } : e
    );
    write(KEYS.expenses, expenses);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Expenses
// ─────────────────────────────────────────────────────────────────────────────

export const expenseStorage = {
  getByEvent(eventId: string): Expense[] {
    return read<Expense>(KEYS.expenses)
      .filter(e => e.eventId === eventId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense {
    const items = read<Expense>(KEYS.expenses);
    const item: Expense = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    write(KEYS.expenses, [...items, item]);
    return item;
  },
  update(id: string, data: Partial<Omit<Expense, 'id' | 'eventId' | 'createdAt'>>): Expense | null {
    const items = read<Expense>(KEYS.expenses);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: nowISO() };
    write(KEYS.expenses, items);
    return items[idx];
  },
  delete(id: string): void {
    write(KEYS.expenses, read<Expense>(KEYS.expenses).filter(i => i.id !== id));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────────────────────

export const taskStorage = {
  getByEvent(eventId: string): Task[] {
    return read<Task>(KEYS.tasks)
      .filter(t => t.eventId === eventId)
      .sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },
  getAll(): Task[] {
    return read<Task>(KEYS.tasks);
  },
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const items = read<Task>(KEYS.tasks);
    const item: Task = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    write(KEYS.tasks, [...items, item]);
    return item;
  },
  update(id: string, data: Partial<Omit<Task, 'id' | 'eventId' | 'createdAt'>>): Task | null {
    const items = read<Task>(KEYS.tasks);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: nowISO() };
    write(KEYS.tasks, items);
    return items[idx];
  },
  delete(id: string): void {
    write(KEYS.tasks, read<Task>(KEYS.tasks).filter(i => i.id !== id));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Vendors
// ─────────────────────────────────────────────────────────────────────────────

export const vendorStorage = {
  getByEvent(eventId: string): Vendor[] {
    return read<Vendor>(KEYS.vendors)
      .filter(v => v.eventId === eventId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  create(data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const items = read<Vendor>(KEYS.vendors);
    const item: Vendor = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    write(KEYS.vendors, [...items, item]);
    return item;
  },
  update(id: string, data: Partial<Omit<Vendor, 'id' | 'eventId' | 'createdAt'>>): Vendor | null {
    const items = read<Vendor>(KEYS.vendors);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: nowISO() };
    write(KEYS.vendors, items);
    return items[idx];
  },
  delete(id: string): void {
    write(KEYS.vendors, read<Vendor>(KEYS.vendors).filter(i => i.id !== id));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Guests
// ─────────────────────────────────────────────────────────────────────────────

export const guestStorage = {
  getByEvent(eventId: string): Guest[] {
    return read<Guest>(KEYS.guests)
      .filter(g => g.eventId === eventId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  create(data: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Guest {
    const items = read<Guest>(KEYS.guests);
    const item: Guest = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    write(KEYS.guests, [...items, item]);
    return item;
  },
  update(id: string, data: Partial<Omit<Guest, 'id' | 'eventId' | 'createdAt'>>): Guest | null {
    const items = read<Guest>(KEYS.guests);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data, updatedAt: nowISO() };
    write(KEYS.guests, items);
    return items[idx];
  },
  delete(id: string): void {
    write(KEYS.guests, read<Guest>(KEYS.guests).filter(i => i.id !== id));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Activity Log
// ─────────────────────────────────────────────────────────────────────────────

export const activityStorage = {
  getByEvent(eventId: string): ActivityRecord[] {
    return read<ActivityRecord>(KEYS.activity)
      .filter(a => a.eventId === eventId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50);
  },
  getRecent(limit = 20): ActivityRecord[] {
    return read<ActivityRecord>(KEYS.activity)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
  log(eventId: string, type: ActivityRecord['type'], description: string): void {
    const items = read<ActivityRecord>(KEYS.activity);
    const item: ActivityRecord = {
      id: generateId(),
      eventId,
      type,
      description,
      createdAt: nowISO(),
    };
    // Keep max 200 records
    write(KEYS.activity, [item, ...items].slice(0, 200));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Seed demo data
// ─────────────────────────────────────────────────────────────────────────────

export function seedDemoData(): void {
  if (eventStorage.getAll().length > 0) return; // Already seeded

  const event = eventStorage.create({
    name: "Ananya & Rohan's Wedding",
    type: 'wedding',
    status: 'in_progress',
    startDate: '2025-02-14',
    format: 'in_person',
    location: 'The Grand Palace, Mumbai',
    guestCount: 350,
    budget: 2500000,
    currency: 'INR',
    preferences: {
      style: 'Royal & Traditional',
      theme: 'Marigold & Gold',
      culturalPreferences: 'Hindu Marathi ceremony',
      dietaryRequirements: 'Vegetarian options required, 20% Jain guests',
      accessibilityNeeds: 'Wheelchair access for elderly guests',
      planningPriorities: ['Beautiful decorations & theme', 'Delicious food & catering', 'Professional photography'],
      notes: 'Dream wedding with a mix of traditional and contemporary elements',
    },
  });

  const event2 = eventStorage.create({
    name: "Priya's 30th Birthday",
    type: 'birthday',
    status: 'planning',
    startDate: '2025-03-15',
    format: 'in_person',
    location: 'Skyline Rooftop Bar, Bangalore',
    guestCount: 80,
    budget: 150000,
    currency: 'INR',
    preferences: {
      style: 'Modern & Chic',
      theme: 'Celestial / Stars',
      dietaryRequirements: 'Mix of veg and non-veg',
      planningPriorities: ['Memorable guest experience', 'Live music & entertainment'],
    },
  });

  // Budget categories for wedding
  const cat1 = categoryStorage.create({ eventId: event.id, name: 'Venue', plannedAmount: 600000, color: '#E87524' });
  const cat2 = categoryStorage.create({ eventId: event.id, name: 'Catering', plannedAmount: 750000, color: '#287A4B' });
  const cat3 = categoryStorage.create({ eventId: event.id, name: 'Photography', plannedAmount: 200000, color: '#2563EB' });
  const cat4 = categoryStorage.create({ eventId: event.id, name: 'Decoration', plannedAmount: 400000, color: '#7C3AED' });
  const cat5 = categoryStorage.create({ eventId: event.id, name: 'Music & Entertainment', plannedAmount: 150000, color: '#DB2777' });
  const cat6 = categoryStorage.create({ eventId: event.id, name: 'Attire', plannedAmount: 250000, color: '#0891B2' });

  // Expenses
  expenseStorage.create({ eventId: event.id, categoryId: cat1.id, description: 'Venue booking deposit', estimatedAmount: 600000, actualAmount: 600000, status: 'paid', source: 'manual', vendor: 'The Grand Palace' });
  expenseStorage.create({ eventId: event.id, categoryId: cat2.id, description: 'Catering (350 guests)', estimatedAmount: 750000, status: 'pending', source: 'manual', vendor: 'Royal Feast Caterers' });
  expenseStorage.create({ eventId: event.id, categoryId: cat3.id, description: 'Photography & video package', estimatedAmount: 180000, actualAmount: 200000, status: 'paid', source: 'manual', vendor: 'Clicks & Memories' });
  expenseStorage.create({ eventId: event.id, categoryId: cat4.id, description: 'Floral decoration', estimatedAmount: 350000, status: 'pending', source: 'manual' });
  expenseStorage.create({ eventId: event.id, categoryId: cat5.id, description: 'DJ & sound system', estimatedAmount: 80000, status: 'pending', source: 'manual' });
  expenseStorage.create({ eventId: event.id, categoryId: cat6.id, description: 'Bridal lehenga', estimatedAmount: 150000, actualAmount: 175000, status: 'paid', source: 'manual' });

  // Tasks for wedding
  taskStorage.create({ eventId: event.id, title: 'Book officiant / pandit', dueDate: '2025-01-15', priority: 'urgent', status: 'done', source: 'manual', category: 'Ceremony' });
  taskStorage.create({ eventId: event.id, title: 'Send save-the-dates', dueDate: '2025-01-10', priority: 'high', status: 'done', source: 'manual', category: 'Invitations' });
  taskStorage.create({ eventId: event.id, title: 'Confirm catering menu', dueDate: '2025-01-20', priority: 'high', status: 'in_progress', source: 'manual', category: 'Catering' });
  taskStorage.create({ eventId: event.id, title: 'Final guest list approval', dueDate: '2025-01-25', priority: 'high', status: 'todo', source: 'manual', category: 'Guests' });
  taskStorage.create({ eventId: event.id, title: 'Bridal mehendi appointment', dueDate: '2025-02-12', priority: 'medium', status: 'todo', source: 'manual', category: 'Beauty' });
  taskStorage.create({ eventId: event.id, title: 'Arrange airport transfers for outstation guests', dueDate: '2025-02-01', priority: 'medium', status: 'todo', source: 'manual', category: 'Logistics' });
  taskStorage.create({ eventId: event.id, title: 'Decoration dry run at venue', dueDate: '2025-02-10', priority: 'medium', status: 'todo', source: 'manual', category: 'Decoration' });

  // Vendors for wedding
  vendorStorage.create({ eventId: event.id, name: 'The Grand Palace', category: 'venue', contactName: 'Rakesh Mehta', contactPhone: '+91 98765 43210', quotedPrice: 600000, finalPrice: 600000, status: 'booked', paymentStatus: 'deposit_paid', source: 'manual' });
  vendorStorage.create({ eventId: event.id, name: 'Royal Feast Caterers', category: 'catering', contactName: 'Sunita Joshi', contactPhone: '+91 98000 12345', quotedPrice: 750000, status: 'booked', paymentStatus: 'none', notes: 'Vegetarian & Jain options confirmed', source: 'manual' });
  vendorStorage.create({ eventId: event.id, name: 'Clicks & Memories', category: 'photography', contactName: 'Vikram Shah', quotedPrice: 180000, finalPrice: 200000, status: 'booked', paymentStatus: 'fully_paid', source: 'manual' });
  vendorStorage.create({ eventId: event.id, name: 'Bloom Decor Studio', category: 'decoration', contactName: 'Meera Nair', quotedPrice: 380000, status: 'quoted', paymentStatus: 'none', notes: 'Comparing with two other vendors', source: 'manual' });

  // Guests for wedding
  guestStorage.create({ eventId: event.id, name: 'Dr. Rajesh & Sunita Sharma', rsvpStatus: 'confirmed', partySize: 4, group: 'Family', dietaryNotes: 'Jain', source: 'manual' } as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
  guestStorage.create({ eventId: event.id, name: 'Aditya Kumar', rsvpStatus: 'confirmed', partySize: 2, group: 'Friends', source: 'manual' } as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
  guestStorage.create({ eventId: event.id, name: 'Nisha & Raj Malhotra', rsvpStatus: 'tentative', partySize: 3, group: 'Family', source: 'manual' } as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
  guestStorage.create({ eventId: event.id, name: 'Priya Patel', rsvpStatus: 'confirmed', partySize: 1, group: 'Friends', dietaryNotes: 'Vegan', source: 'manual' } as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);
  guestStorage.create({ eventId: event.id, name: 'Venkat & Lakshmi Rao', rsvpStatus: 'no_response', partySize: 2, group: 'Colleagues', source: 'manual' } as Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>);

  // Activity
  activityStorage.log(event.id, 'event_created', 'Event created');
  activityStorage.log(event.id, 'vendor_added', 'Vendor "The Grand Palace" added and booked');
  activityStorage.log(event.id, 'expense_added', 'Venue booking deposit of ₹6,00,000 recorded');
  activityStorage.log(event.id, 'task_completed', 'Task "Book officiant / pandit" marked as done');
  activityStorage.log(event2.id, 'event_created', 'Event created');
}
