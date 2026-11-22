import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, typography } from '@/theme/tokens';

export function OnboardingHeader({ step, onSkip }: { step: 1 | 2 | 3; onSkip: () => void }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 44,
        marginTop: 24,
      }}
    >
      <View accessibilityLabel={`Etapa ${step} de 3`} style={{ flexDirection: 'row', gap: 6 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              width: 24,
              height: 4,
              borderRadius: 999,
              backgroundColor: i <= step ? colors.ink : colors.tile,
            }}
          />
        ))}
      </View>
      <Pressable onPress={onSkip} style={{ minHeight: minTouchTarget, justifyContent: 'center' }}>
        <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>
          Pular
        </Text>
      </Pressable>
    </View>
  );
}
