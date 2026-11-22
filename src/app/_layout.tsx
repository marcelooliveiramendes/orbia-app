import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
} from '@expo-google-fonts/geist';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from '@/components/ToastHost';
import { useOnboardingService } from '@/services/onboardingService';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
        <ToastHost />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { mode } = useTheme();
  const completed = useOnboardingService((s) => s.completed);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={completed}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="criar-rapido" options={{ presentation: 'modal' }} />
          <Stack.Screen name="conta/aparencia" />
          <Stack.Screen name="conta/privacidade" />
          <Stack.Screen name="agenda" />
          <Stack.Screen name="financas" />
          <Stack.Screen name="compras" />
          <Stack.Screen name="saude" />
          <Stack.Screen name="treinos" />
        </Stack.Protected>
        <Stack.Protected guard={!completed}>
          <Stack.Screen name="acesso" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
