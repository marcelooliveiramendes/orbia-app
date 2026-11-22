import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, typography } from '@/theme/tokens';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, onFocus, onBlur, ...rest }: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.negative : focused ? colors.ink : colors.control;
  const borderWidth = focused ? 2 : 1;

  return (
    <View style={{ gap: 6 }}>
      {label ? (
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            minHeight: minTouchTarget,
            height: 48,
            borderRadius: radii.field,
            borderWidth,
            borderColor,
            paddingHorizontal: borderWidth === 2 ? 13 : 14,
            fontSize: typography.body.fontSize,
            color: colors.ink,
            fontFamily: 'Geist_400Regular',
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={{ color: colors.negative, fontSize: typography.meta.fontSize }}>{error}</Text>
      ) : null}
    </View>
  );
}
