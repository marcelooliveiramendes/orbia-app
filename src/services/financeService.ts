import { create } from 'zustand';

import { seedAccounts, seedTransactions } from '@/mocks/seed';
import type { Account, Transaction } from '@/types';
import { persist, persistLocal } from './persist';

type FinanceState = {
  accounts: Account[];
  transactions: Transaction[];
  hideBalance: boolean;
  toggleHideBalance: () => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  removeTransaction: (id: string) => void;
};

export const useFinanceService = create<FinanceState>()(
  persist(
    (set, get) => ({
      accounts: seedAccounts,
      transactions: seedTransactions,
      hideBalance: false,
      toggleHideBalance: () => set({ hideBalance: !get().hideBalance }),
      addTransaction: (tx) => {
        const created: Transaction = { ...tx, id: `tx-${Date.now()}` };
        set({ transactions: [created, ...get().transactions] });
        return created;
      },
      removeTransaction: (id) => set({ transactions: get().transactions.filter((t) => t.id !== id) }),
    }),
    persistLocal('finance'),
  ),
);

export function getTotalBalanceCents(accounts: Account[]) {
  return accounts.reduce((sum, acc) => sum + acc.balanceCents, 0);
}

export function getMonthSummary(transactions: Transaction[]) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    const d = new Date(tx.occurredAt);
    if (d.getMonth() !== month || d.getFullYear() !== year) continue;
    if (tx.type === 'income') income += tx.amountCents;
    else expense += tx.amountCents;
  }
  return { income, expense };
}
