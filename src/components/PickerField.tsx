import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, typography } from '@/theme/tokens';
import { ChipGroup } from './ChipGroup';

export function PickerField<T extends string>({
  label,
  value,
  placeholder,
  warn,
  open,
  onToggle,
  options,
  onPick,
}: {
  label: string;
  value?: T;
  placeholder: string;
  warn?: boolean;
  open: boolean;
  onToggle: () => void;
  options: T[];
  onPick: (v: T) => void;
}) {
  const { colors } = useTheme();
  const borderColor = open ? colors.ink : warn ? '#F5C04A' : colors.line;

  return (
    <View style={{ gap: 8 }}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{
          minHeight: 56,
          borderWidth: 1,
          borderColor,
          borderRadius: radii.field,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{label}</Text>
        <Text
          style={{
            color: warn ? '#7A4A00' : colors.ink,
            fontSize: typography.body.fontSize - 1,
            fontFamily: 'Geist_500Medium',
          }}
        >
          {value || placeholder}
        </Text>
      </Pressable>
      {open ? <ChipGroup options={options} value={(value ?? options[0]) as T} onChange={onPick} /> : null}
    </View>
  );
}
