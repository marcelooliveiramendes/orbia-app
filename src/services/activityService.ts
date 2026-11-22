import { create } from 'zustand';

import { seedActivity } from '@/mocks/seed';
import type { ActivityEntry } from '@/types';
import { persist, persistLocal } from './persist';

type ActivityState = {
  entries: ActivityEntry[];
  log: (entry: Omit<ActivityEntry, 'id' | 'occurredAt'>) => void;
};

export const useActivityService = create<ActivityState>()(
  persist(
    (set, get) => ({
      entries: seedActivity,
      log: (entry) => {
        const created: ActivityEntry = {
          ...entry,
          id: `act-${Date.now()}`,
          occurredAt: new Date().toISOString(),
        };
        set({ entries: [created, ...get().entries] });
      },
    }),
    persistLocal('activity'),
  ),
);
