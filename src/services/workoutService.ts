import { create } from 'zustand';

import { seedWorkoutSessions } from '@/mocks/seed';
import type { WorkoutSession } from '@/types';
import { persist, persistLocal } from './persist';

type WorkoutState = {
  sessions: WorkoutSession[];
  toggleSet: (sessionId: string, exerciseId: string, setIndex: number) => void;
  completeSession: (sessionId: string, durationMin: number, note?: string) => void;
  setSessionNote: (sessionId: string, note: string) => void;
};

export const useWorkoutService = create<WorkoutState>()(
  persist(
    (set, get) => ({
      sessions: seedWorkoutSessions,
      toggleSet: (sessionId, exerciseId, setIndex) =>
        set({
          sessions: get().sessions.map((s) =>
            s.id !== sessionId
              ? s
              : {
                  ...s,
                  exercises: s.exercises.map((e) =>
                    e.id !== exerciseId
                      ? e
                      : {
                          ...e,
                          completedSetIndexes: e.completedSetIndexes.includes(setIndex)
                            ? e.completedSetIndexes.filter((i) => i !== setIndex)
                            : [...e.completedSetIndexes, setIndex],
                        },
                  ),
                },
          ),
        }),
      completeSession: (sessionId, durationMin, note) =>
        set({
          sessions: get().sessions.map((s) =>
            s.id === sessionId ? { ...s, completedAt: new Date().toISOString(), durationMin, note } : s,
          ),
        }),
      setSessionNote: (sessionId: string, note: string) =>
        set({ sessions: get().sessions.map((s) => (s.id === sessionId ? { ...s, note } : s)) }),
    }),
    persistLocal('workout'),
  ),
);

export function getSessionSetsSummary(session: WorkoutSession) {
  let total = 0;
  let done = 0;
  let volumeKg = 0;
  for (const ex of session.exercises) {
    total += ex.sets;
    done += ex.completedSetIndexes.length;
    if (ex.loadKg) volumeKg += ex.completedSetIndexes.length * ex.reps * ex.loadKg;
  }
  return { total, done, volumeKg };
}

export function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}
