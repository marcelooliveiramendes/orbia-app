import { router } from 'expo-router';
import { Image, Pressable, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <Pressable
      onPress={() => router.push('/acesso/onboarding-1')}
      accessibilityRole="button"
      accessibilityLabel="orbia. Toque para começar"
      style={{
        flex: 1,
        backgroundColor: '#09090B',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
      }}
    >
      <Image
        source={require('../../../assets/logo-orbia-escuro.png')}
        style={{ height: 60, width: 204, resizeMode: 'contain' }}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 56,
          left: 32,
          right: 32,
          fontSize: 14,
          lineHeight: 20,
          color: '#A1A1AA',
          textAlign: 'center',
        }}
      >
        Tudo o que importa na sua vida, organizado do seu jeito.
      </Text>
    </Pressable>
  );
}
