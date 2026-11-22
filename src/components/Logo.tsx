import { Image } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

// Logo oficial — nunca recriar o wordmark em fonte (docs/HANDOFF.md).
export function Logo({ height = 28 }: { height?: number }) {
  const { mode } = useTheme();
  const source =
    mode === 'dark'
      ? require('../../assets/logo-orbia-escuro.png')
      : require('../../assets/logo-orbia-claro.png');

  return <Image source={source} style={{ height, width: height * (204 / 60), resizeMode: 'contain' }} />;
}
