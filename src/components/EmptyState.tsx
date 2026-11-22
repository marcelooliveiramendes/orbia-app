import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, typography } from '@/theme/tokens';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.control,
        borderRadius: radii.card,
        padding: 20,
        alignItems: 'center',
        gap: 10,
      }}
    >
      {icon ? <Icon name={icon} size={28} color={colors.muted} /> : null}
      <Text
        style={{
          color: colors.ink,
          fontSize: typography.body.fontSize,
          fontFamily: 'Geist_500Medium',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={{ color: colors.muted, fontSize: typography.meta.fontSize + 1, textAlign: 'center' }}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel ? (
        <View style={{ marginTop: 8, width: '100%' }}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}
