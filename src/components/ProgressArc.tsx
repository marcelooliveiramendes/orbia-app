import { Circle, Svg } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { lime } from '@/theme/tokens';

// O ponto do wordmark como cursor de progresso. Só em Início, Treinos e carregamentos (Sistema.dc.html).
export function ProgressArc({ progress, size = 56 }: { progress: number; size?: number }) {
  const { colors } = useTheme();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dash = circumference * clamped;
  const angle = -90 + clamped * 360;
  const rad = (angle * Math.PI) / 180;
  const cx = 44 + radius * Math.cos(rad);
  const cy = 44 + radius * Math.sin(rad);

  return (
    <Svg width={size} height={size} viewBox="0 0 88 88">
      <Circle cx={44} cy={44} r={radius} fill="none" stroke={colors.tile} strokeWidth={6} />
      <Circle
        cx={44}
        cy={44}
        r={radius}
        fill="none"
        stroke={lime}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 44 44)`}
      />
      {clamped > 0.02 ? (
        <Circle cx={cx} cy={cy} r={6} fill={lime} stroke={colors.bg} strokeWidth={1.5} />
      ) : null}
    </Svg>
  );
}
