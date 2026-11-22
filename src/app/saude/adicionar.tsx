import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ChipGroup } from '@/components/ChipGroup';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { useToast } from '@/components/useToast';
import { MEAL_TYPES, useHealthService } from '@/services/healthService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';
import type { MealType } from '@/types';

const FAVORITOS = [
  { label: 'Iogurte com granola', uso: 'usado 6× no mês' },
  { label: 'Pão integral com ovo', uso: 'usado 4×' },
  { label: 'Salada de frutas', uso: 'usado 3×' },
];

export default function SaudeAdicionarScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const params = useLocalSearchParams<{ tipo?: string }>();
  const addFood = useHealthService((s) => s.addFood);

  const [tipo, setTipo] = useState<MealType>((params.tipo as MealType) || 'Lanche');
  const [comida, setComida] = useState('');
  const [hora, setHora] = useState('14:20');
  const [quantidade, setQuantidade] = useState('');
  const [tentou, setTentou] = useState(false);

  const podeSalvar = comida.trim().length > 0;

  function handleSalvar() {
    if (!podeSalvar) {
      setTentou(true);
      return;
    }
    const [hh, mm] = hora.split(':').map(Number);
    const occurredAt = new Date();
    occurredAt.setHours(hh || 0, mm || 0, 0, 0);
    addFood(tipo, quantidade ? `${comida.trim()} · ${quantidade}` : comida.trim(), occurredAt.toISOString());
    toast.show(`${tipo} registrado`);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 4, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.back()} style={{ minHeight: minTouchTarget, paddingHorizontal: 12, justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>Cancelar</Text>
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Refeição</Text>
        <View style={{ width: 92 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingVertical: 12, gap: 18 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Qual refeição</Text>
          <ChipGroup options={MEAL_TYPES} value={tipo} onChange={setTipo} />
        </View>
        <Input
          label="O que você comeu?"
          value={comida}
          onChangeText={setComida}
          error={tentou && !podeSalvar ? 'Escreva o que comeu ou toque num favorito.' : undefined}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Favoritos</Text>
          {FAVORITOS.map((f) => {
            const on = comida === f.label;
            return (
              <Pressable
                key={f.label}
                onPress={() => setComida(f.label)}
                style={{
                  minHeight: 52,
                  borderRadius: radii.field,
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: on ? colors.ink : colors.surface,
                  borderWidth: 1,
                  borderColor: on ? colors.ink : colors.line,
                }}
              >
                <Icon name="star" size={18} color={on ? colors.bg : colors.ink} />
                <Text style={{ flex: 1, color: on ? colors.bg : colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>{f.label}</Text>
                <Text style={{ color: on ? colors.bg : colors.muted, fontSize: 13, opacity: 0.8 }}>{f.uso}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Input label="Horário" value={hora} onChangeText={setHora} placeholder="14:20" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Quantidade · opcional" value={quantidade} onChangeText={setQuantidade} />
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, paddingTop: 12 }}>
        <Pressable
          onPress={handleSalvar}
          style={{
            height: 52,
            minHeight: minTouchTarget,
            borderRadius: radii.pill,
            backgroundColor: podeSalvar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeSalvar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Registrar refeição</Text>
        </Pressable>
      </View>
    </View>
  );
}
