import { create } from 'zustand';

import { seedFoodEntries, seedWaterEntries } from '@/mocks/seed';
import type { FoodEntry, MealType, WaterEntry } from '@/types';
import { persist, persistLocal } from './persist';

const DAILY_WATER_GOAL_ML = 2000;
export const MEAL_TYPES: MealType[] = ['Café da manhã', 'Almoço', 'Lanche', 'Jantar'];

type HealthState = {
  foodEntries: FoodEntry[];
  waterEntries: WaterEntry[];
  addFood: (mealType: MealType, description: string, occurredAt?: string) => void;
  addWater: (amountMl: number) => void;
};

export const useHealthService = create<HealthState>()(
  persist(
    (set, get) => ({
      foodEntries: seedFoodEntries,
      waterEntries: seedWaterEntries,
      addFood: (mealType, description, occurredAt) => {
        const created: FoodEntry = {
          id: `fd-${Date.now()}`,
          mealType,
          description,
          occurredAt: occurredAt ?? new Date().toISOString(),
        };
        set({ foodEntries: [created, ...get().foodEntries.filter((f) => !isToday(f.occurredAt) || f.mealType !== mealType)] });
      },
      addWater: (amountMl) => {
        const created: WaterEntry = { id: `wt-${Date.now()}`, amountMl, occurredAt: new Date().toISOString() };
        set({ waterEntries: [created, ...get().waterEntries] });
      },
    }),
    persistLocal('health'),
  ),
);

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function getTodayWaterMl(entries: WaterEntry[]) {
  return entries.filter((e) => isToday(e.occurredAt)).reduce((sum, e) => sum + e.amountMl, 0);
}

export function getTodayMealByType(entries: FoodEntry[], mealType: MealType): FoodEntry | undefined {
  return entries.find((f) => f.mealType === mealType && isToday(f.occurredAt));
}

export { DAILY_WATER_GOAL_ML };
