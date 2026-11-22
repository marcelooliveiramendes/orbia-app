import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { useOnboardingService } from '@/services/onboardingService';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme/tokens';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function AuthForm({ mode }: { mode: 'entrar' | 'cadastrar' }) {
  const { colors } = useTheme();
  const complete = useOnboardingService((s) => s.complete);
  const isCadastrar = mode === 'cadastrar';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [termos, setTermos] = useState(false);
  const [tentou, setTentou] = useState(false);

  const emailOk = EMAIL_RE.test(email);
  const senhaOk = senha.length >= 8;
  const formOk = emailOk && senhaOk && (!isCadastrar || (nome.trim().length > 0 && termos));

  function handlePrimaryPress() {
    if (!formOk) {
      setTentou(true);
      return;
    }
    // Mock local: sem backend ainda. Só marca onboarding como concluído.
    complete();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.screenMargin, paddingTop: 60, paddingBottom: 32, gap: 24 }}>
        <Logo />
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            {isCadastrar ? 'Criar conta' : 'Entrar'}
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            {isCadastrar
              ? 'Seus dados ficam só com você. Você revisa tudo antes de salvar.'
              : 'Que bom ver você de novo.'}
          </Text>
        </View>

        <View style={{ gap: 16, flex: 1 }}>
          {isCadastrar ? (
            <Input label="Nome" autoComplete="name" value={nome} onChangeText={setNome} />
          ) : null}
          <Input
            label="E-mail"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={tentou && !emailOk ? 'Confira o e-mail: falta o @ ou o domínio.' : undefined}
          />
          <View style={{ gap: 6 }}>
            <Input
              label="Senha"
              autoComplete={isCadastrar ? 'new-password' : 'current-password'}
              secureTextEntry={!verSenha}
              value={senha}
              onChangeText={setSenha}
              style={{ paddingRight: 52 }}
            />
            <Pressable
              onPress={() => setVerSenha((v) => !v)}
              accessibilityLabel={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              style={{ position: 'absolute', right: 2, top: 30, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name={verSenha ? 'eyeoff' : 'eye'} color={colors.muted} size={20} />
            </Pressable>
            <Text style={{ color: tentou && !senhaOk ? colors.negative : colors.muted, fontSize: typography.meta.fontSize }}>
              Pelo menos 8 caracteres.
            </Text>
          </View>

          {!isCadastrar ? (
            <Pressable style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
              <Text
                style={{
                  color: colors.ink,
                  fontSize: typography.body.fontSize - 1,
                  fontFamily: 'Geist_500Medium',
                  textDecorationLine: 'underline',
                }}
              >
                Esqueci a senha
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setTermos((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: termos }}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}
            >
              <Checkbox checked={termos} onChange={setTermos} />
              <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 2, lineHeight: 20, flex: 1 }}>
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </Text>
            </Pressable>
          )}
        </View>

        <View style={{ gap: 12 }}>
          <Button label={isCadastrar ? 'Criar conta' : 'Entrar'} onPress={handlePrimaryPress} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>ou</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          </View>
          <Button label="Continuar com Google · em breve" variant="secondary" disabled />
          <Pressable
            onPress={() => router.replace(isCadastrar ? '/acesso/entrar' : '/acesso/cadastrar')}
            style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize - 1, fontFamily: 'Geist_500Medium' }}>
              {isCadastrar ? 'Já tenho conta · Entrar' : 'Não tem conta? Criar conta'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
