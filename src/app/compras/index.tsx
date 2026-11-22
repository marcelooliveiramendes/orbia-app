import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Input } from '@/components/Input';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, spacing, typography } from '@/theme/tokens';

const HISTORICO_DEMO = [
  { t: 'Churrasco de sábado', d: '14 itens · concluída em 07/11', v: 'R$ 312,40' },
  { t: 'Mercado', d: '18 itens · concluída em 31/10', v: 'R$ 426,15' },
];

export default function ComprasIndexScreen() {
  const { colors } = useTheme();
  const lists = useShoppingService((s) => s.lists);
  const createList = useShoppingService((s) => s.createList);
  const [novaListaNome, setNovaListaNome] = useState('');
  const [criandoLista, setCriandoLista] = useState(false);

  const activeLists = lists.filter((l) => !l.archivedAt);
  const faltamTotal = activeLists.reduce((sum, l) => sum + l.items.filter((i) => !i.checkedAt).length, 0);

  function handleCriarLista() {
    if (!novaListaNome.trim()) return;
    const created = createList(novaListaNome.trim());
    setNovaListaNome('');
    setCriandoLista(false);
    router.push(`/compras/${created.id}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 52, paddingBottom: 124, gap: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, marginLeft: -4 }}>
            <Icon name="back" color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}>Áreas</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/compras/escanear')}
            accessibilityLabel="Escanear"
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="camera" color={colors.ink} />
          </Pressable>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Compras</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            {activeLists.length} listas ativas · {faltamTotal} itens faltando
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold' }}>Listas ativas</Text>
          {activeLists.map((list) => {
            const total = list.items.length;
            const feitos = list.items.filter((i) => i.checkedAt).length;
            const pct = total ? (feitos / total) * 100 : 0;
            const proximos = list.items.filter((i) => !i.checkedAt).slice(0, 3).map((i) => i.name.toLowerCase()).join(', ');
            return (
              <Pressable
                key={list.id}
                onPress={() => router.push(`/compras/${list.id}`)}
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: colors.line,
                  backgroundColor: colors.surface,
                  borderRadius: radii.card,
                  padding: 16,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ color: colors.ink, fontSize: 18, fontFamily: 'Geist_600SemiBold' }}>{list.title}</Text>
                  <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
                    {feitos} de {total}
                  </Text>
                </View>
                <View style={{ height: 4, borderRadius: 999, backgroundColor: colors.tile, overflow: 'hidden' }}>
                  <View style={{ height: 4, borderRadius: 999, width: `${pct}%`, backgroundColor: colors.ink }} />
                </View>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
                  {total - feitos > 0 ? `próximos: ${proximos}` : 'Tudo comprado'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {criandoLista ? (
          <View style={{ gap: 10 }}>
            <Input
              label="Nome da lista"
              value={novaListaNome}
              onChangeText={setNovaListaNome}
              autoFocus
              placeholder="Ex.: Mercado do mês"
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={handleCriarLista}
                style={{ flex: 1, height: 48, borderRadius: radii.pill, backgroundColor: '#C7FF3D', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#09090B', fontSize: 15, fontFamily: 'Geist_600SemiBold' }}>Criar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCriandoLista(false);
                  setNovaListaNome('');
                }}
                style={{ flex: 1, height: 48, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => setCriandoLista(true)}
              style={{ flex: 1, height: 52, borderRadius: radii.pill, backgroundColor: '#C7FF3D', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="plus" size={20} strokeWidth={2} color="#09090B" />
              <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Nova lista</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/compras/escanear')}
              style={{ flex: 1, height: 52, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="camera" size={20} color={colors.ink} />
              <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Escanear</Text>
            </Pressable>
          </View>
        )}

        <View>
          <Text style={{ color: colors.ink, fontSize: typography.section.fontSize, fontFamily: 'Geist_600SemiBold', marginBottom: 4 }}>
            Concluídas
          </Text>
          {HISTORICO_DEMO.map((h) => (
            <View key={h.t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, borderBottomWidth: 1, borderBottomColor: colors.line }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{h.t}</Text>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{h.d}</Text>
              </View>
              <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{h.v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
