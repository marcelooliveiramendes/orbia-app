import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme/tokens';

export function Screen({ title, children }: { title: string; children?: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 24 }}>
        <Text
          style={{
            color: colors.ink,
            fontFamily: 'Geist_600SemiBold',
            fontSize: typography.title.fontSize,
            lineHeight: typography.title.lineHeight,
          }}
        >
          {title}
        </Text>
        <View style={{ marginTop: 16 }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
