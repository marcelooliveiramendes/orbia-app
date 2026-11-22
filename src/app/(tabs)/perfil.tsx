import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { demoUser } from '@/mocks/seed';
import { Icon, type IconName } from '@/components/Icon';
import { SwitchToggle } from '@/components/SwitchToggle';
import { useOnboardingService, type ModuleKey } from '@/services/onboardingService';
import { useTheme } from '@/theme/ThemeProvider';
import { useThemePreference } from '@/theme/useThemePreference';
import { radii, spacing, typography } from '@/theme/tokens';

const MODULES: { key: ModuleKey; icon: IconName; name: string }[] = [
  { key: 'agenda', icon: 'agenda', name: 'Agenda' },
  { key: 'financas', icon: 'financas', name: 'Finanças' },
  { key: 'saude', icon: 'saude', name: 'Saúde e alimentação' },
  { key: 'treinos', icon: 'treinos', name: 'Treinos' },
  { key: 'compras', icon: 'compras', name: 'Compras' },
];

const THEME_LABEL = { system: 'Sistema', light: 'Claro', dark: 'Escuro' };

export default function PerfilScreen() {
  const { colors } = useTheme();
  const modules = useOnboardingService((s) => s.modules);
  const toggleModule = useOnboardingService((s) => s.toggleModule);
  const reset = useOnboardingService((s) => s.reset);
  const themePreference = useThemePreference((s) => s.preference);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 56, paddingBottom: 124, gap: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              backgroundColor: colors.tile,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>
              {demoUser.initials}
            </Text>
          </View>
          <View style={{ gap: 2, flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 24, fontFamily: 'Geist_600SemiBold' }}>
              {demoUser.displayName}
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>lia@exemplo.com.br</Text>
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: 4,
                backgroundColor: colors.tile,
                borderRadius: radii.pill,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: 12, fontFamily: 'Geist_500Medium' }}>
                Conta de demonstração
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Módulos ativos
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, marginBottom: 6 }}>
            Desligar esconde a área do Início e do Criar rápido. Nada é apagado.
          </Text>
          {MODULES.map((m) => (
            <View
              key={m.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                minHeight: 56,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
              }}
            >
              <Icon name={m.icon} size={22} color={colors.muted} />
              <Text style={{ flex: 1, color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
                {m.name}
              </Text>
              <SwitchToggle value={modules[m.key]} onChange={() => toggleModule(m.key)} />
            </View>
          ))}
        </View>

        <View>
          {[
            { icon: 'sun' as IconName, label: 'Aparência e notificações', value: THEME_LABEL[themePreference], onPress: () => router.push('/conta/aparencia') },
            { icon: 'shield' as IconName, label: 'Privacidade e dados', value: '', onPress: () => router.push('/conta/privacidade') },
            { icon: 'info' as IconName, label: 'Sobre a Orbia', value: 'Protótipo', onPress: () => {} },
          ].map((item, i, arr) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                minHeight: 60,
                borderBottomWidth: i === arr.length - 1 ? 0 : 1,
                borderBottomColor: colors.line,
              }}
            >
              <Icon name={item.icon} size={22} color={colors.muted} />
              <Text style={{ flex: 1, color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
                {item.label}
              </Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{item.value}</Text>
              <Icon name="chevron" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={reset} style={{ alignSelf: 'flex-start', minHeight: 48, justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
