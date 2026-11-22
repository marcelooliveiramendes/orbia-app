import { Modal, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, typography } from '@/theme/tokens';
import { Button } from './Button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: colors.surface,
            borderRadius: radii.card,
            padding: 20,
            gap: 16,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text
              style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}
            >
              {title}
            </Text>
            {description ? (
              <Text style={{ color: colors.muted, fontSize: typography.body.fontSize - 1 }}>
                {description}
              </Text>
            ) : null}
          </View>
          <View style={{ gap: 10 }}>
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'secondary' : 'primary'}
            />
            <Button label={cancelLabel} onPress={onCancel} variant="ghost" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
