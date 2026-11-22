import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Checkbox } from '@/components/Checkbox';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import { categoriaDe } from '@/services/comprasScanService';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';
import type { ShoppingItem } from '@/types';

const ORDEM = ['Hortifruti', 'Laticínios', 'Padaria', 'Mercearia', 'Limpeza', 'Farmácia', 'Outros', 'Mercado', 'Açougue'];

export default function ListaDetalheScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lists = useShoppingService((s) => s.lists);
  const addItem = useShoppingService((s) => s.addItem);
  const toggleItem = useShoppingService((s) => s.toggleItem);
  const [novoNome, setNovoNome] = useState('');

  const list = lists.find((l) => l.id === id);

  if (!list) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Lista não encontrada.</Text>
      </View>
    );
  }

  const total = list.items.length;
  const feitos = list.items.filter((i) => i.checkedAt).length;
  const pct = total ? (feitos / total) * 100 : 0;

  const pendentes = list.items.filter((i) => !i.checkedAt);
  const comprados = list.items.filter((i) => i.checkedAt);
  const grupos = ORDEM.map((nome) => ({ nome, itens: pendentes.filter((i) => i.category === nome) })).filter((g) => g.itens.length);
  const outrasCategorias = [...new Set(pendentes.map((i) => i.category))].filter((c) => !ORDEM.includes(c));
  for (const cat of outrasCategorias) grupos.push({ nome: cat, itens: pendentes.filter((i) => i.category === cat) });
  if (comprados.length) grupos.push({ nome: `Comprados · ${comprados.length}`, itens: comprados });

  const listId = list.id;

  const handleAdicionar = () => {
    const raw = novoNome.trim();
    if (!raw) return;
    const match = raw.match(/^(\d+)\s+(.+)$/);
    const nome = match ? match[2] : raw;
    const quantidade = match ? Number(match[1]) : 1;
    const nomeCapitalizado = nome.charAt(0).toUpperCase() + nome.slice(1);
    addItem(listId, { name: nomeCapitalizado, quantity: quantidade, unit: 'un', category: categoriaDe(nomeCapitalizado) });
    toast.show(`"${nomeCapitalizado}" adicionado`);
    setNovoNome('');
  };

  const renderItem = (item: ShoppingItem) => {
    return (
      <View
        key={item.id}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.line }}
      >
        <Checkbox checked={!!item.checkedAt} onChange={() => toggleItem(listId, item.id)} />
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            color: item.checkedAt ? colors.muted : colors.ink,
            textDecorationLine: item.checkedAt ? 'line-through' : 'none',
          }}
        >
          {item.name}
        </Text>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
          {item.quantity} {item.unit}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 196, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.replace('/compras')} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4 }}>
            <Icon name="back" color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Compras</Text>
          </Pressable>
          <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="dots" color={colors.ink} />
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>{list.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: colors.tile, overflow: 'hidden' }}>
              <View style={{ height: 4, borderRadius: 999, width: `${pct}%`, backgroundColor: colors.ink }} />
            </View>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, fontVariant: ['tabular-nums'] }}>
              {feitos} de {total} comprados
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            value={novoNome}
            onChangeText={setNovoNome}
            onSubmitEditing={handleAdicionar}
            placeholder="Adicionar item, ex.: 2 iogurtes"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              height: 48,
              borderRadius: radii.field,
              borderWidth: 1,
              borderColor: colors.control,
              backgroundColor: colors.surface,
              color: colors.ink,
              paddingHorizontal: 14,
              fontSize: 16,
            }}
          />
          <Pressable
            onPress={handleAdicionar}
            accessibilityLabel="Adicionar"
            style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="plus" color={colors.bg} strokeWidth={2} />
          </Pressable>
        </View>

        {grupos.map((g) => (
          <View key={g.nome}>
            <Text style={{ color: colors.muted, fontSize: 14, fontFamily: 'Geist_600SemiBold', marginBottom: 2 }}>{g.nome}</Text>
            {g.itens.map(renderItem)}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: spacing.screenMargin,
          paddingVertical: 12,
          backgroundColor: colors.bg,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => router.push({ pathname: '/compras/escanear', params: { listId: list.id } })}
          style={{ flex: 1, height: 48, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="camera" size={20} color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Escanear</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'cupom', listId: list.id } })}
          style={{ flex: 1, height: 48, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="receipt" size={20} color={colors.ink} />
          <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Registrar cupom</Text>
        </Pressable>
      </View>
    </View>
  );
}
