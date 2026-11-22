import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { getTotalBalanceCents, useFinanceService } from '@/services/financeService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

export default function FinancasIndexScreen() {
  const { colors } = useTheme();
  const accounts = useFinanceService((s) => s.accounts);
  const transactions = useFinanceService((s) => s.transactions);
  const hideBalance = useFinanceService((s) => s.hideBalance);
  const toggleHideBalance = useFinanceService((s) => s.toggleHideBalance);

  const now = new Date();
  const monthTx = transactions.filter((t) => {
    const d = new Date(t.occurredAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const receitas = monthTx.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amountCents, 0);
  const despesas = monthTx.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amountCents, 0);
  const nubank = accounts.find((a) => a.id === 'acc-nubank');
  const itau = accounts.find((a) => a.id === 'acc-itau');
  const dinheiro = accounts.find((a) => a.id === 'acc-dinheiro');

  const mask = (txt: string) => (hideBalance ? 'R$ ••••' : txt);
  const ultimas = [...transactions].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4 }}>
            <Icon name="back" color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Áreas</Text>
          </Pressable>
          <Pressable
            onPress={toggleHideBalance}
            accessibilityLabel={hideBalance ? 'Mostrar valores' : 'Ocultar valores'}
            accessibilityState={{ selected: hideBalance }}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={hideBalance ? 'eyeoff' : 'eye'} color={colors.ink} />
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Finanças</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Saldo em {accounts.length} contas</Text>
          <Text style={{ color: colors.ink, fontSize: 36, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
            {hideBalance ? 'R$ •••••' : formatCentsToBRL(getTotalBalanceCents(accounts))}
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
            Nubank {mask(nubank ? formatCentsToBRL(nubank.balanceCents) : '')} · Itaú{' '}
            {mask(itau ? formatCentsToBRL(itau.balanceCents) : '')} · Dinheiro{' '}
            {mask(dinheiro ? formatCentsToBRL(dinheiro.balanceCents) : '')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: radii.card,
          }}
        >
          <View style={{ flex: 1, padding: 16, gap: 2, borderRightWidth: 1, borderRightColor: colors.line }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Receitas no mês</Text>
            <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
              {mask(formatCentsToBRL(receitas))}
            </Text>
          </View>
          <View style={{ flex: 1, padding: 16, gap: 2 }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Despesas no mês</Text>
            <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
              {mask(formatCentsToBRL(despesas))}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => router.push('/financas/nova?tipo=despesa')}
            style={{ flex: 1, height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="expense" size={20} color="#09090B" />
            <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Despesa</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/financas/nova?tipo=receita')}
            style={{ flex: 1, height: 52, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="income" size={20} color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Receita</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 16, backgroundColor: colors.tile }}>
          <Icon name="clock" size={22} color={colors.ink} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_600SemiBold' }}>Próximo vencimento</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Conta de luz · vence seg., 16/11</Text>
          </View>
          <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
            {mask('R$ 164,82')}
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
              Últimas transações
            </Text>
            <Pressable onPress={() => router.push('/financas/historico')} hitSlop={8}>
              <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>Ver todas</Text>
            </Pressable>
          </View>
          {ultimas.map((tx) => (
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
      </ScrollView>
    </View>
  );
}
