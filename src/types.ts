// Tipos espelham o modelo de dados de docs/project.md §7, sem os campos
// de servidor (user_id, RLS, idempotência) que só existem na fase Supabase.

export type Account = {
  id: string;
  name: string;
  balanceCents: number;
};

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  type: TransactionType;
  amountCents: number;
  categoryName: string;
  accountId: string;
  occurredAt: string; // ISO 8601
  note?: string;
  purchaseRecordId?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category: string;
  checkedAt?: string;
  note?: string;
};

export type ShoppingList = {
  id: string;
  title: string;
  items: ShoppingItem[];
  archivedAt?: string;
  createdAt: string;
};

export type PurchaseItem = {
  id: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  uncertain?: boolean;
};

export type PurchaseRecord = {
  id: string;
  merchant: string;
  purchasedAt: string;
  totalCents: number;
  discountCents?: number;
  items: PurchaseItem[];
  transactionId?: string;
  shoppingListId?: string;
};

export type AgendaKind = 'tarefa' | 'compromisso';

export type AgendaItem = {
  id: string;
  kind: AgendaKind;
  title: string;
  startsAt: string; // ISO 8601
  reminderLabel: string; // 'Sem lembrete' | '15 min antes' | '1 h antes'
  repeatLabel: string; // 'Não repete' | 'Toda semana' | 'Todo mês'
  note?: string;
  createdAt: string;
  done?: boolean;
};

export type MealType = 'Café da manhã' | 'Almoço' | 'Lanche' | 'Jantar';

export type FoodEntry = {
  id: string;
  mealType: MealType;
  description: string;
  occurredAt: string; // hora do registro (data = dia do registro)
};

export type WaterEntry = {
  id: string;
  amountMl: number;
  occurredAt: string;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  loadKg?: number;
  completedSetIndexes: number[];
};

export type WorkoutSession = {
  id: string;
  title: string;
  scheduledFor: string;
  durationMin?: number;
  exercises: WorkoutExercise[];
  completedAt?: string;
  note?: string;
};

export type ActivityEntry = {
  id: string;
  area: 'agenda' | 'financas' | 'saude' | 'treinos' | 'compras';
  title: string;
  description: string;
  occurredAt: string;
};
