import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { useActivityService } from '@/services/activityService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';
import type { ActivityEntry } from '@/types';

type FilterKey = 'tudo' | ActivityEntry['area'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'tudo', label: 'Tudo' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'financas', label: 'Finanças' },
  { key: 'saude', label: 'Saúde' },
  { key: 'treinos', label: 'Treinos' },
  { key: 'compras', label: 'Compras' },
];

const AREA_ICON: Record<ActivityEntry['area'], IconName> = {
  agenda: 'agenda',
  financas: 'financas',
  saude: 'saude',
  treinos: 'treinos',
  compras: 'compras',
};

function dayLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' });
}

export default function AtividadeScreen() {
  const { colors } = useTheme();
  const entries = useActivityService((s) => s.entries);
  const [filtro, setFiltro] = useState<FilterKey>('tudo');

  const grouped = useMemo(() => {
    const filtered = entries
      .filter((e) => filtro === 'tudo' || e.area === filtro)
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    const groups = new Map<string, ActivityEntry[]>();
    for (const entry of filtered) {
      const key = dayLabel(entry.occurredAt);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(entry);
    }
    return Array.from(groups.entries());
  }, [entries, filtro]);

  const filtroLabel = FILTERS.find((f) => f.key === filtro)?.label ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: 56, paddingBottom: 124, gap: 20 }}>
        <View style={{ paddingHorizontal: spacing.screenMargin, gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Atividade
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            O que mudou nos últimos dias, em ordem.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, gap: 8 }}
        >
          {FILTERS.map((f) => {
            const on = f.key === filtro;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFiltro(f.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={{
                  minHeight: 40,
                  paddingHorizontal: 16,
                  borderRadius: radii.pill,
                  justifyContent: 'center',
                  backgroundColor: on ? colors.ink : 'transparent',
                  borderWidth: 1,
                  borderColor: on ? colors.ink : colors.control,
                }}
              >
                <Text style={{ color: on ? colors.bg : colors.ink, fontSize: 14, fontFamily: 'Geist_500Medium' }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: spacing.screenMargin, gap: 20 }}>
          {grouped.length === 0 ? (
            <View
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: colors.control,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
                Nada registrado em {filtroLabel} nos últimos 7 dias.
              </Text>
            </View>
          ) : null}
          {grouped.map(([day, items]) => (
            <View key={day}>
              <Text style={{ color: colors.muted, fontSize: 14, fontFamily: 'Geist_600SemiBold', marginBottom: 4 }}>
                {day}
              </Text>
              {items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    minHeight: 64,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.line,
                  }}
                >
                  <Icon name={AREA_ICON[item.area]} size={20} color={colors.muted} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                    {new Date(item.occurredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
