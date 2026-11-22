import { Stack } from 'expo-router';

export default function SaudeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="adicionar" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
