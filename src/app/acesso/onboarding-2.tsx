import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Icon, type IconName } from '@/components/Icon';
import { OnboardingHeader } from '@/components/OnboardingHeader';
import { useOnboardingService, type ModuleKey } from '@/services/onboardingService';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme/tokens';

const MODULES: { key: ModuleKey; icon: IconName; name: string; desc: string }[] = [
  { key: 'agenda', icon: 'agenda', name: 'Agenda', desc: 'Compromissos, tarefas e lembretes' },
  { key: 'financas', icon: 'financas', name: 'Finanças', desc: 'Saldo, gastos e contas a vencer' },
  { key: 'saude', icon: 'saude', name: 'Saúde e alimentação', desc: 'Refeições e água' },
  { key: 'treinos', icon: 'treinos', name: 'Treinos', desc: 'Semana e sessões' },
  { key: 'compras', icon: 'compras', name: 'Compras', desc: 'Listas e cupons fiscais' },
];

export default function Onboarding2Screen() {
  const { colors } = useTheme();
  const modules = useOnboardingService((s) => s.modules);
  const toggleModule = useOnboardingService((s) => s.toggleModule);

  const selectedCount = Object.values(modules).filter(Boolean).length;
  const canAdvance = selectedCount > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingBottom: 32 }}>
        <OnboardingHeader step={2} onSkip={() => router.push('/acesso/onboarding-3')} />
        <View style={{ flex: 1, gap: 20, paddingTop: 24 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
              O que você quer organizar?
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
              Escolha uma ou mais áreas. Dá para mudar depois.
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            {MODULES.map((m) => {
              const on = modules[m.key];
              return (
                <Pressable
                  key={m.key}
                  onPress={() => toggleModule(m.key)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    minHeight: 68,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    backgroundColor: colors.surface,
                    borderWidth: on ? 1.5 : 1,
                    borderColor: on ? colors.ink : colors.line,
                  }}
                >
                  <Icon name={m.icon} color={colors.ink} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_600SemiBold' }}>
                      {m.name}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{m.desc}</Text>
                  </View>
                  <Checkbox checked={on} onChange={() => toggleModule(m.key)} />
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          {!canAdvance ? (
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>
              Escolha ao menos uma área.
            </Text>
          ) : null}
          <Button
            label={`Continuar com ${selectedCount} ${selectedCount === 1 ? 'área' : 'áreas'}`}
            disabled={!canAdvance}
            onPress={() => router.push('/acesso/onboarding-3')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
