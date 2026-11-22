import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import { useFinanceService } from '@/services/financeService';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

export default function FinancasDetalheScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transactions = useFinanceService((s) => s.transactions);
  const accounts = useFinanceService((s) => s.accounts);
  const removeTransaction = useFinanceService((s) => s.removeTransaction);
  const purchaseRecords = useShoppingService((s) => s.purchaseRecords);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const tx = transactions.find((t) => t.id === id);
  const purchase = tx?.purchaseRecordId ? purchaseRecords.find((p) => p.id === tx.purchaseRecordId) : undefined;
  const account = tx ? accounts.find((a) => a.id === tx.accountId) : undefined;

  if (!tx) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Transação não encontrada.</Text>
      </View>
    );
  }

  const campos = [
    { k: 'Data', v: new Date(tx.occurredAt).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { k: 'Conta', v: account?.name ?? '—' },
    { k: 'Categoria', v: tx.categoryName },
    { k: 'Origem', v: purchase ? 'Cupom escaneado e revisado por você' : tx.note || 'Lançamento manual' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 24, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4 }}>
            <Icon name="back" color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Transações</Text>
          </Pressable>
        </View>

        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
            {tx.type === 'expense' ? 'Despesa' : 'Receita'} · {tx.categoryName}
          </Text>
          <Text
            style={{
              color: tx.type === 'income' ? colors.signal : colors.ink,
              fontSize: 36,
              fontFamily: 'Geist_600SemiBold',
              fontVariant: ['tabular-nums'],
            }}
          >
            {tx.type === 'expense' ? '−' : '+'}
            {formatCentsToBRL(tx.amountCents)}
          </Text>
          <Text style={{ color: colors.ink, fontSize: 20, fontFamily: 'Geist_600SemiBold' }}>
            {tx.note || purchase?.merchant || tx.categoryName}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, paddingHorizontal: 16 }}>
          {campos.map((c, i) => (
            <View
              key={c.k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16,
                alignItems: 'center',
                minHeight: 48,
                borderBottomWidth: i === campos.length - 1 ? 0 : 1,
                borderBottomColor: colors.line,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{c.k}</Text>
              <Text style={{ color: colors.ink, fontSize: 15, textAlign: 'right', fontVariant: ['tabular-nums'] }}>{c.v}</Text>
            </View>
          ))}
        </View>

        {purchase ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Icon name="link" size={18} color={colors.muted} />
              <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
                Compra vinculada · {purchase.items.length} itens
              </Text>
            </View>
            {purchase.items.map((item) => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, borderBottomWidth: 1, borderBottomColor: colors.line }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.ink, fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                    {item.quantity} × {formatCentsToBRL(item.unitPriceCents)}
                  </Text>
                </View>
                <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{formatCentsToBRL(item.totalCents)}</Text>
              </View>
            ))}
            {purchase.discountCents ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 44, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line }}>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Desconto</Text>
                <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>−{formatCentsToBRL(purchase.discountCents)}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 48, alignItems: 'center' }}>
              <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Total</Text>
              <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
                {formatCentsToBRL(purchase.totalCents)}
              </Text>
            </View>
          </View>
        ) : null}

        {purchase?.shoppingListId ? (
          <Button
            label="Ver lista relacionada"
            variant="secondary"
            onPress={() => router.push(`/compras/${purchase.shoppingListId}`)}
          />
        ) : null}

        <Pressable
          onPress={() => setConfirmingDelete(true)}
          style={{ height: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
        >
          <Icon name="trash" size={20} color={colors.negative} />
          <Text style={{ color: colors.negative, fontSize: 16, fontFamily: 'Geist_500Medium' }}>
            Excluir {tx.type === 'expense' ? 'despesa' : 'receita'}
          </Text>
        </Pressable>
      </ScrollView>

      <ConfirmDialog
        visible={confirmingDelete}
        title={`Excluir a ${tx.type === 'expense' ? 'despesa' : 'receita'} de ${formatCentsToBRL(tx.amountCents)}?`}
        description={
          purchase
            ? `O saldo do ${account?.name} volta a considerar esse valor. Os itens da compra continuam em Compras, sem vínculo.`
            : 'Essa ação não pode ser desfeita.'
        }
        confirmLabel="Excluir"
        cancelLabel={purchase ? 'Manter despesa' : 'Manter'}
        destructive
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          removeTransaction(tx.id);
          setConfirmingDelete(false);
          toast.show(`${tx.type === 'expense' ? 'Despesa' : 'Receita'} excluída`);
          router.back();
        }}
      />
    </View>
  );
}
