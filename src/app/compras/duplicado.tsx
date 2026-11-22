import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

export default function DuplicadoScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 44, gap: 16 }}>
        <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.warnBg, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="info" size={28} color={colors.warnInk} />
        </View>
        <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
          Este cupom já foi registrado
        </Text>
        <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
          Não vamos criar outra despesa. Encontramos o mesmo documento da NFC-e nas suas finanças:
        </Text>
        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16, gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>Mercado Pão de Mel</Text>
          <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>R$ 187,46 · Nubank</Text>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
            Compra de 12/11/2026, 13:52 · registrada hoje às 14:02
          </Text>
        </View>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
          Se for outra compra com o mesmo valor, confira a data e o número do cupom antes de escanear de novo.
        </Text>
      </View>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, gap: 8 }}>
        <Pressable
          onPress={() => router.replace('/financas/tx-1')}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Ver despesa existente</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/compras')} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Voltar às compras</Text>
        </Pressable>
      </View>
    </View>
  );
}
