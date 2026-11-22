import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing } from '@/theme/tokens';

// Wrapper visual de bottom sheet (indicador de arraste + topo arredondado).
// Navegação real do sheet (abrir/fechar) fica a cargo da rota modal que o hospeda.
export function AppSheet({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const { colors } = useTheme();

  const body = (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 24 }}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={{
          alignSelf: 'center',
          width: 36,
          height: 4,
          borderRadius: radii.pill,
          backgroundColor: colors.control,
          marginTop: 10,
          marginBottom: 16,
        }}
      />
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </KeyboardAvoidingView>
  );
}
