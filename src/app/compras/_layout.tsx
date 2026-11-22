import { Stack } from 'expo-router';

export default function ComprasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="escanear" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="camera" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="revisao-ocr" />
      <Stack.Screen name="revisao-cupom" />
      <Stack.Screen name="confirmar" />
      <Stack.Screen name="sucesso" />
      <Stack.Screen name="erro" />
      <Stack.Screen name="duplicado" />
    </Stack>
  );
}
