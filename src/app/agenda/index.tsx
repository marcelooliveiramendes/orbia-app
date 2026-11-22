import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Checkbox } from '@/components/Checkbox';
import { Icon } from '@/components/Icon';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useAgendaService } from '@/services/agendaService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, spacing, typography } from '@/theme/tokens';

type Mode = 'dia' | 'semana';

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export default function AgendaIndexScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('dia');
  const items = useAgendaService((s) => s.items);
  const toggleDone = useAgendaService((s) => s.toggleDone);

  const todayItems = items.filter((i) => isToday(i.startsAt)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const pendingCount = todayItems.filter((i) => !i.done).length;

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i); // domingo como início
    const dayItems = items
      .filter((it) => new Date(it.startsAt).toDateString() === d.toDateString())
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    return { date: d, items: dayItems };
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4 }}>
            <Icon name="back" color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Áreas</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/agenda/novo')}
            accessibilityLabel="Novo item na agenda"
            style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: lime, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="plus" color="#09090B" strokeWidth={2} />
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Agenda</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            {mode === 'dia'
              ? `${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · ${pendingCount} pendentes`
              : 'Semana atual'}
          </Text>
        </View>

        <SegmentedControl
          options={[
            { value: 'dia', label: 'Dia' },
            { value: 'semana', label: 'Semana' },
          ]}
          value={mode}
          onChange={setMode}
        />

        {mode === 'dia' ? (
          <View>
            {todayItems.map((item) => (
              <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 68, borderBottomWidth: 1, borderBottomColor: colors.line }}>
                <Text
                  style={{
                    width: 56,
                    fontSize: 15,
                    fontFamily: 'Geist_500Medium',
                    fontVariant: ['tabular-nums'],
                    color: item.done ? colors.muted : colors.ink,
                  }}
                >
                  {new Date(item.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {item.kind === 'tarefa' ? (
                  <Checkbox checked={!!item.done} onChange={() => toggleDone(item.id)} />
                ) : (
                  <View style={{ width: 28 }} />
                )}
                <Pressable onPress={() => router.push(`/agenda/${item.id}`)} style={{ flex: 1, paddingVertical: 8 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Geist_500Medium',
                      color: item.done ? colors.muted : colors.ink,
                      textDecorationLine: item.done && item.kind === 'tarefa' ? 'line-through' : 'none',
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
                    {item.kind === 'tarefa' ? 'Tarefa' : 'Compromisso'}
                    {item.reminderLabel !== 'Sem lembrete' ? ` · lembrete ${item.reminderLabel}` : ''}
                  </Text>
                </Pressable>
              </View>
            ))}
            {todayItems.length === 0 ? (
              <Text style={{ color: colors.muted, fontSize: typography.body.fontSize - 1, paddingVertical: 20 }}>
                Nada para hoje. Toque em + para criar.
              </Text>
            ) : null}
          </View>
        ) : (
          <View>
            {weekDays.map(({ date, items: dayItems }) => {
              const isCurrentDay = date.toDateString() === new Date().toDateString();
              return (
                <View key={date.toISOString()} style={{ flexDirection: 'row', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line }}>
                  <View style={{ width: 44, alignItems: 'center', gap: 2 }}>
                    <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{WEEKDAY_SHORT[date.getDay()]}</Text>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCurrentDay ? colors.ink : 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          fontFamily: 'Geist_600SemiBold',
                          fontVariant: ['tabular-nums'],
                          color: isCurrentDay ? colors.bg : colors.ink,
                        }}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', gap: 4, minHeight: 44 }}>
                    {dayItems.length === 0 ? (
                      <Text style={{ color: colors.muted, fontSize: 15 }}>Livre</Text>
                    ) : (
                      dayItems.map((it) => (
                        <Text key={it.id} style={{ fontSize: 15, fontVariant: ['tabular-nums'], color: colors.ink }}>
                          <Text style={{ color: colors.muted }}>
                            {new Date(it.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{' '}
                          </Text>
                          {it.title}
                        </Text>
                      ))
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
