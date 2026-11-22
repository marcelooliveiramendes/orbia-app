import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import { useAgendaService } from '@/services/agendaService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

export default function AgendaDetalheScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const items = useAgendaService((s) => s.items);
  const toggleDone = useAgendaService((s) => s.toggleDone);
  const removeItem = useAgendaService((s) => s.removeItem);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Item não encontrado.</Text>
      </View>
    );
  }

  const campos = [
    { k: 'Lembrete', v: item.reminderLabel },
    { k: 'Repetir', v: item.repeatLabel },
    { k: 'Nota', v: item.note ?? '—' },
    { k: 'Criado em', v: new Date(item.createdAt).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) + ' · pelo Criar rápido' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 24, gap: 20 }}>
        <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}>
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Agenda</Text>
        </Pressable>

        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
            {item.kind === 'tarefa' ? 'Tarefa · Trabalho' : 'Compromisso'}
          </Text>
          <Text
            style={{
              color: item.done ? colors.muted : colors.ink,
              fontSize: typography.title.fontSize,
              fontFamily: 'Geist_600SemiBold',
              textDecorationLine: item.done && item.kind === 'tarefa' ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
          <Text style={{ color: colors.ink, fontSize: 17, fontVariant: ['tabular-nums'] }}>
            {new Date(item.startsAt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            {' · '}
            {new Date(item.startsAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, paddingHorizontal: 16 }}>
          {campos.map((c, i) => (
            <View
              key={c.k}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 16,
                alignItems: 'center',
                minHeight: 48,
                borderBottomWidth: i === campos.length - 1 ? 0 : 1,
                borderBottomColor: colors.line,
              }}
            >
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{c.k}</Text>
              <Text style={{ color: colors.ink, fontSize: 15, textAlign: 'right', flexShrink: 1 }}>{c.v}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => setConfirmingDelete(true)}
          style={{ height: 48, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
        >
          <Icon name="trash" size={20} color={colors.negative} />
          <Text style={{ color: colors.negative, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Excluir</Text>
        </Pressable>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, paddingTop: 12 }}>
        <Button
          label={item.done ? 'Marcar como pendente' : item.kind === 'tarefa' ? 'Concluir tarefa' : 'Marcar como feito'}
          variant={item.done ? 'secondary' : 'primary'}
          onPress={() => toggleDone(item.id)}
        />
      </View>

      <ConfirmDialog
        visible={confirmingDelete}
        title={`Excluir "${item.title}"?`}
        description="O lembrete também será removido. Você pode desfazer logo em seguida."
        confirmLabel="Excluir"
        cancelLabel="Manter"
        destructive
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          removeItem(item.id);
          setConfirmingDelete(false);
          toast.show(`"${item.title}" excluído`);
          router.back();
        }}
      />
    </View>
  );
}
