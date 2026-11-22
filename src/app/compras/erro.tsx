import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

const DICAS = ['Apoie o cupom numa superfície plana', 'Evite a luz direta sobre o papel', 'Enquadre de ponta a ponta'];

export default function ErroOcrScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 44, gap: 16 }}>
        <View style={{ height: 180, borderRadius: radii.card, backgroundColor: '#2A2521', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <View style={{ width: 150, height: 220, backgroundColor: '#FBFBF8', opacity: 0.85, transform: [{ rotate: '6deg' }] }} />
        </View>
        <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Não conseguimos ler tudo</Text>
        <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
          Lemos 2 de cerca de 8 linhas. A foto ficou desfocada e com reflexo na parte de baixo.
        </Text>
        <View style={{ gap: 6 }}>
          {DICAS.map((d) => (
            <Text key={d} style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
              • {d}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, gap: 8 }}>
        <Pressable
          onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'cupom' } })}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Tentar novamente</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/compras/confirmar')} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Digitar manualmente</Text>
        </Pressable>
      </View>
    </View>
  );
}
