import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { CUPOM_MERCHANT, CUPOM_TOTAL } from '@/services/comprasScanService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

export default function SucessoScreen() {
  const { colors } = useTheme();
  const { txId } = useLocalSearchParams<{ txId?: string }>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 80, gap: 16 }}>
        <View style={{ width: 64, height: 64, borderRadius: 999, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={32} color="#09090B" strokeWidth={2.25} />
        </View>
        <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Despesa registrada</Text>
        <Text style={{ color: colors.ink, fontSize: 17, fontVariant: ['tabular-nums'] }}>
          R$ {CUPOM_TOTAL.toFixed(2).replace('.', ',')} · {CUPOM_MERCHANT}
        </Text>
        <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>Os 8 itens estão no detalhe da compra.</Text>
      </View>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, gap: 8 }}>
        <Pressable
          onPress={() => router.replace(txId ? `/financas/${txId}` : '/financas')}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Ver nas finanças</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/compras')} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Voltar às compras</Text>
        </Pressable>
      </View>
    </View>
  );
}
