import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useFinanceService } from '@/services/financeService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';
import type { Transaction } from '@/types';
import { formatCentsToBRL } from '@/utils/money';

type FilterKey = 'tudo' | 'despesas' | 'receitas';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'tudo', label: 'Tudo' },
  { key: 'despesas', label: 'Despesas' },
  { key: 'receitas', label: 'Receitas' },
];

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export default function FinancasHistoricoScreen() {
  const { colors } = useTheme();
  const transactions = useFinanceService((s) => s.transactions);
  const accounts = useFinanceService((s) => s.accounts);
  const hideBalance = useFinanceService((s) => s.hideBalance);
  const [filtro, setFiltro] = useState<FilterKey>('tudo');

  const monthBalance = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amountCents : -t.amountCents), 0);

  const grouped = useMemo(() => {
    const filtered = transactions
      .filter((t) => filtro === 'tudo' || (filtro === 'despesas' ? t.type === 'expense' : t.type === 'income'))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    const groups = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const key = dayLabel(tx.occurredAt);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(tx);
    }
    return Array.from(groups.entries());
  }, [transactions, filtro]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 18 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}>
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Finanças</Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Transações</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize, fontVariant: ['tabular-nums'] }}>
            {transactions.length} lançamentos · saldo do mês{' '}
            {hideBalance ? '••••' : `${monthBalance >= 0 ? '+' : '−'}${formatCentsToBRL(Math.abs(monthBalance))}`}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {FILTERS.map((f) => {
            const on = f.key === filtro;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFiltro(f.key)}
                style={{
                  minHeight: 40,
                  paddingHorizontal: 14,
                  borderRadius: radii.pill,
                  justifyContent: 'center',
                  backgroundColor: on ? colors.ink : 'transparent',
                  borderWidth: 1,
                  borderColor: on ? colors.ink : colors.control,
                }}
              >
                <Text style={{ color: on ? colors.bg : colors.ink, fontSize: 14, fontFamily: 'Geist_500Medium' }}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {grouped.map(([day, items]) => (
          <View key={day}>
            <Text style={{ color: colors.muted, fontSize: 14, fontFamily: 'Geist_600SemiBold', marginBottom: 2 }}>{day}</Text>
            {items.map((tx) => (
              <Pressable
                key={tx.id}
                onPress={() => (tx.purchaseRecordId ? router.push(`/financas/${tx.id}`) : undefined)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }} numberOfLines={1}>
                      {tx.note || tx.categoryName}
                    </Text>
                    {tx.purchaseRecordId ? <Icon name="link" size={16} color={colors.muted} /> : null}
                  </View>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
                    {tx.categoryName} · {accounts.find((a) => a.id === tx.accountId)?.name}
                  </Text>
                </View>
                <Text
                  style={{
                    color: tx.type === 'income' ? colors.signal : colors.ink,
                    fontSize: 16,
                    fontFamily: 'Geist_500Medium',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {hideBalance ? '••••' : `${tx.type === 'expense' ? '−' : '+'}${formatCentsToBRL(tx.amountCents)}`}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
