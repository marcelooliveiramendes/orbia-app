import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useToast } from '@/components/useToast';
import { Icon, type IconName } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { ProgressArc } from '@/components/ProgressArc';
import { useAgendaService } from '@/services/agendaService';
import { getTotalBalanceCents, useFinanceService } from '@/services/financeService';
import { DAILY_WATER_GOAL_ML, getTodayWaterMl, useHealthService } from '@/services/healthService';
import { useShoppingService } from '@/services/shoppingService';
import { useWorkoutService } from '@/services/workoutService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, radii, spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

function eyebrow() {
  const h = new Date().getHours();
  if (h < 12) return 'BOM DIA';
  if (h < 18) return 'BOA TARDE';
  return 'BOA NOITE';
}

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

const shortcuts: { icon: IconName; label: string; href: Parameters<typeof router.push>[0] }[] = [
  { icon: 'agenda', label: 'Agenda', href: '/agenda' },
  { icon: 'financas', label: 'Finanças', href: '/financas' },
  { icon: 'saude', label: 'Saúde', href: '/saude' },
  { icon: 'treinos', label: 'Treinos', href: '/treinos' },
  { icon: 'compras', label: 'Compras', href: '/compras' },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const toast = useToast();

  const agendaItems = useAgendaService((s) => s.items);
  const toggleDone = useAgendaService((s) => s.toggleDone);
  const accounts = useFinanceService((s) => s.accounts);
  const lists = useShoppingService((s) => s.lists);
  const waterEntries = useHealthService((s) => s.waterEntries);
  const sessions = useWorkoutService((s) => s.sessions);

  const todayItems = agendaItems
    .filter((i) => isToday(i.startsAt))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcoming = todayItems.slice(0, 3);
  const firstName = 'Lia';

  const activeList = lists.find((l) => !l.archivedAt);
  const checkedCount = activeList?.items.filter((i) => i.checkedAt).length ?? 0;
  const totalItems = activeList?.items.length ?? 0;
  const waterToday = getTodayWaterMl(waterEntries);
  const waterProgress = Math.min(1, waterToday / DAILY_WATER_GOAL_ML);
  const sessionsDone = sessions.filter((s) => s.completedAt).length;

  function handleToggle(id: string, title: string) {
    toggleDone(id);
    toast.show(`Concluído: ${title}`, { actionLabel: 'Desfazer', onAction: () => toggleDone(id) });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 56, paddingBottom: 124, gap: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo height={24} />
          <Pressable onPress={() => router.push('/(tabs)/perfil')} hitSlop={8}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                backgroundColor: colors.tile,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="user" size={20} color={colors.ink} />
            </View>
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.muted, fontSize: 12, fontFamily: 'Geist_600SemiBold', letterSpacing: 1 }}>
            {eyebrow()}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ color: colors.ink, fontSize: 32, fontFamily: 'Geist_600SemiBold' }}>{firstName}</Text>
            <Text style={{ color: lime, fontSize: 32, fontFamily: 'Geist_600SemiBold' }}>.</Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>Sua vida em movimento.</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {shortcuts.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => router.push(s.href)}
              style={{ alignItems: 'center', gap: 8, width: 60 }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: radii.card,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.line,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={s.icon} size={22} color={colors.ink} />
              </View>
              <Text style={{ color: colors.muted, fontSize: 11, fontFamily: 'Geist_500Medium' }} numberOfLines={1}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
                Hoje
              </Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{todayLabel()}</Text>
            </View>
            <Pressable onPress={() => router.push('/agenda')} hitSlop={8}>
              <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>
                Ver agenda
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radii.card,
              padding: 16,
            }}
          >
            {upcoming.length === 0 ? (
              <Text style={{ color: colors.muted, fontSize: typography.body.fontSize - 1, paddingVertical: 4 }}>
                Nada por vir. Toque em + para criar um compromisso.
              </Text>
            ) : (
              upcoming.map((item, idx) => (
                <View key={item.id} style={{ flexDirection: 'row', gap: 14 }}>
                  <View style={{ alignItems: 'center', width: 10 }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        backgroundColor: item.done ? colors.muted : idx === 0 ? lime : colors.tile,
                        borderWidth: idx === 0 && !item.done ? 0 : 1,
                        borderColor: colors.line,
                      }}
                    />
                    {idx < upcoming.length - 1 ? (
                      <View style={{ flex: 1, width: 1, backgroundColor: colors.line, marginTop: 2 }} />
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => handleToggle(item.id, item.title)}
                    style={{ flex: 1, paddingBottom: idx < upcoming.length - 1 ? 18 : 0 }}
                  >
                    <Text style={{ color: colors.muted, fontSize: 13, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
                      {new Date(item.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text
                      style={{
                        color: colors.ink,
                        fontSize: 16,
                        fontFamily: 'Geist_600SemiBold',
                        textDecorationLine: item.done ? 'line-through' : 'none',
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
                      {item.note ? `${item.note} · ` : ''}
                      {item.kind === 'tarefa' ? 'Tarefa' : 'Compromisso'}
                    </Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => router.push('/financas')}
            style={{
              flex: 1,
              backgroundColor: colors.ink,
              borderRadius: radii.card,
              padding: 16,
              gap: 10,
              minHeight: 118,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="financas" size={16} color={colors.bg} />
              <Text style={{ color: colors.bg, opacity: 0.6, fontSize: 11, fontFamily: 'Geist_600SemiBold', letterSpacing: 0.5 }}>
                FINANÇAS
              </Text>
            </View>
            <View>
              <Text style={{ color: colors.bg, fontSize: 20, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }} numberOfLines={1}>
                {formatCentsToBRL(getTotalBalanceCents(accounts))}
              </Text>
              <Text style={{ color: colors.bg, opacity: 0.6, fontSize: 12 }}>Saldo disponível</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/saude')}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radii.card,
              padding: 16,
              gap: 8,
              minHeight: 118,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="saude" size={16} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 11, fontFamily: 'Geist_600SemiBold', letterSpacing: 0.5 }}>
                SAÚDE
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40 }}>
                <ProgressArc progress={waterProgress} size={40} />
              </View>
              <View>
                <Text style={{ color: colors.ink, fontSize: 20, fontFamily: 'Geist_600SemiBold' }}>
                  {Math.round(waterProgress * 100)}%
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Água do dia</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => router.push('/treinos')}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radii.card,
              padding: 16,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="treinos" size={16} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 11, fontFamily: 'Geist_600SemiBold', letterSpacing: 0.5 }}>
                TREINOS
              </Text>
            </View>
            <Text style={{ color: colors.ink, fontSize: 20, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
              {sessionsDone}/{sessions.length}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: -6 }}>Treinos da semana</Text>
            <View style={{ height: 4, borderRadius: 999, backgroundColor: colors.tile, overflow: 'hidden' }}>
              <View
                style={{
                  height: 4,
                  borderRadius: 999,
                  width: `${sessions.length ? Math.min(100, (sessionsDone / sessions.length) * 100) : 0}%`,
                  backgroundColor: lime,
                }}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/compras')}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radii.card,
              padding: 16,
              gap: 10,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Icon name="compras" size={16} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 11, fontFamily: 'Geist_600SemiBold', letterSpacing: 0.5 }}>
                  COMPRAS
                </Text>
              </View>
              <Text style={{ color: colors.ink, fontSize: 20, fontFamily: 'Geist_600SemiBold' }}>
                {totalItems - checkedCount} itens
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {activeList ? activeList.title : 'Nenhuma lista ativa'}
              </Text>
            </View>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                backgroundColor: lime,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="chevron" size={18} color="#09090B" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
