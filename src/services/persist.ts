import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

// Camada local atrás da qual os stores vivem — mesma forma que os services
// vão ter quando ligarem no Supabase (docs/HANDOFF.md). Por ora, AsyncStorage.
export function persistLocal<T extends object>(name: string): Pick<PersistOptions<T>, 'name' | 'storage'> {
  return {
    name: `orbia.${name}`,
    storage: createJSONStorage(() => AsyncStorage),
  };
}

export { persist };
