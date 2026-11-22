import { create } from 'zustand';

import { seedAgendaItems } from '@/mocks/seed';
import type { AgendaItem } from '@/types';
import { persist, persistLocal } from './persist';

type AgendaState = {
  items: AgendaItem[];
  addItem: (item: Omit<AgendaItem, 'id'>) => AgendaItem;
  toggleDone: (id: string) => void;
  removeItem: (id: string) => void;
};

export const useAgendaService = create<AgendaState>()(
  persist(
    (set, get) => ({
      items: seedAgendaItems,
      addItem: (item) => {
        const created: AgendaItem = { ...item, id: `ag-${Date.now()}` };
        set({ items: [...get().items, created] });
        return created;
      },
      toggleDone: (id) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) }),
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    persistLocal('agenda'),
  ),
);
