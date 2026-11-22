import { Stack } from 'expo-router';

export default function AgendaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="novo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
