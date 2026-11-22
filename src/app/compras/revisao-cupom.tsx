import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/Icon';
import {
  CUPOM_DISCOUNT,
  CUPOM_MERCHANT,
  CUPOM_TOTAL,
  useComprasScanService,
} from '@/services/comprasScanService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function brl(n: number) {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function RevisaoCupomScreen() {
  const { colors } = useTheme();
  const cupom = useComprasScanService((s) => s.cupom);
  const setCupomEdit = useComprasScanService((s) => s.setCupomEdit);
  const conferCupomLine = useComprasScanService((s) => s.conferCupomLine);

  const linhasCalc = cupom.map((l) => {
    const edited = l.edited != null && l.edited !== '' && l.id === 'c5' ? parseFloat(l.edited.replace(',', '.')) : NaN;
    const unitEffective = !Number.isNaN(edited) ? edited : l.unitPrice;
    const total = round2(l.qty * unitEffective);
    return { ...l, unitEffective, total };
  });

  const subtotal = round2(linhasCalc.reduce((sum, l) => sum + l.total, 0));
  const somaLiquida = round2(subtotal - CUPOM_DISCOUNT);
  const confere = Math.abs(somaLiquida - CUPOM_TOTAL) < 0.005;
  const pendentesConf = cupom.filter((l) => l.uncertain && !l.conferred).length;
  const podeContinuar = pendentesConf === 0 && confere;

  const motivo = pendentesConf
    ? pendentesConf === 1
      ? 'Confira 1 campo marcado para continuar.'
      : `Confira ${pendentesConf} campos marcados para continuar.`
    : confere
      ? ''
      : 'Ajuste os valores até a soma bater com o total.';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 44, paddingBottom: 8, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'cupom' } })} accessibilityLabel="Voltar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" color={colors.ink} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Revisar compra</Text>
        <Pressable onPress={() => router.replace('/compras')} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>{CUPOM_MERCHANT}</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize, fontVariant: ['tabular-nums'] }}>
            Qui., 12/11/2026 · 13:52 · lido do cupom impresso
          </Text>
        </View>

        <View>
          {linhasCalc.map((l) => {
            const incerto = !!l.uncertain && !l.conferred;
            return (
              <View
                key={l.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 12,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.line,
                  borderRadius: 12,
                  backgroundColor: incerto ? colors.warnBg : 'transparent',
                  paddingHorizontal: incerto ? 10 : 0,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>{l.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                    {l.kg ? `${l.qty.toFixed(3).replace('.', ',')} kg × ` : `${l.qty} × `}
                    {brl(l.unitEffective)}
                  </Text>
                  {incerto ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      <Text style={{ color: colors.warnInk, fontSize: 12, fontFamily: 'Geist_600SemiBold' }}>{l.uncertain}</Text>
                      <Pressable
                        onPress={() => conferCupomLine(l.id)}
                        style={{ height: 36, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ color: colors.ink, fontSize: 13, fontFamily: 'Geist_500Medium' }}>Confere</Text>
                      </Pressable>
                      {l.id === 'c5' ? (
                        <TextInput
                          value={l.edited ?? l.unitPrice.toFixed(2).replace('.', ',')}
                          onChangeText={(v) => setCupomEdit(l.id, v)}
                          keyboardType="decimal-pad"
                          style={{ height: 36, minWidth: 80, borderRadius: 10, backgroundColor: colors.surface, color: colors.ink, fontVariant: ['tabular-nums'], textAlign: 'right', paddingHorizontal: 8 }}
                        />
                      ) : null}
                    </View>
                  ) : null}
                </View>
                <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{brl(l.total)}</Text>
              </View>
            );
          })}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 40, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Subtotal</Text>
            <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{brl(subtotal)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 40, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Desconto · leve 6 leites</Text>
            <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>−{brl(CUPOM_DISCOUNT)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14 }}>
            <Text style={{ color: colors.ink, fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>Total do cupom</Text>
            <Text style={{ color: colors.ink, fontSize: 28, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>{brl(CUPOM_TOTAL)}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'flex-start',
            borderRadius: 14,
            padding: 14,
            backgroundColor: confere ? '#EEF6D8' : colors.warnBg,
          }}
        >
          <Icon name={confere ? 'check' : 'alert'} size={20} color={confere ? '#3D5200' : colors.warnInk} />
          <Text style={{ color: confere ? '#3D5200' : colors.warnInk, fontSize: 14, flex: 1 }}>
            {confere
              ? 'A soma dos itens menos o desconto confere com o total do cupom.'
              : `A soma dos itens (${brl(somaLiquida)}) não bate com o total do cupom (${brl(CUPOM_TOTAL)}). Confira os valores marcados.`}
          </Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 32, gap: 8, borderTopWidth: 1, borderTopColor: colors.line }}>
        {motivo ? <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>{motivo}</Text> : null}
        <Pressable
          onPress={() => podeContinuar && router.push('/compras/confirmar')}
          disabled={!podeContinuar}
          style={{
            height: 52,
            minHeight: minTouchTarget,
            borderRadius: radii.pill,
            backgroundColor: podeContinuar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeContinuar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}
