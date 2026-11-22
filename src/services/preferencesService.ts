import { create } from 'zustand';

import { persist, persistLocal } from './persist';

export type RetentionChoice = 'Não guardar' | '7 dias' | '30 dias';
export type PhotoRetentionChoice = 'Apagar após revisar' | 'Guardar com a compra';

type PreferencesState = {
  notifications: { agenda: boolean; contas: boolean; agua: boolean; resumo: boolean };
  accessibility: { motion: boolean; contraste: boolean };
  micAllowed: boolean;
  voiceRetention: RetentionChoice;
  photoRetention: PhotoRetentionChoice;
  toggleNotification: (key: keyof PreferencesState['notifications']) => void;
  toggleAccessibility: (key: keyof PreferencesState['accessibility']) => void;
  toggleMic: () => void;
  setVoiceRetention: (v: RetentionChoice) => void;
  setPhotoRetention: (v: PhotoRetentionChoice) => void;
};

export const usePreferencesService = create<PreferencesState>()(
  persist(
    (set, get) => ({
      notifications: { agenda: true, contas: true, agua: false, resumo: false },
      accessibility: { motion: false, contraste: false },
      micAllowed: true,
      voiceRetention: '30 dias',
      photoRetention: 'Apagar após revisar',
      toggleNotification: (key) =>
        set({ notifications: { ...get().notifications, [key]: !get().notifications[key] } }),
      toggleAccessibility: (key) =>
        set({ accessibility: { ...get().accessibility, [key]: !get().accessibility[key] } }),
      toggleMic: () => set({ micAllowed: !get().micAllowed }),
      setVoiceRetention: (v) => set({ voiceRetention: v }),
      setPhotoRetention: (v) => set({ photoRetention: v }),
    }),
    persistLocal('preferences'),
  ),
);
