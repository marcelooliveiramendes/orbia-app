import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Circle, Path, Svg } from 'react-native-svg';

import { Icon } from '@/components/Icon';
import { useComprasScanService } from '@/services/comprasScanService';

export default function CameraScreen() {
  const { type, listId } = useLocalSearchParams<{ type: 'manuscrita' | 'cupom'; listId?: string }>();
  const startScan = useComprasScanService((s) => s.startScan);
  const [lendo, setLendo] = useState(false);
  const isManuscrita = type === 'manuscrita';

  useEffect(() => {
    startScan(listId || null);
  }, [listId, startScan]);

  function fotografar() {
    setLendo(true);
    setTimeout(() => {
      setLendo(false);
      router.replace(isManuscrita ? '/compras/revisao-ocr' : '/compras/revisao-cupom');
    }, 1100);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0D' }}>
      <View
        style={{
          position: 'absolute',
          top: 96,
          left: 0,
          right: 0,
          height: 500,
          backgroundColor: '#2A2521',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isManuscrita ? (
          <View
            style={{
              width: 250,
              height: 300,
              backgroundColor: '#F3EFE4',
              transform: [{ rotate: '-3deg' }],
              padding: 24,
              gap: 4,
            }}
          >
            <Text style={{ fontFamily: 'Geist_500Medium', fontSize: 18, color: '#1F2A44', textDecorationLine: 'underline' }}>mercado</Text>
            {['pão de forma', 'ovos 12', 'maçã 6', 'requeijão', 'iogurte natural 4', 'esponja 2?'].map((l) => (
              <Text key={l} style={{ fontFamily: 'Geist_500Medium', fontSize: 17, color: '#1F2A44' }}>
                - {l}
              </Text>
            ))}
          </View>
        ) : (
          <View style={{ width: 200, height: 320, backgroundColor: '#FBFBF8', transform: [{ rotate: '2deg' }], padding: 14, gap: 2 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Geist_600SemiBold', fontSize: 11, color: '#3B3B3B' }}>MERCADO PÃO DE MEL</Text>
            <Text style={{ textAlign: 'center', fontSize: 9, color: '#3B3B3B' }}>DOCUMENTO AUXILIAR DA NFC-e</Text>
            <Text style={{ fontSize: 9, color: '#3B3B3B' }}>--------------------------------</Text>
            {['ARROZ BRANCO 5KG   1x27,90', 'FEIJAO CARIOCA 1KG 2x8,49', 'LEITE INTEGRAL 1L  6x5,29', 'BANANA PRATA KG 1,215x6,99'].map((l) => (
              <Text key={l} style={{ fontSize: 9, color: '#3B3B3B' }}>
                {l}
              </Text>
            ))}
            <Text style={{ fontSize: 9, color: '#3B3B3B' }}>--------------------------------</Text>
            <Text style={{ fontWeight: '700', fontSize: 10, color: '#3B3B3B' }}>TOTAL R$              187,46</Text>
            <Text style={{ fontSize: 9, color: '#3B3B3B' }}>12/11/2026 13:52</Text>
          </View>
        )}

        <View style={{ position: 'absolute', top: 44, left: 40, right: 40, bottom: 44 }}>
          {(['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'] as const).map((pos, i) => {
            const isTop = i < 2;
            const isLeft = i % 2 === 0;
            return (
              <View
                key={pos}
                style={{
                  position: 'absolute',
                  width: 28,
                  height: 28,
                  [isTop ? 'top' : 'bottom']: 0,
                  [isLeft ? 'left' : 'right']: 0,
                  borderTopWidth: isTop ? 3 : 0,
                  borderBottomWidth: isTop ? 0 : 3,
                  borderLeftWidth: isLeft ? 3 : 0,
                  borderRightWidth: isLeft ? 0 : 3,
                  borderColor: '#C7FF3D',
                }}
              />
            );
          })}
        </View>
      </View>

      <View style={{ position: 'absolute', top: 44, left: 8, right: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.replace(listId ? `/compras/${listId}` : '/compras')} accessibilityLabel="Fechar câmera" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" color="#F5F5F2" />
        </Pressable>
        <Text style={{ color: '#F5F5F2', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>{isManuscrita ? 'Lista escrita' : 'Cupom fiscal'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ position: 'absolute', top: 612, left: 20, right: 20, alignItems: 'center', gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#C7FF3D' }} />
          <Text style={{ color: '#F5F5F2', fontSize: 15, fontFamily: 'Geist_500Medium' }}>
            {isManuscrita ? 'Lista enquadrada' : 'QR da NFC-e encontrado'}
          </Text>
        </View>
        <Text style={{ color: '#B4B4BB', fontSize: 13, textAlign: 'center' }}>
          {isManuscrita ? 'Boa luz e a folha inteira no quadro ajudam na leitura.' : 'Se o QR não puder ser consultado, lemos o texto do cupom.'}
        </Text>
        {!isManuscrita ? (
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
            <Pressable onPress={() => router.push('/compras/erro')}>
              <Text style={{ color: '#B4B4BB', fontSize: 12, textDecorationLine: 'underline' }}>Simular leitura falha</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/compras/duplicado')}>
              <Text style={{ color: '#B4B4BB', fontSize: 12, textDecorationLine: 'underline' }}>Simular cupom duplicado</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24 }}>
        <View style={{ width: 64, alignItems: 'center', gap: 4 }}>
          <Icon name="image" color="#F5F5F2" />
          <Text style={{ color: '#F5F5F2', fontSize: 12, fontFamily: 'Geist_500Medium' }}>Galeria</Text>
        </View>
        <Pressable
          onPress={fotografar}
          accessibilityLabel="Fotografar"
          style={{ width: 76, height: 76, borderRadius: 999, borderWidth: 4, borderColor: '#F5F5F2', padding: 4 }}
        >
          <View style={{ flex: 1, borderRadius: 999, backgroundColor: '#F5F5F2' }} />
        </Pressable>
        <Pressable
          onPress={() => router.replace(listId ? `/compras/${listId}` : '/compras')}
          style={{ width: 64, alignItems: 'center', gap: 4 }}
        >
          <Icon name="keyboard" color="#F5F5F2" />
          <Text style={{ color: '#F5F5F2', fontSize: 12, fontFamily: 'Geist_500Medium' }}>Digitar</Text>
        </Pressable>
      </View>

      {lendo ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9,9,11,0.72)', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Svg width={40} height={40} viewBox="0 0 40 40">
            <Circle cx={20} cy={20} r={16} fill="none" stroke="#2E2E35" strokeWidth={3} />
            <Path d="M20 4a16 16 0 0 1 16 16" fill="none" stroke="#C7FF3D" strokeWidth={3} strokeLinecap="round" />
            <Circle cx={36} cy={20} r={4} fill="#C7FF3D" />
          </Svg>
          <Text style={{ color: '#F5F5F2', fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>
            {isManuscrita ? 'Lendo sua lista…' : 'Lendo o cupom…'}
          </Text>
          <Text style={{ color: '#B4B4BB', fontSize: 13 }}>Nada é salvo até você revisar.</Text>
        </View>
      ) : null}
    </View>
  );
}
