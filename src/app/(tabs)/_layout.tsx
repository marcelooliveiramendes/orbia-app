import { router, Tabs } from 'expo-router';
import { Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { demoUser } from '@/mocks/seed';
import { useTheme } from '@/theme/ThemeProvider';
import { lime } from '@/theme/tokens';

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Icon name="home" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="areas"
        options={{
          title: 'Áreas',
          tabBarIcon: ({ color }) => <Icon name="areas" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="criar"
        options={{
          title: '',
          tabBarIcon: () => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
                backgroundColor: lime,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -12,
              }}
            >
              <Icon name="plus" color="#09090B" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/criar-rapido');
          },
        }}
      />
      <Tabs.Screen
        name="atividade"
        options={{
          title: 'Atividade',
          tabBarIcon: ({ color }) => <Icon name="atividade" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Você',
          tabBarIcon: () => (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                backgroundColor: colors.tile,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.ink, fontSize: 10, fontFamily: 'Geist_600SemiBold' }}>{demoUser.initials}</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
