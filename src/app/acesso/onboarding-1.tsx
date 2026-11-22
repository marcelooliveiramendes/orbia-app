import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, spacing, typography } from '@/theme/tokens';

export default function Onboarding1Screen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingBottom: 32 }}>
        <OnboardingHeader step={1} onSkip={() => router.push('/acesso/cadastrar')} />
        <View style={{ flex: 1, justifyContent: 'center', gap: 28 }}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <Circle cx={100} cy={100} r={92} fill="none" stroke={colors.control} strokeWidth={1} />
            <Circle cx={100} cy={100} r={58} fill="none" stroke={colors.ink} strokeWidth={1.5} />
            <Circle cx={100} cy={100} r={22} fill="none" stroke={colors.control} strokeWidth={1} />
            <Circle cx={181} cy={56} r={6} fill={lime} stroke={colors.bg} strokeWidth={1.5} />
            <Circle cx={49} cy={126} r={6} fill={lime} stroke={colors.bg} strokeWidth={1.5} />
            <Circle cx={114} cy={117} r={5} fill={lime} stroke={colors.bg} strokeWidth={1.5} />
          </Svg>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                color: colors.ink,
                fontSize: 32,
                lineHeight: 38,
                fontFamily: 'Geist_600SemiBold',
              }}
            >
              Tudo o que importa, organizado do seu jeito.
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.section.fontSize, lineHeight: 26 }}>
              Agenda, finanças, saúde, treinos e compras num só lugar. Comece simples; aprofunde quando
              precisar.
            </Text>
          </View>
        </View>
        <Button label="Continuar" onPress={() => router.push('/acesso/onboarding-2')} />
      </View>
    </SafeAreaView>
  );
}
