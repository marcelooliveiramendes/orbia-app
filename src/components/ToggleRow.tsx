import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';
import { SwitchToggle } from './SwitchToggle';

export function ToggleRow({
  title,
  description,
  value,
  onChange,
  last,
}: {
  title: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        minHeight: 64,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>
          {title}
        </Text>
        {description ? (
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{description}</Text>
        ) : null}
      </View>
      <SwitchToggle value={value} onChange={onChange} />
    </View>
  );
}
