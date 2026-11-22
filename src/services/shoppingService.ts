import { create } from 'zustand';

import { seedPurchaseRecords, seedShoppingLists } from '@/mocks/seed';
import type { PurchaseItem, PurchaseRecord, ShoppingItem, ShoppingList } from '@/types';
import { persist, persistLocal } from './persist';

type ShoppingState = {
  lists: ShoppingList[];
  purchaseRecords: PurchaseRecord[];
  createList: (title: string) => ShoppingList;
  addItem: (listId: string, item: Omit<ShoppingItem, 'id'>) => void;
  toggleItem: (listId: string, itemId: string) => void;
  removeItem: (listId: string, itemId: string) => void;
  archiveList: (listId: string) => void;
  confirmPurchase: (input: {
    merchant: string;
    items: Omit<PurchaseItem, 'id'>[];
    totalCents: number;
    discountCents?: number;
    shoppingListId?: string;
    markItemNamesAsChecked?: string[];
  }) => PurchaseRecord;
  isDuplicateMerchantToday: (merchant: string) => boolean;
};

export const useShoppingService = create<ShoppingState>()(
  persist(
    (set, get) => ({
      lists: seedShoppingLists,
      purchaseRecords: seedPurchaseRecords,
      createList: (title) => {
        const created: ShoppingList = {
          id: `list-${Date.now()}`,
          title,
          items: [],
          createdAt: new Date().toISOString(),
        };
        set({ lists: [created, ...get().lists] });
        return created;
      },
      addItem: (listId, item) => {
        const created: ShoppingItem = { ...item, id: `item-${Date.now()}` };
        set({
          lists: get().lists.map((l) =>
            l.id === listId ? { ...l, items: [...l.items, created] } : l,
          ),
        });
      },
      toggleItem: (listId, itemId) => {
        set({
          lists: get().lists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  items: l.items.map((i) =>
                    i.id === itemId ? { ...i, checkedAt: i.checkedAt ? undefined : new Date().toISOString() } : i,
                  ),
                },
          ),
        });
      },
      removeItem: (listId, itemId) => {
        set({
          lists: get().lists.map((l) =>
            l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l,
          ),
        });
      },
      archiveList: (listId) => {
        set({
          lists: get().lists.map((l) =>
            l.id === listId ? { ...l, archivedAt: new Date().toISOString() } : l,
          ),
        });
      },
      confirmPurchase: ({ merchant, items, totalCents, discountCents, shoppingListId, markItemNamesAsChecked }) => {
        const record: PurchaseRecord = {
          id: `purchase-${Date.now()}`,
          merchant,
          purchasedAt: new Date().toISOString(),
          totalCents,
          discountCents,
          shoppingListId,
          items: items.map((item, i) => ({ ...item, id: `pi-${Date.now()}-${i}` })),
        };
        set({ purchaseRecords: [record, ...get().purchaseRecords] });
        if (shoppingListId && markItemNamesAsChecked?.length) {
          const namesLower = markItemNamesAsChecked.map((n) => n.toLowerCase());
          set({
            lists: get().lists.map((l) =>
              l.id !== shoppingListId
                ? l
                : {
                    ...l,
                    items: l.items.map((i) =>
                      namesLower.some((n) => i.name.toLowerCase().includes(n) || n.includes(i.name.toLowerCase()))
                        ? { ...i, checkedAt: i.checkedAt ?? new Date().toISOString() }
                        : i,
                    ),
                  },
            ),
          });
        }
        return record;
      },
      isDuplicateMerchantToday: (merchant) => {
        const today = new Date().toDateString();
        return get().purchaseRecords.some(
          (p) => p.merchant === merchant && new Date(p.purchasedAt).toDateString() === today,
        );
      },
    }),
    persistLocal('shopping'),
  ),
);
