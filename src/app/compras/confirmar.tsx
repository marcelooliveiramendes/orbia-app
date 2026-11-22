import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Checkbox } from '@/components/Checkbox';
import { ChipGroup } from '@/components/ChipGroup';
import { Icon } from '@/components/Icon';
import {
  CUPOM_DISCOUNT,
  CUPOM_MERCHANT,
  CUPOM_TOTAL,
  useComprasScanService,
} from '@/services/comprasScanService';
import { useFinanceService } from '@/services/financeService';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

const CATEGORIAS = ['Mercado', 'Alimentação', 'Casa'];

export default function ConfirmarScreen() {
  const { colors } = useTheme();
  const cupom = useComprasScanService((s) => s.cupom);
  const conta = useComprasScanService((s) => s.conta);
  const setConta = useComprasScanService((s) => s.setConta);
  const categoria = useComprasScanService((s) => s.categoria);
  const setCategoria = useComprasScanService((s) => s.setCategoria);
  const marcarComprados = useComprasScanService((s) => s.marcarComprados);
  const toggleMarcarComprados = useComprasScanService((s) => s.toggleMarcarComprados);
  const targetListId = useComprasScanService((s) => s.targetListId);
  const reset = useComprasScanService((s) => s.reset);

  const accounts = useFinanceService((s) => s.accounts);
  const addTransaction = useFinanceService((s) => s.addTransaction);
  const confirmPurchase = useShoppingService((s) => s.confirmPurchase);

  const podeRegistrar = !!conta;
  const totalCents = Math.round(CUPOM_TOTAL * 100);

  function handleRegistrar() {
    if (!podeRegistrar) return;

    const account = accounts.find((a) => a.name === conta);
    const purchaseItems = cupom.map((l) => ({
      name: l.name,
      quantity: l.qty,
      unitPriceCents: Math.round(l.unitPrice * 100),
      totalCents: Math.round(l.qty * l.unitPrice * 100),
      uncertain: !!l.uncertain,
    }));

    const record = confirmPurchase({
      merchant: CUPOM_MERCHANT,
      items: purchaseItems,
      totalCents,
      discountCents: Math.round(CUPOM_DISCOUNT * 100),
      shoppingListId: targetListId ?? undefined,
      markItemNamesAsChecked: marcarComprados ? ['arroz', 'feijão', 'café', 'detergente'] : undefined,
    });

    const tx = addTransaction({
      type: 'expense',
      amountCents: totalCents,
      categoryName: categoria,
      accountId: account?.id ?? accounts[0].id,
      occurredAt: new Date().toISOString(),
      note: CUPOM_MERCHANT,
      purchaseRecordId: record.id,
    });

    router.replace({ pathname: '/compras/sucesso', params: { txId: tx.id } });
    reset();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 44, paddingBottom: 8, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.replace('/compras/revisao-cupom')} accessibilityLabel="Voltar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" color={colors.ink} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Registrar despesa</Text>
        <Pressable onPress={() => router.replace('/compras')} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, gap: 20 }}>
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Despesa a registrar</Text>
          <Text style={{ color: colors.ink, fontSize: 36, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
            {formatCentsToBRL(totalCents)}
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>{CUPOM_MERCHANT} · 12/11/2026</Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Conta</Text>
          {accounts.map((acc) => {
            const on = conta === acc.name;
            return (
              <Pressable
                key={acc.id}
                onPress={() => setConta(acc.name)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  minHeight: 64,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  backgroundColor: colors.surface,
                  borderWidth: on ? 1.5 : 1,
                  borderColor: on ? colors.ink : colors.line,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: on ? '#C7FF3D' : 'transparent',
                    borderWidth: on ? 0 : 1.5,
                    borderColor: colors.control,
                  }}
                >
                  {on ? <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#09090B' }} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{acc.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Conta</Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: 14, fontVariant: ['tabular-nums'] }}>{formatCentsToBRL(acc.balanceCents)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Categoria</Text>
          <ChipGroup options={CATEGORIAS} value={categoria} onChange={setCategoria} />
        </View>

        <Pressable
          onPress={toggleMarcarComprados}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 16, backgroundColor: colors.tile, padding: 14 }}
        >
          <Checkbox checked={marcarComprados} onChange={toggleMarcarComprados} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Marcar 4 itens como comprados</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
              Arroz, feijão, café e detergente na lista Mercado da semana.
            </Text>
          </View>
        </Pressable>

        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
          Uma compra vira uma única despesa. Os 8 itens ficam no detalhe da compra, ligados a ela.
        </Text>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 32, gap: 8, borderTopWidth: 1, borderTopColor: colors.line }}>
        {!podeRegistrar ? (
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>
            Escolha a conta de onde saiu o pagamento.
          </Text>
        ) : null}
        <Pressable
          onPress={handleRegistrar}
          disabled={!podeRegistrar}
          style={{
            height: 52,
            minHeight: minTouchTarget,
            borderRadius: radii.pill,
            backgroundColor: podeRegistrar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeRegistrar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
            Registrar despesa
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
