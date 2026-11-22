import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

export default function EscanearSheet() {
  const { colors } = useTheme();
  const { listId } = useLocalSearchParams<{ listId?: string }>();

  function goCamera(type: 'manuscrita' | 'cupom') {
    router.replace({ pathname: '/compras/camera', params: { type, listId: listId ?? '' } });
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(9,9,11,0.34)', justifyContent: 'flex-end' }}>
      <Pressable style={{ flex: 1 }} onPress={() => router.back()} />
      <View
        style={{
          backgroundColor: colors.surface,
          borderTopLeftRadius: radii.sheet,
          borderTopRightRadius: radii.sheet,
          paddingHorizontal: spacing.screenMargin,
          paddingTop: 8,
          paddingBottom: 32,
          gap: 16,
        }}
      >
        <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 999, backgroundColor: colors.control }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>Escanear</Text>
          <Pressable onPress={() => router.back()} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -12 }}>
            <Icon name="close" color={colors.ink} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => goCamera('manuscrita')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 84, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, backgroundColor: colors.surface, padding: 16 }}
        >
          <Icon name="listpen" size={28} color={colors.ink} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.ink, fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>Lista escrita à mão</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Vira itens na lista. Você revisa cada um antes.</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => goCamera('cupom')}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 84, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, backgroundColor: colors.surface, padding: 16 }}
        >
          <Icon name="receipt" size={28} color={colors.ink} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.ink, fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>Cupom fiscal</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
              Lê o QR da NFC-e ou o texto do cupom. A despesa só é registrada depois da sua confirmação.
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}
