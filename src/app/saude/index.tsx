import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import {
  DAILY_WATER_GOAL_ML,
  MEAL_TYPES,
  getTodayMealByType,
  getTodayWaterMl,
  useHealthService,
} from '@/services/healthService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, radii, spacing, typography } from '@/theme/tokens';

function litros(ml: number) {
  return `${(ml / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/0$/, '')} L`;
}

export default function SaudeIndexScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const waterEntries = useHealthService((s) => s.waterEntries);
  const foodEntries = useHealthService((s) => s.foodEntries);
  const addWater = useHealthService((s) => s.addWater);

  const aguaHoje = getTodayWaterMl(waterEntries);
  const cheios = Math.min(8, Math.floor(aguaHoje / 250));
  const nRef = MEAL_TYPES.filter((m) => getTodayMealByType(foodEntries, m)).length;

  const hist = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;
    const ml = isToday
      ? aguaHoje
      : waterEntries
          .filter((w) => new Date(w.occurredAt).toDateString() === d.toDateString())
          .reduce((sum, w) => sum + w.amountMl, 0);
    return {
      label: isToday ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
      ml,
      pct: Math.min(100, (ml / 2500) * 100),
      isToday,
    };
  });

  function handleAdd(amountMl: number) {
    addWater(amountMl);
    toast.show(`Água +${amountMl} ml`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 24 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}>
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Áreas</Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Saúde e alimentação</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            Hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16, gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>Água</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Meta de {litros(DAILY_WATER_GOAL_ML)} por dia</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ color: colors.ink, fontSize: 34, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
              {litros(aguaHoje)}
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>de {litros(DAILY_WATER_GOAL_ML)}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: i < cheios ? lime : colors.tile }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => handleAdd(250)}
              style={{ flex: 1, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="drop" size={18} color={colors.ink} />
              <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>+250 ml</Text>
            </Pressable>
            <Pressable
              onPress={() => handleAdd(500)}
              style={{ flex: 1, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="drop" size={18} color={colors.ink} />
              <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>+500 ml</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>Refeições</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{nRef} de 4 registradas</Text>
          </View>
          {MEAL_TYPES.map((tipo) => {
            const entry = getTodayMealByType(foodEntries, tipo);
            return (
              <View key={tipo} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{tipo}</Text>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
                    {entry?.description || 'Ainda não registrado'}
                  </Text>
                </View>
                {entry ? (
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                    {new Date(entry.occurredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                ) : (
                  <Pressable
                    onPress={() => router.push({ pathname: '/saude/adicionar', params: { tipo } })}
                    style={{ minHeight: 40, paddingHorizontal: 14, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: colors.ink, fontSize: 14, fontFamily: 'Geist_500Medium' }}>Registrar</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>Água nos últimos 7 dias</Text>
          {hist.map((h) => (
            <View key={h.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ width: 72, color: colors.muted, fontSize: typography.meta.fontSize }}>{h.label}</Text>
              <View style={{ flex: 1, height: 6, borderRadius: 999, backgroundColor: colors.tile, overflow: 'hidden' }}>
                <View style={{ height: 6, borderRadius: 999, width: `${h.pct}%`, backgroundColor: h.isToday ? lime : colors.muted }} />
              </View>
              <Text style={{ width: 56, textAlign: 'right', color: colors.ink, fontSize: 14, fontVariant: ['tabular-nums'] }}>{litros(h.ml)}</Text>
            </View>
          ))}
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, marginTop: 4 }}>
            Metas simples, definidas por você. A Orbia não faz diagnóstico nem prescrição; para orientação, procure um profissional de saúde.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
