import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import {
  usePreferencesService,
  type PhotoRetentionChoice,
  type RetentionChoice,
} from '@/services/preferencesService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

const VOICE_RETENTION_OPTIONS: RetentionChoice[] = ['Não guardar', '7 dias', '30 dias'];
const PHOTO_RETENTION_OPTIONS: PhotoRetentionChoice[] = ['Apagar após revisar', 'Guardar com a compra'];

export default function PrivacidadeScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const micAllowed = usePreferencesService((s) => s.micAllowed);
  const toggleMic = usePreferencesService((s) => s.toggleMic);
  const voiceRetention = usePreferencesService((s) => s.voiceRetention);
  const setVoiceRetention = usePreferencesService((s) => s.setVoiceRetention);
  const photoRetention = usePreferencesService((s) => s.photoRetention);
  const setPhotoRetention = usePreferencesService((s) => s.setPhotoRetention);

  const [exported, setExported] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 56, paddingBottom: 48, gap: 24 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4, alignSelf: 'flex-start' }}
        >
          <Icon name="back" color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Você</Text>
        </Pressable>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Privacidade e dados
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            Seus dados são só seus. Aqui você decide o que fica guardado.
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Voz e câmera
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              minHeight: 64,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
                Microfone
              </Text>
              <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
                {micAllowed ? 'Permitido · usado só enquanto você grava' : 'Sem permissão · digite seus pedidos'}
              </Text>
            </View>
            <Button label={micAllowed ? 'Revogar' : 'Permitir'} variant="secondary" fullWidth={false} onPress={toggleMic} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
              Guardar transcrições de voz
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
              O áudio nunca é guardado. A transcrição fica no histórico pelo tempo escolhido.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {VOICE_RETENTION_OPTIONS.map((opt) => (
                <RetentionChip key={opt} label={opt} on={voiceRetention === opt} onPress={() => setVoiceRetention(opt)} />
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
              Fotos de cupons e listas
            </Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
              Guardadas em área privada só sua. Apagadas depois que você confirma a revisão, se preferir.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PHOTO_RETENTION_OPTIONS.map((opt) => (
                <RetentionChip key={opt} label={opt} on={photoRetention === opt} onPress={() => setPhotoRetention(opt)} />
              ))}
            </View>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Seus dados
          </Text>
          <Button
            label="Exportar meus dados"
            variant="secondary"
            onPress={() => {
              setExported(true);
              toast.show('Pedido de exportação registrado (demonstração).');
            }}
          />
          {exported ? (
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
              Pedido registrado. Você recebe um arquivo com agenda, finanças, saúde, treinos e compras por e-mail.
              Neste protótipo, nada é enviado.
            </Text>
          ) : null}
        </View>

        <View style={{ gap: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line }}>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Excluir conta
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
            Apaga a conta e todos os registros em até 30 dias. Não dá para desfazer.
          </Text>
          <Button label="Solicitar exclusão" variant="secondary" onPress={() => setConfirmingDelete(true)} />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmingDelete}
        title="Excluir a conta de Lia Andrade?"
        description="Agenda, finanças, saúde, treinos, compras, fotos e transcrições serão apagados em até 30 dias. Exporte antes se quiser guardar uma cópia."
        confirmLabel="Solicitar exclusão"
        cancelLabel="Manter conta"
        destructive
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          toast.show('Pedido de exclusão registrado (demonstração).');
        }}
      />
    </View>
  );
}

function RetentionChip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={{
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: radii.pill,
        justifyContent: 'center',
        backgroundColor: on ? colors.ink : colors.surface,
        borderWidth: 1,
        borderColor: on ? colors.ink : colors.control,
      }}
    >
      <Text style={{ color: on ? colors.bg : colors.ink, fontSize: 14, fontFamily: 'Geist_500Medium' }}>{label}</Text>
    </Pressable>
  );
}
