import { Switch } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

export function SwitchToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { colors, mode } = useTheme();

  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.control, true: colors.ink }}
      thumbColor={mode === 'dark' ? colors.bg : '#FFFFFF'}
      ios_backgroundColor={colors.control}
    />
  );
}
