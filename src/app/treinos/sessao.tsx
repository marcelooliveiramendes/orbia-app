import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { getSessionSetsSummary, useWorkoutService } from '@/services/workoutService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, radii, spacing, typography } from '@/theme/tokens';

export default function SessaoScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessions = useWorkoutService((s) => s.sessions);
  const toggleSet = useWorkoutService((s) => s.toggleSet);

  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Treino não encontrado.</Text>
      </View>
    );
  }

  const { total, done } = getSessionSetsSummary(session);
  const progresso = total ? (done / total) * 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 44, paddingBottom: 4, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.replace('/treinos')} style={{ minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>Sair</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>{session.title}</Text>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
            {done} de {total} séries
          </Text>
        </View>
        <View style={{ width: 64 }} />
      </View>

      <View style={{ height: 3, marginHorizontal: 20, marginTop: 8, borderRadius: 999, backgroundColor: colors.tile, overflow: 'hidden' }}>
        <View style={{ height: 3, width: `${progresso}%`, backgroundColor: lime }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingVertical: 16, gap: 22 }}>
        {session.exercises.map((ex) => (
          <View key={ex.id} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>{ex.name}</Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
                {ex.sets} × {ex.reps}
                {ex.loadKg ? ` · ${ex.loadKg} kg` : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}>
              <Text style={{ width: 40, color: colors.muted, fontSize: typography.meta.fontSize }}>Série</Text>
              <Text style={{ flex: 1, color: colors.muted, fontSize: typography.meta.fontSize }}>Reps</Text>
              <Text style={{ flex: 1, color: colors.muted, fontSize: typography.meta.fontSize }}>Carga</Text>
              <View style={{ width: 48 }} />
            </View>
            {Array.from({ length: ex.sets }).map((_, i) => {
              const ok = ex.completedSetIndexes.includes(i);
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    minHeight: 48,
                    borderRadius: 12,
                    backgroundColor: ok ? colors.tile : 'transparent',
                    paddingHorizontal: 2,
                  }}
                >
                  <Text style={{ width: 40, textAlign: 'center', color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
                    {i + 1}
                  </Text>
                  <Text style={{ flex: 1, color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{ex.reps}</Text>
                  <Text style={{ flex: 1, color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{ex.loadKg ? `${ex.loadKg} kg` : '—'}</Text>
                  <Pressable
                    onPress={() => toggleSet(session.id, ex.id, i)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: ok }}
                    style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: ok ? lime : 'transparent',
                        borderWidth: ok ? 0 : 1.5,
                        borderColor: colors.control,
                      }}
                    >
                      {ok ? <Icon name="check" size={16} color="#09090B" strokeWidth={2.5} /> : null}
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 32, borderTopWidth: 1, borderTopColor: colors.line }}>
        <Pressable
          onPress={() => router.replace(`/treinos/concluido?id=${session.id}`)}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Concluir treino</Text>
        </Pressable>
      </View>
    </View>
  );
}
