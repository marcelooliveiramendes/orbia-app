import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { Icon } from './Icon';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'backspace'];

// Opera sobre centavos inteiros (amountCents), nunca float — regra de docs/project.md §4.4.
export function AmountKeypad({
  amountCents,
  onChange,
}: {
  amountCents: number;
  onChange: (cents: number) => void;
}) {
  const { colors } = useTheme();

  function pressKey(key: string) {
    if (key === 'backspace') {
      onChange(Math.floor(amountCents / 10));
      return;
    }
    const factor = key.length === 2 ? 100 : 10;
    const digits = Number(key);
    const next = amountCents * factor + digits;
    if (next > 999_999_999) return;
    onChange(next);
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {KEYS.map((key) => (
        <Pressable
          key={key}
          onPress={() => pressKey(key)}
          style={{
            width: '33.3333%',
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {key === 'backspace' ? (
            <Icon name="backspace" color={colors.ink} size={22} />
          ) : (
            <Text
              style={{
                color: colors.ink,
                fontSize: typography.title.fontSize - 4,
                fontFamily: 'Geist_500Medium',
              }}
            >
              {key}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
