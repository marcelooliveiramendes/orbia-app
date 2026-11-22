import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { lime, minTouchTarget, radii, typography } from '@/theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  disabledReason?: string;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  disabledReason,
  fullWidth = true,
}: ButtonProps) {
  const { colors, mode } = useTheme();
  const isDisabled = disabled || loading;

  const bg = {
    primary: lime,
    secondary: 'transparent',
    ghost: 'transparent',
  }[variant];

  const borderColor = variant === 'secondary' ? colors.control : 'transparent';
  const textColor = variant === 'primary' ? '#09090B' : colors.ink;

  return (
    <View style={{ width: fullWidth ? '100%' : undefined }}>
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => ({
          minHeight: minTouchTarget,
          height: 48,
          borderRadius: radii.pill,
          backgroundColor: isDisabled && variant === 'primary' ? colors.control : bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: pressed && !isDisabled ? (mode === 'dark' ? 0.85 : 0.92) : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        })}
      >
        {loading && <ActivityIndicator size="small" color={textColor} />}
        <Text
          style={{
            color: isDisabled && variant === 'primary' ? colors.muted : textColor,
            fontFamily: 'Geist_600SemiBold',
            fontSize: typography.section.fontSize,
          }}
        >
          {label}
        </Text>
      </Pressable>
      {isDisabled && disabledReason ? (
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, marginTop: 6 }}>
          {disabledReason}
        </Text>
      ) : null}
    </View>
  );
}
