import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { typography } from '@/theme/tokens';
import { useToast } from './useToast';

// Toast sempre em tinta inversa (surface claro sobre fundo escuro/claro), per Sistema.dc.html.
export function ToastHost() {
  const { message, actionLabel, onAction, hide } = useToast();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 4000);
    return () => clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' }}
    >
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          minHeight: 52,
          borderRadius: 16,
          backgroundColor: '#F5F5F2',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          minWidth: 280,
        }}
      >
        <Text style={{ color: '#09090B', fontSize: typography.body.fontSize - 1, flex: 1 }} numberOfLines={2}>
          {message}
        </Text>
        {actionLabel ? (
          <Pressable
            onPress={() => {
              onAction?.();
              hide();
            }}
            hitSlop={8}
            style={{ marginLeft: 12 }}
          >
            <Text
              style={{
                color: '#09090B',
                fontSize: typography.body.fontSize - 1,
                fontFamily: 'Geist_600SemiBold',
                textDecorationLine: 'underline',
              }}
            >
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
