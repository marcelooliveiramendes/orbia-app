import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ToggleRow } from '@/components/ToggleRow';
import { usePreferencesService } from '@/services/preferencesService';
import { useTheme } from '@/theme/ThemeProvider';
import { useThemePreference, type ThemePreference } from '@/theme/useThemePreference';
import { radii, spacing, typography } from '@/theme/tokens';

const THEMES: { value: ThemePreference; label: string; icon: 'device' | 'sun' | 'moon' }[] = [
  { value: 'system', label: 'Sistema', icon: 'device' },
  { value: 'light', label: 'Claro', icon: 'sun' },
  { value: 'dark', label: 'Escuro', icon: 'moon' },
];

export default function AparenciaScreen() {
  const { colors, mode: systemResolvedMode } = useTheme();
  const preference = useThemePreference((s) => s.preference);
  const setPreference = useThemePreference((s) => s.setPreference);
  const notifications = usePreferencesService((s) => s.notifications);
  const toggleNotification = usePreferencesService((s) => s.toggleNotification);
  const accessibility = usePreferencesService((s) => s.accessibility);
  const toggleAccessibility = usePreferencesService((s) => s.toggleAccessibility);

  const nota =
    preference === 'system'
      ? `Segue o ajuste do aparelho (agora: ${systemResolvedMode === 'dark' ? 'escuro' : 'claro'}).`
      : `Fixo em ${(preference === 'dark' ? 'escuro' : 'claro')}, independente do aparelho.`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 56, paddingBottom: 48, gap: 24 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}
        >
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Você</Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Aparência
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            O layout é o mesmo nos dois temas; só a luz muda.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {THEMES.map((t) => {
            const on = preference === t.value;
            return (
              <Pressable
                key={t.value}
                onPress={() => setPreference(t.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{
                  flex: 1,
                  gap: 10,
                  padding: 8,
                  paddingBottom: 12,
                  borderRadius: 16,
                  backgroundColor: colors.surface,
                  borderWidth: on ? 2 : 1,
                  borderColor: on ? colors.ink : colors.line,
                }}
              >
                <ThemePreview mode={t.value === 'system' ? systemResolvedMode : t.value === 'dark' ? 'dark' : 'light'} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name={t.icon} size={16} color={colors.ink} />
                  <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>{t.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, marginTop: -12 }}>{nota}</Text>

        <View>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold', marginBottom: 4 }}>
            Notificações
          </Text>
          <ToggleRow
            title="Lembretes da agenda"
            description="No horário escolhido em cada item"
            value={notifications.agenda}
            onChange={() => toggleNotification('agenda')}
          />
          <ToggleRow
            title="Vencimentos"
            description="1 dia antes, às 09:00"
            value={notifications.contas}
            onChange={() => toggleNotification('contas')}
          />
          <ToggleRow
            title="Água"
            description="A cada 2 h, das 09:00 às 19:00"
            value={notifications.agua}
            onChange={() => toggleNotification('agua')}
          />
          <ToggleRow
            title="Resumo do dia"
            description="Às 08:00, com o que vem pela frente"
            value={notifications.resumo}
            onChange={() => toggleNotification('resumo')}
            last
          />
        </View>

        <View>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold', marginBottom: 4 }}>
            Acessibilidade
          </Text>
          <ToggleRow
            title="Reduzir movimento"
            description="Sem deslocamentos; mantém as confirmações"
            value={accessibility.motion}
            onChange={() => toggleAccessibility('motion')}
          />
          <ToggleRow
            title="Aumentar contraste"
            description="Bordas e textos secundários mais fortes"
            value={accessibility.contraste}
            onChange={() => toggleAccessibility('contraste')}
            last
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ThemePreview({ mode }: { mode: 'light' | 'dark' }) {
  const bg = mode === 'dark' ? '#09090B' : '#F5F5F2';
  const line = mode === 'dark' ? '#26262C' : '#E4E4DF';
  const ink = mode === 'dark' ? '#F5F5F2' : '#09090B';
  const surf = mode === 'dark' ? '#121216' : '#FFFFFF';

  return (
    <View style={{ height: 72, borderRadius: 12, backgroundColor: bg, borderWidth: 1, borderColor: line, padding: 10, gap: 5 }}>
      <View style={{ width: '60%', height: 8, borderRadius: 4, backgroundColor: ink }} />
      <View style={{ width: '100%', height: 18, borderRadius: 6, backgroundColor: surf, borderWidth: 1, borderColor: line }} />
      <View style={{ width: '40%', height: 8, borderRadius: radii.pill, backgroundColor: '#C7FF3D' }} />
    </View>
  );
}
