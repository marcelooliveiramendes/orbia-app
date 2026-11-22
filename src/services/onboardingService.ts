import { create } from 'zustand';

import { persist, persistLocal } from './persist';

export type ModuleKey = 'agenda' | 'financas' | 'saude' | 'treinos' | 'compras';

type OnboardingState = {
  completed: boolean;
  modules: Record<ModuleKey, boolean>;
  notificationsEnabled: boolean;
  toggleModule: (key: ModuleKey) => void;
  setNotifications: (v: boolean) => void;
  complete: () => void;
  reset: () => void;
};

export const useOnboardingService = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completed: false,
      modules: { agenda: true, financas: true, saude: false, treinos: false, compras: true },
      notificationsEnabled: true,
      toggleModule: (key) => set({ modules: { ...get().modules, [key]: !get().modules[key] } }),
      setNotifications: (v) => set({ notificationsEnabled: v }),
      complete: () => set({ completed: true }),
      reset: () => set({ completed: false }),
    }),
    persistLocal('onboarding'),
  ),
);
