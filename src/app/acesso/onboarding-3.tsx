import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SwitchToggle } from '@/components/SwitchToggle';
import { useOnboardingService } from '@/services/onboardingService';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme/tokens';
import { useThemePreference, type ThemePreference } from '@/theme/useThemePreference';

export default function Onboarding3Screen() {
  const { colors } = useTheme();
  const themeChoice = useThemePreference((s) => s.preference);
  const setThemeChoice = useThemePreference((s) => s.setPreference);
  const notificationsEnabled = useOnboardingService((s) => s.notificationsEnabled);
  const setNotifications = useOnboardingService((s) => s.setNotifications);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingBottom: 32 }}>
        <OnboardingHeader step={3} onSkip={() => router.push('/acesso/cadastrar')} />
        <View style={{ flex: 1, gap: 24, paddingTop: 24 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
              Do seu jeito
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
              Opcional. Tudo isso fica em Você › Aparência.
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>
              Tema
            </Text>
            <SegmentedControl
              options={
                [
                  { value: 'system', label: 'Sistema' },
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Escuro' },
                ] as { value: ThemePreference; label: string }[]
              }
              value={themeChoice}
              onChange={setThemeChoice}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              minHeight: 64,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
                Lembretes e vencimentos
              </Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
                Pedimos a permissão do sistema só quando você criar o primeiro lembrete.
              </Text>
            </View>
            <SwitchToggle value={notificationsEnabled} onChange={setNotifications} />
          </View>
        </View>
        <Button label="Começar" onPress={() => router.push('/acesso/cadastrar')} />
      </View>
    </SafeAreaView>
  );
}
