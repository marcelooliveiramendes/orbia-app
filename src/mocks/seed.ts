// Dados de demonstração — ver docs/HANDOFF.md "Dados de demonstração".
// Identificados como mock; substituir por dados reais na fase Supabase.
import type {
  Account,
  ActivityEntry,
  AgendaItem,
  FoodEntry,
  PurchaseRecord,
  ShoppingList,
  Transaction,
  WaterEntry,
  WorkoutSession,
} from '@/types';

export const demoUser = {
  displayName: 'Lia Andrade',
  initials: 'LA',
};

export const seedAccounts: Account[] = [
  { id: 'acc-nubank', name: 'Nubank', balanceCents: 348_290 },
  { id: 'acc-itau', name: 'Itaú', balanceCents: 121_540 },
  { id: 'acc-dinheiro', name: 'Dinheiro', balanceCents: 8_600 },
];

export const seedTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    amountCents: 18_746,
    categoryName: 'Mercado',
    accountId: 'acc-nubank',
    occurredAt: daysAgoISO(0),
    note: 'Mercado Pão de Mel',
    purchaseRecordId: 'purchase-pao-de-mel',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amountCents: 4_800,
    categoryName: 'Alimentação',
    accountId: 'acc-nubank',
    occurredAt: daysAgoISO(1),
    note: 'Almoço',
  },
  {
    id: 'tx-3',
    type: 'income',
    amountCents: 250_000,
    categoryName: 'Freelance',
    accountId: 'acc-itau',
    occurredAt: daysAgoISO(3),
  },
  {
    id: 'tx-4',
    type: 'expense',
    amountCents: 12_990,
    categoryName: 'Transporte',
    accountId: 'acc-dinheiro',
    occurredAt: daysAgoISO(5),
  },
];

export const seedShoppingLists: ShoppingList[] = [
  {
    id: 'list-mercado-semana',
    title: 'Mercado da semana',
    createdAt: daysAgoISO(0),
    items: [
      { id: 'i1', name: 'Leite', quantity: 2, unit: 'L', category: 'Mercado' },
      { id: 'i2', name: 'Arroz', quantity: 1, unit: 'kg', category: 'Mercado' },
      { id: 'i3', name: 'Banana', quantity: 6, unit: 'un', category: 'Hortifruti' },
      { id: 'i4', name: 'Café', quantity: 1, unit: 'pct', category: 'Mercado' },
      { id: 'i5', name: 'Ovos', quantity: 12, unit: 'un', category: 'Mercado', checkedAt: daysAgoISO(0) },
      { id: 'i6', name: 'Detergente', quantity: 2, unit: 'un', category: 'Limpeza' },
      { id: 'i7', name: 'Papel higiênico', quantity: 1, unit: 'pct', category: 'Limpeza' },
      { id: 'i8', name: 'Tomate', quantity: 1, unit: 'kg', category: 'Hortifruti' },
      { id: 'i9', name: 'Frango', quantity: 1, unit: 'kg', category: 'Açougue' },
      { id: 'i10', name: 'Sabonete', quantity: 3, unit: 'un', category: 'Limpeza' },
      { id: 'i11', name: 'Queijo', quantity: 1, unit: 'un', category: 'Mercado' },
      { id: 'i12', name: 'Pão', quantity: 1, unit: 'un', category: 'Mercado' },
    ],
  },
  {
    id: 'list-farmacia',
    title: 'Farmácia',
    createdAt: daysAgoISO(1),
    items: [
      { id: 'f1', name: 'Protetor solar', quantity: 1, unit: 'un', category: 'Farmácia' },
      { id: 'f2', name: 'Dipirona', quantity: 1, unit: 'un', category: 'Farmácia' },
      { id: 'f3', name: 'Fio dental', quantity: 1, unit: 'un', category: 'Farmácia' },
    ],
  },
];

export const seedPurchaseRecords: PurchaseRecord[] = [
  {
    id: 'purchase-pao-de-mel',
    merchant: 'Mercado Pão de Mel',
    purchasedAt: daysAgoISO(0),
    totalCents: 18_746,
    discountCents: 444,
    transactionId: 'tx-1',
    shoppingListId: 'list-mercado-semana',
    items: [
      { id: 'pi1', name: 'Leite integral 1L', quantity: 2, unitPriceCents: 589, totalCents: 1178 },
      { id: 'pi2', name: 'Arroz 5kg', quantity: 1, unitPriceCents: 2890, totalCents: 2890 },
      { id: 'pi3', name: 'Banana prata (kg)', quantity: 1.2, unitPriceCents: 450, totalCents: 540 },
      { id: 'pi4', name: 'Café 500g', quantity: 1, unitPriceCents: 1690, totalCents: 1690 },
      { id: 'pi5', name: 'Ovos dúzia', quantity: 1, unitPriceCents: 1290, totalCents: 1290 },
      { id: 'pi6', name: 'Detergente', quantity: 2, unitPriceCents: 299, totalCents: 598, uncertain: true },
      { id: 'pi7', name: 'Papel higiênico 12un', quantity: 1, unitPriceCents: 2990, totalCents: 2990 },
      { id: 'pi8', name: 'Frango resfriado (kg)', quantity: 1.6, unitPriceCents: 1390, totalCents: 2224 },
    ],
  },
];

export const seedAgendaItems: AgendaItem[] = [
  {
    id: 'ag-1',
    kind: 'compromisso',
    title: 'Reunião de planejamento',
    startsAt: todayAtISO(9, 0),
    reminderLabel: 'Sem lembrete',
    repeatLabel: 'Não repete',
    createdAt: daysAgoISO(2),
    done: true,
  },
  {
    id: 'ag-2',
    kind: 'compromisso',
    title: 'Almoço com Camila',
    startsAt: todayAtISO(12, 30),
    reminderLabel: 'Sem lembrete',
    repeatLabel: 'Não repete',
    createdAt: daysAgoISO(2),
    done: true,
  },
  {
    id: 'ag-3',
    kind: 'tarefa',
    title: 'Enviar relatório mensal',
    startsAt: todayAtISO(15, 0),
    reminderLabel: '15 min antes',
    repeatLabel: 'Não repete',
    note: 'Planilha de outubro e resumo de 1 página',
    createdAt: daysAgoISO(2),
    done: false,
  },
  {
    id: 'ag-4',
    kind: 'compromisso',
    title: 'Treino de pernas',
    startsAt: todayAtISO(19, 0),
    reminderLabel: 'Sem lembrete',
    repeatLabel: 'Não repete',
    createdAt: daysAgoISO(2),
    done: false,
  },
  {
    id: 'ag-5',
    kind: 'tarefa',
    title: 'Ligar para a mãe',
    startsAt: todayAtISO(20, 30),
    reminderLabel: 'Sem lembrete',
    repeatLabel: 'Não repete',
    createdAt: daysAgoISO(2),
    done: false,
  },
  {
    id: 'ag-6',
    kind: 'tarefa',
    title: 'Dentista',
    startsAt: inDaysISO(1, 14, 0),
    reminderLabel: '1 h antes',
    repeatLabel: 'Não repete',
    createdAt: daysAgoISO(2),
    done: false,
  },
];

export const seedFoodEntries: FoodEntry[] = [
  { id: 'fd-1', mealType: 'Café da manhã', description: 'Pão integral, 2 ovos e café', occurredAt: todayAtISO(7, 40) },
  { id: 'fd-2', mealType: 'Almoço', description: 'Arroz, feijão, frango grelhado e salada', occurredAt: todayAtISO(12, 35) },
];

export const seedWaterEntries: WaterEntry[] = [
  { id: 'wt-hist-1', amountMl: 1750, occurredAt: daysAgoISO(6) },
  { id: 'wt-hist-2', amountMl: 2000, occurredAt: daysAgoISO(5) },
  { id: 'wt-hist-3', amountMl: 1250, occurredAt: daysAgoISO(4) },
  { id: 'wt-hist-4', amountMl: 2250, occurredAt: daysAgoISO(3) },
  { id: 'wt-hist-5', amountMl: 1500, occurredAt: daysAgoISO(2) },
  { id: 'wt-hist-6', amountMl: 2000, occurredAt: daysAgoISO(1) },
  { id: 'wt-1', amountMl: 750, occurredAt: hoursAgoISO(6) },
  { id: 'wt-2', amountMl: 500, occurredAt: hoursAgoISO(1) },
];

export const seedWorkoutSessions: WorkoutSession[] = [
  {
    id: 'wk-fullbody',
    title: 'Full body',
    scheduledFor: daysAgoISO(3),
    exercises: [],
    completedAt: daysAgoISO(3),
  },
  {
    id: 'wk-corrida',
    title: 'Corrida 5 km',
    scheduledFor: daysAgoISO(1),
    exercises: [],
    completedAt: daysAgoISO(1),
  },
  {
    id: 'wk-pernas',
    title: 'Pernas',
    scheduledFor: todayAtISO(19, 0),
    exercises: [
      { id: 'ex1', name: 'Agachamento livre', sets: 4, reps: 10, loadKg: 40, completedSetIndexes: [] },
      { id: 'ex2', name: 'Leg press', sets: 4, reps: 12, loadKg: 120, completedSetIndexes: [] },
      { id: 'ex3', name: 'Cadeira extensora', sets: 3, reps: 12, loadKg: 35, completedSetIndexes: [] },
      { id: 'ex4', name: 'Stiff', sets: 3, reps: 10, loadKg: 30, completedSetIndexes: [] },
      { id: 'ex5', name: 'Panturrilha em pé', sets: 4, reps: 15, completedSetIndexes: [] },
    ],
  },
  {
    id: 'wk-superior',
    title: 'Superior',
    scheduledFor: inDaysISO(2, 10, 0),
    exercises: [
      { id: 'ex6', name: 'Supino reto', sets: 4, reps: 10, loadKg: 40, completedSetIndexes: [] },
      { id: 'ex7', name: 'Puxada frontal', sets: 4, reps: 12, loadKg: 55, completedSetIndexes: [] },
      { id: 'ex8', name: 'Desenvolvimento', sets: 3, reps: 12, loadKg: 20, completedSetIndexes: [] },
    ],
  },
];

export const seedActivity: ActivityEntry[] = [
  { id: 'act-1', area: 'compras', title: 'Compra registrada', description: 'Mercado Pão de Mel · R$ 187,46', occurredAt: daysAgoISO(0) },
  { id: 'act-2', area: 'saude', title: 'Refeição registrada', description: 'Almoço · frango com salada', occurredAt: hoursAgoISO(2) },
  { id: 'act-3', area: 'financas', title: 'Receita registrada', description: 'Freelance · R$ 2.500,00', occurredAt: daysAgoISO(3) },
  { id: 'act-4', area: 'agenda', title: 'Compromisso criado', description: 'Dentista · sexta às 14h', occurredAt: daysAgoISO(1) },
  { id: 'act-5', area: 'treinos', title: 'Treino concluído', description: 'Treino de pernas · 18 séries', occurredAt: daysAgoISO(2) },
];

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function hoursAgoISO(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function inDaysISO(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function todayAtISO(hour: number, minute: number): string {
  return inDaysISO(0, hour, minute);
}
