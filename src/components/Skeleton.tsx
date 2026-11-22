import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

// Sem shimmer, por decisão do design system (Sistema.dc.html): só bloco de tom.
export function Skeleton({ width, height = 16 }: { width: number | `${number}%`; height?: number }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 6,
        backgroundColor: colors.tile,
      }}
    />
  );
}

export function SkeletonCard() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        gap: 8,
        padding: 12,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
      }}
    >
      <Skeleton width="50%" height={12} />
      <Skeleton width="80%" height={20} />
    </View>
  );
}
