import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AmountKeypad } from '@/components/AmountKeypad';
import { Icon } from '@/components/Icon';
import { PickerField } from '@/components/PickerField';
import { SegmentedControl } from '@/components/SegmentedControl';
import { useToast } from '@/components/useToast';
import { useFinanceService } from '@/services/financeService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';
import type { TransactionType } from '@/types';
import { formatCentsToBRL } from '@/utils/money';

const DESPESA_CATS = ['Alimentação', 'Mercado', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Outros'];
const RECEITA_CATS = ['Salário', 'Freelance', 'Reembolso', 'Outros'];
const CONTAS = ['Nubank', 'Itaú', 'Dinheiro'];
const DATAS = ['Hoje', 'Ontem', 'Outra data'];
const NOTAS = ['Sem nota', 'Reembolsável', 'Dividido'];

type PickerKey = 'conta' | 'categoria' | 'data' | 'nota' | null;

export default function FinancasNovaScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const params = useLocalSearchParams<{ tipo?: string }>();
  const addTransaction = useFinanceService((s) => s.addTransaction);
  const accounts = useFinanceService((s) => s.accounts);

  const [tipo, setTipo] = useState<TransactionType>(params.tipo === 'receita' ? 'income' : 'expense');
  const [amountCents, setAmountCents] = useState(0);
  const [conta, setConta] = useState('');
  const [categoria, setCategoria] = useState(tipo === 'expense' ? DESPESA_CATS[0] : RECEITA_CATS[0]);
  const [data, setData] = useState(DATAS[0]);
  const [nota, setNota] = useState('');
  const [openPicker, setOpenPicker] = useState<PickerKey>(null);

  const isDespesa = tipo === 'expense';
  const categorias = isDespesa ? DESPESA_CATS : RECEITA_CATS;
  const podeSalvar = amountCents > 0 && !!conta;
  const motivo = amountCents <= 0 ? 'Digite o valor.' : !conta ? 'Escolha a conta.' : '';

  function handleTipoChange(novoTipo: TransactionType) {
    setTipo(novoTipo);
    setCategoria(novoTipo === 'expense' ? DESPESA_CATS[0] : RECEITA_CATS[0]);
    setOpenPicker(null);
  }

  function handleSalvar() {
    if (!podeSalvar) return;
    const account = accounts.find((a) => a.name === conta);
    const occurredDate = new Date();
    if (data === 'Ontem') occurredDate.setDate(occurredDate.getDate() - 1);

    addTransaction({
      type: tipo,
      amountCents,
      categoryName: categoria,
      accountId: account?.id ?? accounts[0].id,
      occurredAt: occurredDate.toISOString(),
      note: nota && nota !== 'Sem nota' ? nota : undefined,
    });
    toast.show(`${isDespesa ? 'Despesa' : 'Receita'} de ${formatCentsToBRL(amountCents)} registrada`);
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 44, paddingBottom: 4, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Voltar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" color={colors.ink} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
          {isDespesa ? 'Nova despesa' : 'Nova receita'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, gap: 14 }}>
        <SegmentedControl
          options={[
            { value: 'expense' as TransactionType, label: 'Despesa' },
            { value: 'income' as TransactionType, label: 'Receita' },
          ]}
          value={tipo}
          onChange={handleTipoChange}
        />
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Valor</Text>
          <Text
            style={{
              color: amountCents > 0 ? colors.ink : colors.muted,
              fontSize: 40,
              fontFamily: 'Geist_600SemiBold',
              fontVariant: ['tabular-nums'],
            }}
          >
            {formatCentsToBRL(amountCents)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <View style={{ width: '48%' }}>
            <PickerField
              label="Conta"
              value={conta || undefined}
              placeholder="Escolher"
              warn={!conta}
              open={openPicker === 'conta'}
              onToggle={() => setOpenPicker((p) => (p === 'conta' ? null : 'conta'))}
              options={CONTAS}
              onPick={(v) => {
                setConta(v);
                setOpenPicker(null);
              }}
            />
          </View>
          <View style={{ width: '48%' }}>
            <PickerField
              label={isDespesa ? 'Categoria' : 'Origem'}
              value={categoria}
              placeholder="Escolher"
              open={openPicker === 'categoria'}
              onToggle={() => setOpenPicker((p) => (p === 'categoria' ? null : 'categoria'))}
              options={categorias}
              onPick={(v) => {
                setCategoria(v);
                setOpenPicker(null);
              }}
            />
          </View>
          <View style={{ width: '48%' }}>
            <PickerField
              label="Data"
              value={data}
              placeholder="Hoje"
              open={openPicker === 'data'}
              onToggle={() => setOpenPicker((p) => (p === 'data' ? null : 'data'))}
              options={DATAS}
              onPick={(v) => {
                setData(v);
                setOpenPicker(null);
              }}
            />
          </View>
          <View style={{ width: '48%' }}>
            <PickerField
              label="Nota · opcional"
              value={nota || undefined}
              placeholder="Sem nota"
              open={openPicker === 'nota'}
              onToggle={() => setOpenPicker((p) => (p === 'nota' ? null : 'nota'))}
              options={NOTAS}
              onPick={(v) => {
                setNota(v === 'Sem nota' ? '' : v);
                setOpenPicker(null);
              }}
            />
          </View>
        </View>

        <AmountKeypad amountCents={amountCents} onChange={setAmountCents} />
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 32, paddingTop: 8, gap: 8 }}>
        {motivo ? (
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>{motivo}</Text>
        ) : null}
        <Pressable
          onPress={handleSalvar}
          disabled={!podeSalvar}
          style={{
            height: 52,
            minHeight: minTouchTarget,
            borderRadius: radii.pill,
            backgroundColor: podeSalvar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeSalvar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
            {isDespesa ? 'Registrar despesa' : 'Registrar receita'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
