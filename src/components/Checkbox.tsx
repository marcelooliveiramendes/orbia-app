import { Pressable } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { lime } from '@/theme/tokens';
import { Icon } from './Icon';

export function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={10}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: checked ? lime : 'transparent',
        borderWidth: checked ? 0 : 1.5,
        borderColor: colors.control,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked ? <Icon name="check" size={18} color="#09090B" strokeWidth={2.5} /> : null}
    </Pressable>
  );
}
