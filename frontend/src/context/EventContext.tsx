import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Event } from '@/types';
import { eventStorage, seedDemoData } from '@/services/storage';

interface EventContextValue {
  events: Event[];
  loading: boolean;
  refresh: () => void;
  getEvent: (id: string) => Event | undefined;
  deleteEvent: (id: string) => void;
}

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setEvents(eventStorage.getAll());
  }, []);

  useEffect(() => {
    seedDemoData();
    refresh();
    setLoading(false);
  }, [refresh]);

  const getEvent = useCallback((id: string) => eventStorage.getById(id), []);

  const deleteEvent = useCallback((id: string) => {
    eventStorage.delete(id);
    refresh();
  }, [refresh]);

  return (
    <EventContext.Provider value={{ events, loading, refresh, getEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents(): EventContextValue {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}
