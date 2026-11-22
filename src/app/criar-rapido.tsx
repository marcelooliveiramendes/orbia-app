import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AmountKeypad } from '@/components/AmountKeypad';
import { ChipGroup } from '@/components/ChipGroup';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Icon, type IconName } from '@/components/Icon';
import { Input } from '@/components/Input';
import { PickerField } from '@/components/PickerField';
import { useToast } from '@/components/useToast';
import { parseCommand, type ParsedItem } from '@/services/intentParser';
import { useActivityService } from '@/services/activityService';
import { useAgendaService } from '@/services/agendaService';
import { useFinanceService } from '@/services/financeService';
import { useHealthService } from '@/services/healthService';
import { useShoppingService } from '@/services/shoppingService';
import { useTheme } from '@/theme/ThemeProvider';
import { lime, minTouchTarget, radii, spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

type Tela =
  | 'grade'
  | 'mais'
  | 'interpretando'
  | 'previa'
  | 'esclarecer'
  | 'camera'
  | 'vozPermissao'
  | 'vozOuvindo'
  | 'vozPausado'
  | 'vozTranscrevendo'
  | 'vozTranscricao'
  | 'vozSemFala'
  | 'vozErroRede'
  | 'salvando'
  | 'sucesso'
  | 'formGasto'
  | 'formGanho'
  | 'formCompromisso'
  | 'formLista'
  | 'formRefeicao'
  | 'formTreino';

const TITULOS: Record<Tela, string> = {
  grade: 'Criar rápido',
  mais: 'Mais ações',
  interpretando: 'Criar rápido',
  previa: 'Confira antes de salvar',
  esclarecer: 'Só para confirmar',
  camera: 'Escanear nota',
  vozPermissao: 'Falar com a Orbia',
  vozOuvindo: 'Falar com a Orbia',
  vozPausado: 'Falar com a Orbia',
  vozTranscrevendo: 'Falar com a Orbia',
  vozTranscricao: 'Confira o que ouvimos',
  vozSemFala: 'Falar com a Orbia',
  vozErroRede: 'Falar com a Orbia',
  salvando: 'Salvando',
  sucesso: 'Pronto',
  formGasto: 'Adicionar gasto',
  formGanho: 'Registrar ganho',
  formCompromisso: 'Compromisso',
  formLista: 'Lista de compras',
  formRefeicao: 'Refeição',
  formTreino: 'Treino',
};

const HAS_BACK: Tela[] = ['mais', 'previa', 'camera', 'vozTranscricao', 'vozSemFala', 'vozErroRede', 'vozPermissao', 'formGasto', 'formGanho', 'formCompromisso', 'formLista', 'formRefeicao', 'formTreino'];

export default function CriarRapidoModal() {
  const { colors } = useTheme();
  const toast = useToast();

  const [tela, setTela] = useState<Tela>('grade');
  const [texto, setTexto] = useState('');
  const [origem, setOrigem] = useState<'texto' | 'voz'>('texto');
  const [items, setItems] = useState<ParsedItem[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [desligados, setDesligados] = useState<Record<string, boolean>>({});
  const [confirmFechar, setConfirmFechar] = useState(false);
  const [seg, setSeg] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (toRef.current) clearTimeout(toRef.current);
    };
  }, []);

  const temTexto = texto.trim().length > 0;

  function fechar() {
    if (temTexto && ['grade', 'esclarecer', 'vozTranscricao'].includes(tela)) {
      setConfirmFechar(true);
      return;
    }
    router.back();
  }

  function voltar() {
    if (tela.startsWith('form')) {
      setTela('grade');
      return;
    }
    if (['previa', 'esclarecer', 'camera', 'vozTranscricao', 'vozSemFala', 'vozErroRede', 'vozPermissao'].includes(tela)) {
      setTela('grade');
      return;
    }
    setTela('grade');
  }

  function interpretar(src: 'texto' | 'voz') {
    if (timerRef.current) clearInterval(timerRef.current);
    setOrigem(src);
    setTela('interpretando');
    toRef.current = setTimeout(() => {
      const result = parseCommand(texto);
      if (result.kind === 'camera') {
        setTela('camera');
      } else if (result.kind === 'esclarecer') {
        setTela('esclarecer');
      } else {
        setItems(result.items);
        setRespostas({});
        setDesligados({});
        setTela('previa');
      }
    }, 900);
  }

  function abrirForm(t: Tela) {
    setTela(t);
  }

  function salvarItens(ativos: ParsedItem[]) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      for (const item of ativos) {
        persistItem(item, respostas[item.id]);
      }
      setItems(ativos);
      setTela('sucesso');
    }, 700);
  }

  function handleEnviar() {
    if (!temTexto) return;
    interpretar('texto');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet }}>
      <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: radii.pill, backgroundColor: colors.control, marginTop: 8 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 56, paddingHorizontal: 8, paddingLeft: 20 }}>
        {HAS_BACK.includes(tela) ? (
          <Pressable onPress={voltar} accessibilityLabel="Voltar" style={{ width: 44, height: 44, marginLeft: -12, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="back" color={colors.ink} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>{TITULOS[tela]}</Text>
          {tela === 'grade' ? <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: lime, marginLeft: 4 }} /> : null}
        </View>
        <Pressable onPress={fechar} accessibilityLabel="Fechar" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        {tela === 'grade' ? <GradeView onTile={abrirForm} onVerMais={() => setTela('mais')} /> : null}
        {tela === 'mais' ? <MaisView /> : null}
        {tela === 'interpretando' ? <InterpretandoView texto={texto} origem={origem} /> : null}
        {tela === 'camera' ? <CameraView texto={texto} origem={origem} /> : null}
        {tela === 'esclarecer' ? (
          <EsclarecerView
            texto={texto}
            onReescrever={() => setTela('grade')}
            onGasto={(valor) => {
              setTela('formGasto');
            }}
            onCompromisso={() => setTela('formCompromisso')}
          />
        ) : null}
        {tela === 'previa' ? (
          <PreviaView
            texto={texto}
            origem={origem}
            items={items}
            respostas={respostas}
            desligados={desligados}
            onToggle={(id) => setDesligados((d) => ({ ...d, [id]: !d[id] }))}
            onResponder={(id, v) => setRespostas((r) => ({ ...r, [id]: v }))}
            onEditarTexto={() => setTela('grade')}
          />
        ) : null}
        {['vozPermissao', 'vozOuvindo', 'vozPausado'].includes(tela) ? (
          <VozOuvindoView tela={tela} seg={seg} />
        ) : null}
        {tela === 'vozTranscrevendo' ? <VozTranscrevendoView /> : null}
        {tela === 'vozTranscricao' ? <VozTranscricaoView texto={texto} onChangeTexto={setTexto} /> : null}
        {tela === 'vozSemFala' || tela === 'vozErroRede' ? <VozErroView tipo={tela} /> : null}
        {tela === 'salvando' ? <SalvandoView items={items} /> : null}
        {tela === 'sucesso' ? <SucessoView items={items} respostas={respostas} onVerModulo={() => router.back()} /> : null}
        {tela === 'formGasto' || tela === 'formGanho' ? (
          <FormGastoGanho
            tipo={tela === 'formGasto' ? 'expense' : 'income'}
            onSalvar={(dados) => {
              setItems([
                {
                  id: tela === 'formGasto' ? 'fg' : 'fr',
                  kind: tela === 'formGasto' ? 'gasto' : 'ganho',
                  icon: tela === 'formGasto' ? 'financas' : 'income',
                  tipo: tela === 'formGasto' ? 'Despesa' : 'Receita',
                  modulo: 'Finanças',
                  titulo: `${formatCentsToBRL(dados.amountCents)} · ${dados.categoria}`,
                  fields: [],
                  need: null,
                  okLabel: () => `${tela === 'formGasto' ? 'Despesa' : 'Receita'} de ${formatCentsToBRL(dados.amountCents)} registrada`,
                  // dados extra pra persistência
                  valor: dados.amountCents / 100,
                },
              ]);
              setRespostas({ [tela === 'formGasto' ? 'fg' : 'fr']: dados.conta });
              salvarFormDireto({
                kind: tela === 'formGasto' ? 'expense' : 'income',
                amountCents: dados.amountCents,
                categoria: dados.categoria,
                conta: dados.conta,
                data: dados.data,
                nota: dados.nota,
              });
            }}
          />
        ) : null}
        {tela === 'formCompromisso' ? (
          <FormCompromisso
            onSalvar={(dados) => {
              salvarCompromisso(dados);
            }}
          />
        ) : null}
        {tela === 'formLista' ? <FormLista onSalvar={(dados) => salvarLista(dados)} /> : null}
        {tela === 'formRefeicao' ? <FormRefeicao onSalvar={(dados) => salvarRefeicao(dados)} /> : null}
        {tela === 'formTreino' ? <FormTreino onSalvar={(dados) => salvarTreino(dados)} /> : null}
      </ScrollView>

      {tela === 'grade' ? (
        <Composer
          texto={texto}
          onChangeTexto={setTexto}
          onEnviar={handleEnviar}
          onMic={() => setTela('vozPermissao')}
        />
      ) : null}

      {tela === 'previa' ? (
        <PreviaFooter
          items={items}
          respostas={respostas}
          desligados={desligados}
          onConfirmar={salvarItens}
          onManual={() => setTela('formGasto')}
        />
      ) : null}

      {tela === 'vozPermissao' ? (
        <CtaFooter
          label="Permitir microfone"
          onPress={() => {
            setSeg(0);
            setOrigem('voz');
            setTexto('');
            setTela('vozOuvindo');
            timerRef.current = setInterval(() => setSeg((s) => s + 1), 1000);
          }}
          secondaryLabel="Agora não"
          onSecondary={() => setTela('grade')}
        />
      ) : null}

      {['vozOuvindo', 'vozPausado'].includes(tela) ? (
        <VozFooter
          pausado={tela === 'vozPausado'}
          onCancelar={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setTela('grade');
            setTexto('');
            setSeg(0);
            toast.show('Gravação cancelada. Nada foi salvo.');
          }}
          onPausar={() => {
            if (tela === 'vozPausado') {
              setTela('vozOuvindo');
              timerRef.current = setInterval(() => setSeg((s) => s + 1), 1000);
            } else {
              if (timerRef.current) clearInterval(timerRef.current);
              setTela('vozPausado');
            }
          }}
          onParar={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (seg < 1) {
              setTela('vozSemFala');
              return;
            }
            setTela('vozTranscrevendo');
            toRef.current = setTimeout(() => {
              setTexto('Anota um treino de pernas e adiciona 500 ml de água');
              setTela('vozTranscricao');
            }, 1000);
          }}
        />
      ) : null}

      {tela === 'vozTranscricao' ? (
        <CtaFooter label="Interpretar" disabled={!temTexto} onPress={() => interpretar('voz')} />
      ) : null}

      {tela === 'vozSemFala' || tela === 'vozErroRede' ? (
        <VozErroFooter
          onTentar={() => {
            setSeg(0);
            setTexto('');
            setTela('vozOuvindo');
            timerRef.current = setInterval(() => setSeg((s) => s + 1), 1000);
          }}
          onDigitar={() => {
            setOrigem('texto');
            setTela('grade');
          }}
        />
      ) : null}

      {tela === 'sucesso' ? (
        <CtaFooter
          label="Criar outro"
          onPress={() => {
            setTexto('');
            setItems([]);
            setRespostas({});
            setDesligados({});
            setTela('grade');
          }}
        />
      ) : null}

      <ConfirmDialog
        visible={confirmFechar}
        title="Descartar o texto?"
        description={`"${texto}" ainda não foi salvo.`}
        confirmLabel="Continuar editando"
        cancelLabel="Descartar"
        onConfirm={() => setConfirmFechar(false)}
        onCancel={() => {
          setConfirmFechar(false);
          router.back();
        }}
      />
    </View>
  );

  // --- persistência real por módulo ---
  function persistItem(item: ParsedItem, resposta: string | undefined) {
    logActivity(item, resposta);
  }

  function logActivity(item: ParsedItem, resposta: string | undefined) {
    const areaMap: Record<ParsedItem['kind'], 'agenda' | 'financas' | 'saude' | 'treinos' | 'compras'> = {
      gasto: 'financas',
      ganho: 'financas',
      lista: 'compras',
      item: 'compras',
      compromisso: 'agenda',
      treino: 'treinos',
      agua: 'saude',
    };
    useActivityService.getState().log({ area: areaMap[item.kind], title: item.okLabel(resposta), description: item.modulo });

    if (item.kind === 'gasto' || item.kind === 'ganho') {
      const conta = resposta || 'Nubank';
      const account = useFinanceService.getState().accounts.find((a) => a.name === conta);
      useFinanceService.getState().addTransaction({
        type: item.kind === 'gasto' ? 'expense' : 'income',
        amountCents: Math.round((item.valor ?? 0) * 100),
        categoryName: item.fields.find((f) => f.k === 'Categoria' || f.k === 'Origem')?.v.replace(' (sugerida)', '') ?? 'Outros',
        accountId: account?.id ?? useFinanceService.getState().accounts[0].id,
        occurredAt: new Date().toISOString(),
      });
    }
    if (item.kind === 'lista') {
      const created = useShoppingService.getState().createList(item.titulo);
      const itensStr = item.fields.find((f) => f.k === 'Itens')?.v ?? '';
      for (const nome of itensStr.split(' · ').filter(Boolean)) {
        useShoppingService.getState().addItem(created.id, { name: nome, quantity: 1, unit: 'un', category: 'Outros' });
      }
    }
    if (item.kind === 'item') {
      const listaNome = resposta || 'Mercado da semana';
      const lists = useShoppingService.getState().lists;
      let list = lists.find((l) => l.title === listaNome);
      if (!list || listaNome === 'Nova lista') list = useShoppingService.getState().createList(listaNome === 'Nova lista' ? item.titulo : listaNome);
      useShoppingService.getState().addItem(list.id, { name: item.titulo, quantity: 1, unit: 'un', category: 'Outros' });
    }
    if (item.kind === 'compromisso') {
      const horaField = item.fields.find((f) => f.k === 'Horário')?.v;
      const hora = resposta || (horaField && horaField !== '—' ? horaField.split(' ')[0] : '09:00');
      const [hh, mm] = hora.split(':').map(Number);
      const d = new Date();
      d.setHours(hh || 9, mm || 0, 0, 0);
      useAgendaService.getState().addItem({
        kind: 'compromisso',
        title: item.titulo,
        startsAt: d.toISOString(),
        reminderLabel: 'Sem lembrete',
        repeatLabel: 'Não repete',
        createdAt: new Date().toISOString(),
      });
    }
    if (item.kind === 'agua') {
      const mlField = item.titulo.match(/\+(\d+)/);
      const ml = mlField ? Number(mlField[1]) : resposta ? parseInt(resposta, 10) || 250 : 250;
      useHealthService.getState().addWater(ml);
    }
  }

  function salvarFormDireto(dados: { kind: 'expense' | 'income'; amountCents: number; categoria: string; conta: string; data: string; nota?: string }) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      const account = useFinanceService.getState().accounts.find((a) => a.name === dados.conta);
      const occurredAt = new Date();
      if (dados.data === 'Ontem') occurredAt.setDate(occurredAt.getDate() - 1);
      useFinanceService.getState().addTransaction({
        type: dados.kind,
        amountCents: dados.amountCents,
        categoryName: dados.categoria,
        accountId: account?.id ?? useFinanceService.getState().accounts[0].id,
        occurredAt: occurredAt.toISOString(),
        note: dados.nota,
      });
      useActivityService.getState().log({
        area: 'financas',
        title: `${dados.kind === 'expense' ? 'Despesa' : 'Receita'} de ${formatCentsToBRL(dados.amountCents)} registrada`,
        description: `${dados.categoria} · ${dados.conta}`,
      });
      setTela('sucesso');
    }, 700);
  }

  function salvarCompromisso(dados: { titulo: string; data: string; hora: string; lembrete: string }) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      const d = new Date();
      if (dados.data === 'Amanhã') d.setDate(d.getDate() + 1);
      const [hh, mm] = dados.hora.split(':').map(Number);
      d.setHours(hh || 9, mm || 0, 0, 0);
      useAgendaService.getState().addItem({
        kind: 'compromisso',
        title: dados.titulo,
        startsAt: d.toISOString(),
        reminderLabel: dados.lembrete,
        repeatLabel: 'Não repete',
        createdAt: new Date().toISOString(),
      });
      useActivityService.getState().log({ area: 'agenda', title: `${dados.titulo} criado`, description: 'Agenda' });
      setItems([
        {
          id: 'fc',
          kind: 'compromisso',
          icon: 'agenda',
          tipo: 'Compromisso',
          modulo: 'Agenda',
          titulo: dados.titulo,
          fields: [],
          need: null,
          okLabel: () => `${dados.titulo} · ${dados.data}, ${dados.hora}`,
        },
      ]);
      setTela('sucesso');
    }, 700);
  }

  function salvarLista(dados: { nome: string; itens: string[] }) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      const created = useShoppingService.getState().createList(dados.nome);
      for (const nome of dados.itens) {
        useShoppingService.getState().addItem(created.id, { name: nome, quantity: 1, unit: 'un', category: 'Outros' });
      }
      useActivityService.getState().log({ area: 'compras', title: `Lista "${dados.nome}" criada`, description: `${dados.itens.length} itens · Compras` });
      setItems([
        {
          id: 'fl',
          kind: 'lista',
          icon: 'compras',
          tipo: 'Nova lista',
          modulo: 'Compras',
          titulo: dados.nome,
          fields: [],
          need: null,
          okLabel: () => `Lista "${dados.nome}" criada`,
        },
      ]);
      setTela('sucesso');
    }, 700);
  }

  function salvarRefeicao(dados: { tipo: string; comida: string; hora: string }) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      const [hh, mm] = dados.hora.split(':').map(Number);
      const d = new Date();
      d.setHours(hh || 14, mm || 0, 0, 0);
      useHealthService.getState().addFood(dados.tipo as never, dados.comida, d.toISOString());
      useActivityService.getState().log({ area: 'saude', title: `${dados.tipo} registrado`, description: dados.comida });
      setItems([
        {
          id: 'fm',
          kind: 'agua',
          icon: 'drop',
          tipo: 'Refeição',
          modulo: 'Saúde',
          titulo: dados.tipo,
          fields: [],
          need: null,
          okLabel: () => `${dados.tipo} registrado`,
        },
      ]);
      setTela('sucesso');
    }, 700);
  }

  function salvarTreino(dados: { treino: string; modo: string }) {
    setTela('salvando');
    toRef.current = setTimeout(() => {
      useActivityService.getState().log({ area: 'treinos', title: `Treino de ${dados.treino.toLowerCase()} registrado`, description: 'Treinos' });
      setItems([
        {
          id: 'ft',
          kind: 'treino',
          icon: 'treinos',
          tipo: 'Treino',
          modulo: 'Treinos',
          titulo: dados.treino,
          fields: [],
          need: null,
          okLabel: () => `Treino de ${dados.treino.toLowerCase()} registrado`,
        },
      ]);
      setTela('sucesso');
    }, 700);
  }
}

// --- subcomponentes de tela ---

function GradeView({ onTile, onVerMais }: { onTile: (t: Tela) => void; onVerMais: () => void }) {
  const { colors } = useTheme();
  const tiles: { icon: IconName; label: string; tela: Tela }[] = [
    { icon: 'compras', label: 'Lista de compras', tela: 'formLista' },
    { icon: 'financas', label: 'Adicionar gasto', tela: 'formGasto' },
    { icon: 'income', label: 'Registrar ganho', tela: 'formGanho' },
    { icon: 'agenda', label: 'Compromisso', tela: 'formCompromisso' },
    { icon: 'saude', label: 'Refeição', tela: 'formRefeicao' },
    { icon: 'treinos', label: 'Treino', tela: 'formTreino' },
  ];

  return (
    <View style={{ gap: 12, paddingTop: 4 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {tiles.map((t) => (
          <Pressable
            key={t.label}
            onPress={() => onTile(t.tela)}
            style={{ width: '47%', minHeight: 84, borderRadius: 18, backgroundColor: colors.tile, padding: 14, justifyContent: 'space-between', gap: 12 }}
          >
            <Icon name={t.icon} color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_600SemiBold' }}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={onVerMais} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 }}>
        <Text style={{ flex: 1, color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Ver mais ações</Text>
        <Text style={{ color: colors.muted, fontSize: 13 }}>Tarefa, água, escanear…</Text>
        <Icon name="chevron" size={18} color={colors.muted} />
      </Pressable>
    </View>
  );
}

function MaisView() {
  const { colors } = useTheme();
  const mais: { icon: IconName; t: string; d: string; href: Parameters<typeof router.push>[0] }[] = [
    { icon: 'check', t: 'Tarefa', d: 'Só um título; data é opcional', href: '/agenda/novo' },
    { icon: 'compras', t: 'Item na lista', d: 'Mercado da semana', href: '/compras' },
    { icon: 'drop', t: 'Água', d: '+250 ml com um toque', href: '/saude' },
    { icon: 'receipt', t: 'Escanear nota fiscal', d: 'QR da NFC-e ou leitura do cupom', href: '/compras/escanear' },
    { icon: 'listpen', t: 'Escanear lista escrita à mão', d: 'Você revisa antes de adicionar', href: '/compras/escanear' },
  ];

  return (
    <View>
      {mais.map((m, i) => (
        <Pressable
          key={m.t}
          onPress={() => router.replace(m.href)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 60, borderBottomWidth: i === mais.length - 1 ? 0 : 1, borderBottomColor: colors.line }}
        >
          <Icon name={m.icon} size={22} color={colors.muted} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{m.t}</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{m.d}</Text>
          </View>
          <Icon name="chevron" size={18} color={colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

function InterpretandoView({ texto, origem }: { texto: string; origem: 'texto' | 'voz' }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 20 }}>
      <Quote label={origem === 'voz' ? 'Você disse' : 'Você escreveu'} texto={texto} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon name="sparkle" color={lime} />
        <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>Interpretando seu pedido…</Text>
      </View>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 16, gap: 12 }}>
        <View style={{ width: '40%', height: 14, borderRadius: 6, backgroundColor: colors.tile }} />
        <View style={{ width: '55%', height: 24, borderRadius: 8, backgroundColor: colors.tile }} />
        <View style={{ width: '100%', height: 14, borderRadius: 6, backgroundColor: colors.tile }} />
      </View>
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Nada é salvo nesta etapa.</Text>
    </View>
  );
}

function CameraView({ texto, origem }: { texto: string; origem: 'texto' | 'voz' }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 16 }}>
      <Quote label={origem === 'voz' ? 'Você disse' : 'Você escreveu'} texto={texto} />
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, padding: 20, gap: 12 }}>
        <Icon name="receipt" size={28} color={colors.ink} />
        <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_600SemiBold' }}>Vamos escanear a nota</Text>
        <Text style={{ color: colors.muted, fontSize: typography.body.fontSize - 1 }}>
          Os valores só aparecem depois da leitura. Você revisa tudo antes de registrar.
        </Text>
        <Pressable
          onPress={() => router.replace({ pathname: '/compras/camera', params: { type: 'cupom' } })}
          style={{ height: 52, borderRadius: radii.pill, backgroundColor: lime, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="camera" size={20} color="#09090B" />
          <Text style={{ color: '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>Abrir câmera</Text>
        </Pressable>
      </View>
    </View>
  );
}

function EsclarecerView({
  texto,
  onReescrever,
  onGasto,
  onCompromisso,
}: {
  texto: string;
  onReescrever: () => void;
  onGasto: (valor: number) => void;
  onCompromisso: () => void;
}) {
  const { colors } = useTheme();
  const pagar = /\bpag(ar|a)\b/i.test(texto);
  const nums = texto.match(/\d[\d.,]*/);
  const valor = nums ? parseFloat(nums[0].replace(/\./g, '').replace(',', '.')) : 0;

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Seu texto, guardado</Text>
        <Text style={{ color: colors.ink, fontSize: 16 }}>{texto}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_600SemiBold' }}>
          {pagar ? 'Isso é um gasto ou um lembrete?' : 'Não entendi bem o pedido'}
        </Text>
        <Text style={{ color: colors.muted, fontSize: typography.body.fontSize - 1 }}>
          {pagar
            ? 'A Orbia não faz pagamentos nem transferências. Posso registrar o gasto ou lembrar você de pagar.'
            : 'Escolha o que você quer criar ou reescreva o texto acima.'}
        </Text>
      </View>
      <View style={{ gap: 8 }}>
        <RowCard icon="financas" t={valor ? `Registrar gasto de ${formatCentsToBRL(Math.round(valor * 100))}` : 'Registrar um gasto'} d="Finanças · você escolhe a conta" onPress={() => onGasto(valor)} />
        <RowCard icon="agenda" t={pagar ? 'Lembrar de pagar amanhã' : 'Criar compromisso'} d="Agenda" onPress={onCompromisso} />
        <RowCard icon="edit" t="Reescrever" d="Seu texto continua no campo" onPress={onReescrever} />
      </View>
    </View>
  );
}

function RowCard({ icon, t, d, onPress }: { icon: IconName; t: string; d: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ minHeight: 64, borderWidth: 1, borderColor: colors.line, borderRadius: radii.card, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14 }}>
      <Icon name={icon} size={22} color={colors.muted} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{t}</Text>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{d}</Text>
      </View>
      <Icon name="chevron" size={18} color={colors.muted} />
    </Pressable>
  );
}

function Quote({ label, texto }: { label: string; texto: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 4, padding: 14, borderRadius: 16, backgroundColor: colors.tile }}>
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{label}</Text>
      <Text style={{ color: colors.ink, fontSize: 16 }}>{`"${texto}"`}</Text>
    </View>
  );
}

function PreviaView({
  texto,
  origem,
  items,
  respostas,
  desligados,
  onToggle,
  onResponder,
  onEditarTexto,
}: {
  texto: string;
  origem: 'texto' | 'voz';
  items: ParsedItem[];
  respostas: Record<string, string>;
  desligados: Record<string, boolean>;
  onToggle: (id: string) => void;
  onResponder: (id: string, v: string) => void;
  onEditarTexto: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 4, padding: 14, borderRadius: 16, backgroundColor: colors.tile }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{origem === 'voz' ? 'Você disse' : 'Você escreveu'}</Text>
          <Pressable onPress={onEditarTexto}>
            <Text style={{ color: colors.ink, fontSize: 14, fontFamily: 'Geist_600SemiBold', textDecorationLine: 'underline' }}>Editar texto</Text>
          </Pressable>
        </View>
        <Text style={{ color: colors.ink, fontSize: 16 }}>{`"${texto}"`}</Text>
      </View>

      {items.map((item) => {
        const on = !desligados[item.id];
        const resposta = respostas[item.id];
        const erro = item.need?.isError;
        const pendente = on && item.need && (erro || !resposta);
        return (
          <View
            key={item.id}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: pendente ? colors.warnInk : colors.line,
              borderRadius: radii.card,
              padding: 16,
              gap: 10,
              opacity: on ? 1 : 0.55,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Pressable onPress={() => onToggle(item.id)} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>
                <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: on ? lime : 'transparent', borderWidth: on ? 0 : 1.5, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}>
                  {on ? <Icon name="check" size={18} color="#09090B" strokeWidth={2.25} /> : null}
                </View>
              </Pressable>
              <Icon name={item.icon} size={18} color={colors.muted} />
              <Text style={{ flex: 1, color: colors.muted, fontSize: 13 }}>
                {item.tipo} · {item.modulo}
              </Text>
            </View>
            <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>{item.titulo}</Text>
            {item.fields.map((f) => (
              <View key={f.k} style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 38, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.line }}>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{f.k}</Text>
                <Text style={{ color: colors.ink, fontSize: 15, fontVariant: ['tabular-nums'] }}>{f.v}</Text>
              </View>
            ))}
            {item.need ? (
              <View style={{ backgroundColor: erro ? '#FDECEA' : resposta ? colors.tile : colors.warnBg, borderRadius: 14, padding: 12, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name={erro ? 'alert' : resposta ? 'check' : 'info'} size={18} color={erro ? colors.negative : colors.warnInk} />
                  <Text style={{ color: erro ? colors.negative : colors.warnInk, fontSize: 14, fontFamily: 'Geist_600SemiBold', flex: 1 }}>{item.need.question}</Text>
                </View>
                {!erro ? <ChipGroup options={item.need.options} value={resposta ?? ''} onChange={(v) => onResponder(item.id, v)} /> : null}
              </View>
            ) : null}
          </View>
        );
      })}
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
        Interpretação simulada para demonstração. Revise cada item: nada é salvo antes de você confirmar.
      </Text>
    </View>
  );
}

function VozOuvindoView({ tela, seg }: { tela: Tela; seg: number }) {
  const { colors } = useTheme();

  if (tela === 'vozPermissao') {
    return (
      <View style={{ gap: 16, paddingTop: 8 }}>
        <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.tile, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="mic" size={28} color={colors.ink} />
        </View>
        <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>Usar o microfone?</Text>
        {[
          'A Orbia só ouve depois que você toca no microfone, e para quando você toca em Parar.',
          'O áudio vira texto e é descartado. Você revisa a transcrição antes de qualquer coisa.',
          'Nada é gravado em segundo plano. Você pode revogar em Você › Privacidade.',
        ].map((t) => (
          <Text key={t} style={{ color: colors.muted, fontSize: 15 }}>
            {t}
          </Text>
        ))}
      </View>
    );
  }

  const pausado = tela === 'vozPausado';
  const tempo = `00:${String(seg).padStart(2, '0')}`;
  const alturas = [10, 18, 26, 14, 32, 22, 38, 16, 28, 12, 34, 20, 30, 14, 24, 36, 18, 26, 12, 30, 20, 16, 24, 10];

  return (
    <View style={{ alignItems: 'center', gap: 18, paddingTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: pausado ? colors.tile : lime }} />
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_600SemiBold' }}>{pausado ? 'Pausado' : 'Ouvindo'}</Text>
      </View>
      <Text style={{ color: colors.ink, fontSize: 40, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>{tempo}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, height: 44 }}>
        {alturas.map((h, i) => (
          <View
            key={i}
            style={{
              width: 4,
              borderRadius: 999,
              height: pausado ? 4 : Math.max(4, Math.round(h * (0.6 + 0.4 * (((i + seg) % 5) / 4)))),
              backgroundColor: pausado ? colors.control : lime,
            }}
          />
        ))}
      </View>
      <Text style={{ color: colors.muted, fontSize: 16, textAlign: 'center', maxWidth: 300 }}>Fale naturalmente, como numa mensagem.</Text>
    </View>
  );
}

function VozTranscrevendoView() {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 16, paddingTop: 8 }}>
      <Text style={{ color: colors.ink, fontSize: 19, fontFamily: 'Geist_600SemiBold' }}>Transcrevendo…</Text>
      <View style={{ width: '100%', height: 16, borderRadius: 6, backgroundColor: colors.tile }} />
      <View style={{ width: '70%', height: 16, borderRadius: 6, backgroundColor: colors.tile }} />
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>O áudio é descartado assim que a transcrição termina.</Text>
    </View>
  );
}

function VozTranscricaoView({ texto, onChangeTexto }: { texto: string; onChangeTexto: (v: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Transcrição · você pode corrigir antes de seguir</Text>
      <TextInput
        value={texto}
        onChangeText={onChangeTexto}
        multiline
        style={{ minHeight: 72, borderWidth: 1, borderColor: colors.control, borderRadius: radii.field, backgroundColor: colors.surface, color: colors.ink, padding: 14, fontSize: 16 }}
      />
      <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Áudio descartado. Só o texto acima será interpretado.</Text>
    </View>
  );
}

function VozErroView({ tipo }: { tipo: 'vozSemFala' | 'vozErroRede' }) {
  const { colors } = useTheme();
  const isRede = tipo === 'vozErroRede';
  return (
    <View style={{ gap: 14, paddingTop: 8 }}>
      <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: colors.tile, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={isRede ? 'wifioff' : 'micoff'} size={26} color={colors.ink} />
      </View>
      <Text style={{ color: colors.ink, fontSize: 22, fontFamily: 'Geist_600SemiBold' }}>{isRede ? 'Não deu para transcrever' : 'Não ouvimos nada'}</Text>
      <Text style={{ color: colors.muted, fontSize: 15 }}>
        {isRede
          ? 'Sem conexão no momento. O áudio não foi enviado nem guardado. Você pode tentar de novo ou digitar.'
          : 'A gravação terminou sem fala detectável. Fale mais perto do aparelho ou digite seu pedido.'}
      </Text>
    </View>
  );
}

function SalvandoView({ items }: { items: ParsedItem[] }) {
  const { colors } = useTheme();
  return (
    <View>
      {items.map((item) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <Icon name={item.icon} size={24} color={colors.muted} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{item.titulo}</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Salvando…</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function SucessoView({ items, respostas, onVerModulo }: { items: ParsedItem[]; respostas: Record<string, string>; onVerModulo: () => void }) {
  const { colors } = useTheme();
  const hrefByModulo: Record<string, Parameters<typeof router.push>[0]> = {
    'Finanças': '/financas',
    'Compras': '/compras',
    'Agenda': '/agenda',
    'Saúde': '/saude',
    'Treinos': '/treinos',
  };

  return (
    <View>
      {items.map((item) => (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: lime, alignItems: 'center', justifyContent: 'center', marginTop: -2 }}>
            <Icon name="check" size={16} color="#09090B" strokeWidth={2.25} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{item.okLabel(respostas[item.id])}</Text>
            <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{item.modulo}</Text>
          </View>
          <Pressable
            onPress={() => {
              const href = hrefByModulo[item.modulo];
              if (href) router.replace(href);
              else onVerModulo();
            }}
          >
            <Text style={{ color: colors.ink, fontSize: 14, fontFamily: 'Geist_600SemiBold', textDecorationLine: 'underline' }}>Ver</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function FormGastoGanho({
  tipo,
  onSalvar,
}: {
  tipo: 'expense' | 'income';
  onSalvar: (dados: { amountCents: number; categoria: string; conta: string; data: string; nota?: string }) => void;
}) {
  const { colors } = useTheme();
  const isGasto = tipo === 'expense';
  const CATS = isGasto ? ['Alimentação', 'Mercado', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Outros'] : ['Salário', 'Freelance', 'Reembolso', 'Outros'];
  const [amountCents, setAmountCents] = useState(0);
  const [categoria, setCategoria] = useState(CATS[0]);
  const [conta, setConta] = useState('');
  const [data, setData] = useState('Hoje');
  const [nota, setNota] = useState('');
  const [openPicker, setOpenPicker] = useState<'categoria' | 'conta' | 'data' | 'nota' | null>(null);

  const ok = amountCents > 0 && !!conta;
  const motivo = amountCents <= 0 ? 'Digite o valor.' : !conta ? 'Escolha a conta.' : '';

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 2 }}>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>Valor</Text>
        <Text style={{ color: amountCents > 0 ? colors.ink : colors.muted, fontSize: 40, fontFamily: 'Geist_600SemiBold', fontVariant: ['tabular-nums'] }}>
          {formatCentsToBRL(amountCents)}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <View style={{ width: '48%' }}>
          <PickerField
            label={isGasto ? 'Categoria' : 'Origem'}
            value={categoria}
            placeholder="Escolher"
            open={openPicker === 'categoria'}
            onToggle={() => setOpenPicker((p) => (p === 'categoria' ? null : 'categoria'))}
            options={CATS}
            onPick={(v) => {
              setCategoria(v);
              setOpenPicker(null);
            }}
          />
        </View>
        <View style={{ width: '48%' }}>
          <PickerField
            label="Conta"
            value={conta || undefined}
            placeholder="Escolher"
            warn={!conta}
            open={openPicker === 'conta'}
            onToggle={() => setOpenPicker((p) => (p === 'conta' ? null : 'conta'))}
            options={['Nubank', 'Itaú', 'Dinheiro']}
            onPick={(v) => {
              setConta(v);
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
            options={['Hoje', 'Ontem', 'Outra data']}
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
            options={['Sem nota', 'Com Camila', 'Reembolsável']}
            onPick={(v) => {
              setNota(v === 'Sem nota' ? '' : v);
              setOpenPicker(null);
            }}
          />
        </View>
      </View>
      <AmountKeypad amountCents={amountCents} onChange={setAmountCents} />
      <FormFooterRegister
        ok={ok}
        label={isGasto ? 'Registrar gasto' : 'Registrar ganho'}
        motivo={motivo}
        onSave={() => onSalvar({ amountCents, categoria, conta, data, nota: nota || undefined })}
      />
    </View>
  );
}

function FormCompromisso({ onSalvar }: { onSalvar: (dados: { titulo: string; data: string; hora: string; lembrete: string }) => void }) {
  const { colors } = useTheme();
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('Amanhã');
  const [hora, setHora] = useState('09:00');
  const [lembrete, setLembrete] = useState('15 min antes');

  return (
    <View style={{ gap: 18 }}>
      <Input label="Título" value={titulo} onChangeText={setTitulo} />
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Data</Text>
        <ChipGroup options={['Hoje', 'Amanhã', 'Sex., 13/11', 'Outra data']} value={data} onChange={setData} />
      </View>
      <Input label="Horário · Brasília" value={hora} onChangeText={setHora} />
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Lembrete · opcional</Text>
        <ChipGroup options={['Sem lembrete', '15 min antes', '1 h antes', '1 dia antes']} value={lembrete} onChange={setLembrete} />
      </View>
      <FormFooterRegister ok={titulo.trim().length > 0} label="Criar compromisso" motivo="Dê um título." onSave={() => onSalvar({ titulo: titulo.trim(), data, hora, lembrete })} />
    </View>
  );
}

function FormLista({ onSalvar }: { onSalvar: (dados: { nome: string; itens: string[] }) => void }) {
  const { colors } = useTheme();
  const [nome, setNome] = useState('');
  const [itemAtual, setItemAtual] = useState('');
  const [itens, setItens] = useState<string[]>([]);

  function addItem() {
    const t = itemAtual.trim();
    if (!t) return;
    setItens((arr) => [...arr, t.charAt(0).toUpperCase() + t.slice(1)]);
    setItemAtual('');
  }

  return (
    <View style={{ gap: 18 }}>
      <Input label="Nome da lista" value={nome} onChangeText={setNome} />
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Itens · opcional</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Input value={itemAtual} onChangeText={setItemAtual} onSubmitEditing={addItem} />
          </View>
          <Pressable onPress={addItem} style={{ width: 48, height: 48, borderRadius: radii.field, borderWidth: 1, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" color={colors.ink} />
          </Pressable>
        </View>
        {itens.map((t, i) => (
          <View key={`${t}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <Text style={{ flex: 1, color: colors.ink, fontSize: 16 }}>{t}</Text>
            <Pressable onPress={() => setItens((arr) => arr.filter((_, j) => j !== i))} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </View>
      <FormFooterRegister ok={nome.trim().length > 0} label="Criar lista" motivo="Dê um nome à lista." onSave={() => onSalvar({ nome: nome.trim(), itens })} />
    </View>
  );
}

function FormRefeicao({ onSalvar }: { onSalvar: (dados: { tipo: string; comida: string; hora: string }) => void }) {
  const { colors } = useTheme();
  const [tipo, setTipo] = useState('Lanche');
  const [comida, setComida] = useState('');
  const [hora] = useState('14:20');

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Refeição</Text>
        <ChipGroup options={['Café da manhã', 'Almoço', 'Lanche', 'Jantar']} value={tipo} onChange={setTipo} />
      </View>
      <Input label="O que você comeu?" value={comida} onChangeText={setComida} />
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Favoritos</Text>
        {['Iogurte com granola', 'Pão integral com ovo', 'Salada de frutas'].map((f) => (
          <Pressable
            key={f}
            onPress={() => setComida(f)}
            style={{ minHeight: 48, borderRadius: radii.field, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 }}
          >
            <Icon name="star" size={16} color={colors.ink} />
            <Text style={{ color: colors.ink, fontSize: 15 }}>{f}</Text>
          </Pressable>
        ))}
      </View>
      <FormFooterRegister ok={comida.trim().length > 0} label="Registrar refeição" motivo="Diga o que você comeu." onSave={() => onSalvar({ tipo, comida: comida.trim(), hora })} />
    </View>
  );
}

function FormTreino({ onSalvar }: { onSalvar: (dados: { treino: string; modo: string }) => void }) {
  const { colors } = useTheme();
  const [treino, setTreino] = useState('Pernas');
  const [modo, setModo] = useState('feito');

  const opcoes = [
    { label: 'Pernas', d: 'Planejado para hoje, 19:00 · 5 exercícios' },
    { label: 'Corrida', d: 'Livre · distância e tempo' },
    { label: 'Outro', d: 'Atividade com nome próprio' },
  ];

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Sessão</Text>
        {opcoes.map((o) => {
          const on = treino === o.label;
          return (
            <Pressable
              key={o.label}
              onPress={() => setTreino(o.label)}
              style={{ minHeight: 60, borderRadius: radii.card, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: on ? colors.ink : colors.surface, borderWidth: 1, borderColor: on ? colors.ink : colors.line }}
            >
              <Text style={{ color: on ? colors.bg : colors.ink, fontSize: 16, fontFamily: 'Geist_500Medium' }}>{o.label}</Text>
              <Text style={{ color: on ? colors.bg : colors.muted, fontSize: 13, opacity: 0.8 }}>{o.d}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.ink, fontSize: typography.meta.fontSize + 1, fontFamily: 'Geist_500Medium' }}>Como registrar</Text>
        <ChipGroup options={['feito', 'sessao']} value={modo} onChange={setModo} />
      </View>
      <FormFooterRegister ok label={modo === 'sessao' ? 'Iniciar sessão' : 'Registrar treino'} motivo="" onSave={() => onSalvar({ treino, modo })} />
    </View>
  );
}

function FormFooterRegister({ ok, label, motivo, onSave }: { ok: boolean; label: string; motivo: string; onSave: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 8, marginTop: 4 }}>
      {!ok && motivo ? <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>{motivo}</Text> : null}
      <Pressable
        onPress={() => ok && onSave()}
        disabled={!ok}
        style={{ height: 52, borderRadius: radii.pill, backgroundColor: ok ? lime : colors.tile, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: ok ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>{label}</Text>
      </Pressable>
    </View>
  );
}

function Composer({
  texto,
  onChangeTexto,
  onEnviar,
  onMic,
}: {
  texto: string;
  onChangeTexto: (v: string) => void;
  onEnviar: () => void;
  onMic: () => void;
}) {
  const { colors } = useTheme();
  const temTexto = texto.trim().length > 0;

  return (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: colors.line, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, backgroundColor: colors.tile, borderRadius: 24, padding: 6, paddingLeft: 14 }}>
        <View style={{ paddingBottom: 12 }}>
          <Icon name="sparkle" size={20} color={colors.muted} />
        </View>
        <TextInput
          value={texto}
          onChangeText={onChangeTexto}
          placeholder="O que você quer fazer?"
          placeholderTextColor={colors.muted}
          multiline
          style={{ flex: 1, minHeight: 44, maxHeight: 110, color: colors.ink, fontSize: 16, paddingVertical: 11 }}
        />
        {temTexto ? (
          <Pressable onPress={() => onChangeTexto('')} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
        <Pressable
          onPress={onMic}
          accessibilityLabel="Falar com a Orbia"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: !temTexto ? lime : 'transparent',
          }}
        >
          <Icon name="mic" size={22} color={!temTexto ? '#09090B' : colors.ink} />
        </Pressable>
        {temTexto ? (
          <Pressable onPress={onEnviar} style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="send" size={22} strokeWidth={2} color={colors.bg} />
          </Pressable>
        ) : null}
      </View>
      {!temTexto ? (
        <View style={{ gap: 2, paddingHorizontal: 4 }}>
          <Text style={{ color: colors.ink, fontSize: 14, fontFamily: 'Geist_600SemiBold' }}>Falar com a Orbia</Text>
          <Pressable onPress={() => onChangeTexto('Crie uma lista de mercado com leite e arroz')}>
            <Text style={{ color: colors.muted, fontSize: 14 }}>{'Ex.: "Crie uma lista de mercado com leite e arroz"'}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function PreviaFooter({
  items,
  respostas,
  desligados,
  onConfirmar,
  onManual,
}: {
  items: ParsedItem[];
  respostas: Record<string, string>;
  desligados: Record<string, boolean>;
  onConfirmar: (ativos: ParsedItem[]) => void;
  onManual: () => void;
}) {
  const { colors } = useTheme();
  const ativos = items.filter((i) => !desligados[i.id]);
  const pendentes = ativos.filter((i) => i.need && (i.need.isError || !respostas[i.id]));
  const pode = ativos.length > 0 && pendentes.length === 0;

  return (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: colors.line, gap: 8 }}>
      {!pode ? (
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize, textAlign: 'center' }}>
          {ativos.length === 0
            ? 'Selecione ao menos um item.'
            : pendentes.length === 1
              ? 'Responda 1 pergunta para continuar.'
              : `Responda ${pendentes.length} perguntas para continuar.`}
        </Text>
      ) : null}
      <Pressable
        onPress={() => pode && onConfirmar(ativos)}
        disabled={!pode}
        style={{ height: 52, minHeight: minTouchTarget, borderRadius: radii.pill, backgroundColor: pode ? lime : colors.tile, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: pode ? '#09090B' : colors.muted, fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>
          {ativos.length === 1 ? 'Criar 1 item' : `Criar ${ativos.length} itens`}
        </Text>
      </Pressable>
      <Pressable onPress={onManual} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Preencher manualmente</Text>
      </Pressable>
    </View>
  );
}

function CtaFooter({
  label,
  onPress,
  disabled,
  secondaryLabel,
  onSecondary,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 28, borderTopWidth: 1, borderTopColor: colors.line, gap: 8 }}>
      <Pressable
        onPress={() => !disabled && onPress()}
        disabled={disabled}
        style={{ height: 52, borderRadius: radii.pill, backgroundColor: disabled ? colors.tile : lime, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: disabled ? colors.muted : '#09090B', fontSize: 16, fontFamily: 'Geist_600SemiBold' }}>{label}</Text>
      </Pressable>
      {secondaryLabel && onSecondary ? (
        <Pressable onPress={onSecondary} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>{secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function VozFooter({
  pausado,
  onCancelar,
  onPausar,
  onParar,
}: {
  pausado: boolean;
  onCancelar: () => void;
  onPausar: () => void;
  onParar: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onCancelar} style={{ minWidth: 104, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Cancelar</Text>
      </Pressable>
      <Pressable onPress={onParar} accessibilityLabel="Parar e transcrever" style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: lime, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="stop" size={28} strokeWidth={2} color="#09090B" />
      </Pressable>
      <Pressable onPress={onPausar} style={{ minWidth: 104, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={pausado ? 'play' : 'pause'} size={18} color={colors.ink} />
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>{pausado ? 'Continuar' : 'Pausar'}</Text>
      </Pressable>
    </View>
  );
}

function VozErroFooter({ onTentar, onDigitar }: { onTentar: () => void; onDigitar: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.screenMargin, paddingTop: 12, paddingBottom: 28, flexDirection: 'row', gap: 10 }}>
      <Pressable onPress={onTentar} style={{ flex: 1, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="refresh" size={18} color={colors.ink} />
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Tentar de novo</Text>
      </Pressable>
      <Pressable onPress={onDigitar} style={{ flex: 1, minHeight: 44, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.control, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="keyboard" size={18} color={colors.ink} />
        <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium' }}>Digitar</Text>
      </Pressable>
    </View>
  );
}
