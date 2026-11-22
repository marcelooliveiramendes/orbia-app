import { Pressable, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, typography } from '@/theme/tokens';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        minHeight: minTouchTarget,
        paddingHorizontal: 14,
        borderRadius: radii.pill,
        backgroundColor: selected ? colors.ink : 'transparent',
        borderWidth: selected ? 0 : 1,
        borderColor: colors.control,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: selected ? colors.bg : colors.ink,
          fontSize: typography.body.fontSize - 1,
          fontFamily: 'Geist_500Medium',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
