import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, typography } from '@/theme/tokens';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.tile,
        borderRadius: radii.pill,
        padding: 3,
        gap: 3,
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              height: 38,
              borderRadius: radii.pill,
              backgroundColor: active ? colors.surface : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontSize: typography.body.fontSize - 1,
                fontFamily: active ? 'Geist_600SemiBold' : 'Geist_500Medium',
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
