import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ChipGroup } from '@/components/ChipGroup';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useToast } from '@/components/useToast';
import { useAgendaService } from '@/services/agendaService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';
import type { AgendaKind } from '@/types';

const DATA_OPTIONS = ['Hoje', 'Amanhã', 'Em 2 dias', 'Em 1 semana'] as const;
const LEMBRETE_OPTIONS = ['Sem lembrete', '15 min antes', '1 h antes'] as const;
const REPETIR_OPTIONS = ['Não repete', 'Toda semana', 'Todo mês'] as const;

function resolveDate(label: string): Date {
  const d = new Date();
  if (label === 'Amanhã') d.setDate(d.getDate() + 1);
  else if (label === 'Em 2 dias') d.setDate(d.getDate() + 2);
  else if (label === 'Em 1 semana') d.setDate(d.getDate() + 7);
  return d;
}

export default function AgendaNovoScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const addItem = useAgendaService((s) => s.addItem);

  const [tipo, setTipo] = useState<AgendaKind>('tarefa');
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState<string>(DATA_OPTIONS[0]);
  const [hora, setHora] = useState('');
  const [mais, setMais] = useState(false);
  const [lembrete, setLembrete] = useState<string>(LEMBRETE_OPTIONS[0]);
  const [repetir, setRepetir] = useState<string>(REPETIR_OPTIONS[0]);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const podeSalvar = titulo.trim().length > 0;

  function handleSalvar() {
    if (!podeSalvar) {
      setTentouSalvar(true);
      return;
    }
    const baseDate = resolveDate(data);
    const [hh, mm] = (hora || (data === 'Hoje' ? '18:00' : '09:00')).split(':').map(Number);
    baseDate.setHours(hh || 0, mm || 0, 0, 0);

    addItem({
      kind: tipo,
      title: titulo.trim(),
      startsAt: baseDate.toISOString(),
      reminderLabel: lembrete,
      repeatLabel: repetir,
      createdAt: new Date().toISOString(),
      done: false,
    });
    toast.show(`"${titulo.trim()}" salvo para ${data === 'Hoje' ? 'hoje' : data.toLowerCase()}`);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 4, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.back()} style={{ minHeight: minTouchTarget, paddingHorizontal: 12, justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>Cancelar</Text>
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Novo</Text>
        <View style={{ width: 92 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingVertical: 12, gap: 18 }}>
        <SegmentedControl
          options={[
            { value: 'tarefa', label: 'Tarefa' },
            { value: 'compromisso', label: 'Compromisso' },
          ]}
          value={tipo}
          onChange={setTipo}
        />
        <Input
          label="Nome"
          value={titulo}
          onChangeText={setTitulo}
          error={tentouSalvar && !podeSalvar ? 'Dê um nome para salvar.' : undefined}
        />
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Quando</Text>
          <ChipGroup options={[...DATA_OPTIONS]} value={data} onChange={setData} />
        </View>
        <Input
          label={`Horário ${tipo === 'tarefa' ? '· opcional' : ''}`}
          value={hora}
          onChangeText={setHora}
          placeholder="19:00"
          keyboardType="numbers-and-punctuation"
        />
        <Pressable
          onPress={() => setMais((v) => !v)}
          style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>
            {mais ? 'Menos opções' : 'Lembrete e repetição'}
          </Text>
          <Icon name="down" size={18} color={colors.ink} />
        </Pressable>
        {mais ? (
          <View style={{ gap: 18 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Lembrete</Text>
              <ChipGroup options={[...LEMBRETE_OPTIONS]} value={lembrete} onChange={setLembrete} />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Repetir</Text>
              <ChipGroup options={[...REPETIR_OPTIONS]} value={repetir} onChange={setRepetir} />
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, paddingTop: 12, gap: 8 }}>
        <Pressable
          onPress={handleSalvar}
          style={{
            height: 52,
            borderRadius: radii.pill,
            backgroundColor: podeSalvar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeSalvar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
            Salvar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
