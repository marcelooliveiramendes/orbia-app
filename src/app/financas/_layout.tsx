import { Stack } from 'expo-router';

export default function FinancasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="historico" />
      <Stack.Screen name="nova" options={{ presentation: 'modal' }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
