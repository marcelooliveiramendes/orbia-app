import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { Checkbox } from '@/components/Checkbox';
import { Icon } from '@/components/Icon';
import { useToast } from '@/components/useToast';
import { categoriaDe, useComprasScanService } from '@/services/comprasScanService';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, radii, spacing, typography } from '@/theme/tokens';

export default function RevisaoOcrScreen() {
  const { colors } = useTheme();
  const toast = useToast();
  const ocr = useComprasScanService((s) => s.ocr);
  const toggleOcrItem = useComprasScanService((s) => s.toggleOcrItem);
  const setOcrName = useComprasScanService((s) => s.setOcrName);
  const setOcrQuantity = useComprasScanService((s) => s.setOcrQuantity);
  const targetListId = useComprasScanService((s) => s.targetListId);
  const lists = useShoppingService((s) => s.lists);
  const addItem = useShoppingService((s) => s.addItem);

  const list = lists.find((l) => l.id === targetListId) ?? lists[0];
  const selectedCount = ocr.filter((o) => o.selected).length;
  const podeAdicionar = selectedCount > 0;

  function handleAdicionar() {
    if (!podeAdicionar || !list) return;
    for (const o of ocr) {
      if (!o.selected) continue;
      addItem(list.id, {
        name: o.name,
        quantity: /^\d+$/.test(o.quantity) ? Number(o.quantity) : 1,
        unit: /^\d+$/.test(o.quantity) ? 'un' : o.quantity,
        category: categoriaDe(o.name),
      });
    }
    toast.show(`${selectedCount} ${selectedCount === 1 ? 'item adicionado' : 'itens adicionados'}`);
    router.replace(`/compras/${list.id}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 44, paddingBottom: 8, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'manuscrita', listId: list?.id ?? '' } })} accessibilityLabel="Voltar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="back" color={colors.ink} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color: colors.ink, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Lista escrita</Text>
        <Pressable onPress={() => router.replace(list ? `/compras/${list.id}` : '/compras')} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>Confira os itens</Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            Lemos {ocr.length} itens da sua foto. Toque no nome ou na quantidade para corrigir.
          </Text>
        </View>

        <View>
          {ocr.map((o) => (
            <View
              key={o.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                minHeight: 60,
                borderBottomWidth: 1,
                borderBottomColor: colors.line,
                borderRadius: 12,
                paddingVertical: 6,
                backgroundColor: o.uncertain ? colors.warnBg : 'transparent',
                opacity: o.selected ? 1 : 0.55,
              }}
            >
              <Checkbox checked={o.selected} onChange={() => toggleOcrItem(o.id)} />
              <View style={{ flex: 1, gap: 2 }}>
                <TextInput
                  value={o.name}
                  onChangeText={(v) => setOcrName(o.id, v)}
                  style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium', padding: 0 }}
                />
                {o.uncertain ? (
                  <Text style={{ color: colors.warnInk, fontSize: 12, fontFamily: 'Geist_500Medium' }}>{o.uncertain}</Text>
                ) : null}
              </View>
              <TextInput
                value={o.quantity}
                onChangeText={(v) => setOcrQuantity(o.id, v)}
                style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium', width: 60, textAlign: 'right', padding: 0 }}
              />
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 52,
            borderRadius: 14,
            backgroundColor: colors.tile,
            paddingHorizontal: 14,
          }}
        >
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Adicionar em</Text>
          <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_600SemiBold' }}>{list?.title}</Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 32, gap: 8, borderTopWidth: 1, borderTopColor: colors.line }}>
        <Pressable
          onPress={handleAdicionar}
          disabled={!podeAdicionar}
          style={{
            height: 52,
            minHeight: minTouchTarget,
            borderRadius: radii.pill,
            backgroundColor: podeAdicionar ? '#C7FF3D' : colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: podeAdicionar ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
            {selectedCount === 1 ? 'Adicionar 1 item à lista' : `Adicionar ${selectedCount} itens à lista`}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'manuscrita', listId: list?.id ?? '' } })}
          style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Tirar outra foto</Text>
        </Pressable>
      </View>
    </View>
  );
}
