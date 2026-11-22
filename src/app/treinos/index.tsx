import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { getSessionSetsSummary, isToday, useWorkoutService } from '@/services/workoutService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, radii, spacing, typography } from '@/theme/tokens';

const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function TreinosIndexScreen() {
  const { colors } = useTheme();
  const sessions = useWorkoutService((s) => s.sessions);

  const feitos = sessions.filter((s) => s.completedAt).length;
  const hoje = sessions.find((s) => isToday(s.scheduledFor));
  const hojeFeito = !!hoje?.completedAt;
  const resumoHoje = hoje ? getSessionSetsSummary(hoje) : null;

  const start = new Date();
  start.setDate(start.getDate() - start.getDay() + 1); // segunda
  const dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const session = sessions.find((s) => new Date(s.scheduledFor).toDateString() === d.toDateString());
    const isHoje = d.toDateString() === new Date().toDateString();
    return { label: WEEKDAY_SHORT[d.getDay()], done: !!session?.completedAt, planned: !!session, isHoje };
  });

  const plano = [...sessions]
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
    .map((s) => {
      const d = new Date(s.scheduledFor);
      const summary = getSessionSetsSummary(s);
      return {
        id: s.id,
        dia: WEEKDAY_SHORT[d.getDay()],
        titulo: s.title,
        meta: summary.total
          ? `${s.exercises.length} exercícios · ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          : s.durationMin
            ? `${s.durationMin} min`
            : '',
        status: s.completedAt ? 'Feito' : isToday(s.scheduledFor) ? 'Hoje' : 'Planejado',
      };
    });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 24 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}>
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Áreas</Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Treinos</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>Semana atual · {feitos} de {sessions.length} feitos</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 4 }}>
          {dias.map((d) => (
            <View
              key={d.label}
              style={{
                flex: 1,
                alignItems: 'center',
                gap: 6,
                paddingVertical: 8,
                borderRadius: 14,
                backgroundColor: d.isHoje ? colors.tile : 'transparent',
              }}
            >
              <Text style={{ fontSize: 12, color: d.isHoje ? colors.ink : colors.muted, fontFamily: d.isHoje ? 'Geist_600SemiBold' : 'Geist_400Regular' }}>
                {d.label}
              </Text>
              {d.done ? (
                <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: lime, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={14} color="#09090B" strokeWidth={2.5} />
                </View>
              ) : d.planned ? (
                <View style={{ width: 24, height: 24, borderRadius: 999, borderWidth: 1.5, borderColor: colors.ink }} />
              ) : (
                <View style={{ width: 10, height: 2, borderRadius: 2, backgroundColor: colors.control, marginVertical: 11 }} />
              )}
            </View>
          ))}
        </View>

        {hoje ? (
          <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 18, gap: 14 }}>
            <View style={{ gap: 2 }}>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                Hoje · {new Date(hoje.scheduledFor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>{hoje.title}</Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
                {hoje.exercises.length} exercícios · {resumoHoje?.total} séries
              </Text>
            </View>
            {hojeFeito ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 22, height: 22, borderRadius: 999, backgroundColor: lime, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={14} color="#09090B" strokeWidth={2.5} />
                </View>
                <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>
                  Feito hoje{hoje.durationMin ? ` · ${hoje.durationMin} min` : ''}
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={() => router.push(`/treinos/sessao?id=${hoje.id}`)}
                style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="play" size={20} color="#09090B" />
                <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Iniciar treino</Text>
              </Pressable>
            )}
          </View>
        ) : null}

        <View>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold', marginBottom: 4 }}>
            Plano da semana
          </Text>
          {plano.map((p) => (
            <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.line }}>
              <Text style={{ width: 44, color: colors.muted, fontSize: typography.meta.fontSize }}>{p.dia}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{p.titulo}</Text>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{p.meta}</Text>
              </View>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{p.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
