import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

import { Input } from '@/components/Input';
import { getSessionSetsSummary, useWorkoutService } from '@/services/workoutService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, radii, spacing, typography } from '@/theme/tokens';

export default function ConcluidoScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessions = useWorkoutService((s) => s.sessions);
  const completeSession = useWorkoutService((s) => s.completeSession);
  const setSessionNote = useWorkoutService((s) => s.setSessionNote);
  const [nota, setNota] = useState('');
  const triggeredRef = useRef(false);

  const session = sessions.find((s) => s.id === id);

  useEffect(() => {
    if (session && !session.completedAt && !triggeredRef.current) {
      triggeredRef.current = true;
      completeSession(session.id, 52);
    }
  }, [session, completeSession]);

  if (!session) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Treino não encontrado.</Text>
      </View>
    );
  }

  const { total, done, volumeKg } = getSessionSetsSummary(session);
  const feitosSemana = sessions.filter((s) => s.completedAt).length;
  const pct = sessions.length ? feitosSemana / sessions.length : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 96, paddingBottom: 24, gap: 20 }}>
        <Svg width={72} height={72} viewBox="0 0 72 72">
          <Circle cx={36} cy={36} r={30} fill="none" stroke={colors.tile} strokeWidth={5} />
          <Circle
            cx={36}
            cy={36}
            r={30}
            fill="none"
            stroke={lime}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 30 * pct} ${2 * Math.PI * 30}`}
            transform="rotate(-90 36 36)"
          />
        </Svg>
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Treino concluído.</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            {session.title} · hoje · {feitosSemana} de {sessions.length} treinos da semana feitos.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card }}>
          <View style={{ flex: 1, padding: 14, borderRightWidth: 1, borderRightColor: colors.line }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Duração</Text>
            <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>52 min</Text>
          </View>
          <View style={{ flex: 1, padding: 14, borderRightWidth: 1, borderRightColor: colors.line }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Séries</Text>
            <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
              {done} de {total}
            </Text>
          </View>
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Volume</Text>
            <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
              {volumeKg.toLocaleString('pt-BR')} kg
            </Text>
          </View>
        </View>

        <Input
          label="Nota · opcional"
          value={nota}
          onChangeText={setNota}
          onBlur={() => session && setSessionNote(session.id, nota)}
        />
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, gap: 8 }}>
        <Pressable
          onPress={() => router.replace('/treinos')}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Ver a semana</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/(tabs)')} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Ir para o Início</Text>
        </Pressable>
      </View>
    </View>
  );
}
