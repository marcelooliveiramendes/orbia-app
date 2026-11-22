// Parser de comandos mockado e determinístico — porta de prototipo/CriarRapido.dc.html `parse()`.
// Sem IA real: regex sobre o texto. A IA real (fase futura) deve devolver o mesmo formato
// de ParsedItem, pra essa tela não precisar mudar (docs/project.md §11.6).

export type NeedKey = 'conta' | 'hora' | 'lista' | 'treino' | 'ml' | 'valor';

export type ParsedNeed = {
  key: NeedKey;
  question: string;
  options: string[];
  isError?: boolean;
};

export type ParsedItemKind = 'gasto' | 'ganho' | 'lista' | 'item' | 'compromisso' | 'treino' | 'agua';

export type ParsedItem = {
  id: string;
  kind: ParsedItemKind;
  icon: 'financas' | 'income' | 'compras' | 'agenda' | 'treinos' | 'drop';
  tipo: string;
  modulo: string;
  titulo: string;
  valor?: number;
  fields: { k: string; v: string }[];
  need: ParsedNeed | null;
  okLabel: (answer?: string) => string;
};

export type ParseResult =
  | { kind: 'ok'; items: ParsedItem[] }
  | { kind: 'esclarecer' }
  | { kind: 'camera' };

function brl(n: number) {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function cap(x: string) {
  const t = (x || '').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function parseNumber(x: string) {
  return parseFloat(x.replace(/\./g, '').replace(',', '.'));
}

export function parseCommand(raw: string): ParseResult {
  const l = (raw || '').toLowerCase().trim();
  const items: ParsedItem[] = [];

  if (/\bpag(ar|a|ue)\b/.test(l) && !/paguei/.test(l)) return { kind: 'esclarecer' };
  if (/(escane|cupom|nota fiscal|minha nota)/.test(l)) return { kind: 'camera' };

  let m = l.match(/(gastei|paguei|gasto de|gasto)\s*(r\$\s*)?(-?\d[\d.,]*)/);
  if (m) {
    const v = parseNumber(m[3]);
    let cat = 'Outros';
    if (/(almo[cç]o|jantar|restaurante|lanche|caf[eé] da manh)/.test(l)) cat = 'Alimentação';
    else if (/mercado/.test(l)) cat = 'Mercado';
    else if (/(uber|[oô]nibus|gasolina)/.test(l)) cat = 'Transporte';
    const desc = /almo[cç]o/.test(l) ? 'Almoço' : /mercado/.test(l) ? 'Mercado' : /jantar/.test(l) ? 'Jantar' : 'Gasto';
    const ok = v > 0;
    items.push({
      id: 'd',
      kind: 'gasto',
      icon: 'financas',
      tipo: 'Despesa',
      modulo: 'Finanças',
      titulo: ok ? `${brl(v)} · ${desc}` : desc,
      valor: ok ? v : 0,
      fields: [{ k: 'Categoria', v: `${cat} (sugerida)` }, { k: 'Data', v: /ontem/.test(l) ? 'Ontem' : 'Hoje' }],
      need: ok
        ? { key: 'conta', question: 'De qual conta?', options: ['Nubank', 'Itaú', 'Dinheiro'] }
        : { key: 'valor', question: 'Valor inválido. Toque em Editar para informar.', options: [], isError: true },
      okLabel: () => `Despesa de ${ok ? brl(v) : ''} registrada`,
    });
  }

  m = l.match(/(recebi|ganhei|entrou)\s*(r\$\s*)?(\d[\d.,]*)/);
  if (m) {
    const v = parseNumber(m[3]);
    const origem = /(freela|freelance)/.test(l) ? 'Freelance' : /sal[aá]rio/.test(l) ? 'Salário' : 'Outros';
    items.push({
      id: 'r',
      kind: 'ganho',
      icon: 'income',
      tipo: 'Receita',
      modulo: 'Finanças',
      titulo: `${brl(v)} · ${origem}`,
      valor: v,
      fields: [{ k: 'Origem', v: origem }, { k: 'Data', v: 'Hoje · confirme' }],
      need: { key: 'conta', question: 'Em qual conta entrou?', options: ['Nubank', 'Itaú', 'Dinheiro'] },
      okLabel: () => `Receita de ${brl(v)} registrada`,
    });
  }

  const listaMatch = l.match(/lista(?: de ([a-zà-ú]+))?\s+com\s+(.+)$/);
  if (listaMatch) {
    const nomes = listaMatch[2].split(/,\s*|\s+e\s+/).map(cap).filter(Boolean);
    const nome = cap(listaMatch[1] || 'Nova lista');
    items.push({
      id: 'n',
      kind: 'lista',
      icon: 'compras',
      tipo: 'Nova lista',
      modulo: 'Compras',
      titulo: nome,
      fields: [{ k: 'Itens', v: nomes.join(' · ') }],
      need: null,
      okLabel: () => `Lista "${nome}" criada com ${nomes.length} itens`,
    });
  }

  m = l.match(
    /(marcar|marca|marque|agendar|agenda)\s+(?:o\s+|a\s+|um\s+|uma\s+)?(.+?)\s+(?:na\s+|no\s+|para\s+|pra\s+)?(segunda|ter[cç]a|quarta|quinta|sexta|s[aá]bado|domingo|amanh[aã]|hoje)(?:-feira)?(?:\s+(?:[aà]s|a)\s*(\d{1,2})(?:h|:)?(\d{2})?)?/,
  );
  if (m) {
    const hora = m[4] ? `${('0' + m[4]).slice(-2)}:${m[5] || '00'}` : null;
    const titulo = cap(m[2]);
    items.push({
      id: 'c',
      kind: 'compromisso',
      icon: 'agenda',
      tipo: 'Compromisso',
      modulo: 'Agenda',
      titulo,
      fields: [
        { k: 'Quando', v: m[3] },
        { k: 'Horário', v: hora ? `${hora} · Brasília` : '—' },
        { k: 'Lembrete', v: 'Sem lembrete' },
      ],
      need: hora ? null : { key: 'hora', question: 'Que horas?', options: ['09:00', '14:00', '18:00'] },
      okLabel: () => `${titulo} · ${m![3]}${hora ? `, ${hora}` : ''}`,
    });
  }

  if (!listaMatch) {
    m = l.match(/(comprar|coloca|coloque|adiciona|adicione|p[oõ]e|bota)\s+(?!agu[aá])(.+?)(?:\s+(?:na|à|a)\s+lista.*)?$/);
    if (m && !/agu[aá]/.test(m[2])) {
      const it = cap(m[2].split(/\s+e\s+/)[0]);
      items.push({
        id: 'l',
        kind: 'item',
        icon: 'compras',
        tipo: 'Item de compra',
        modulo: 'Compras',
        titulo: it,
        fields: [{ k: 'Quantidade', v: 'Não informada' }],
        need: { key: 'lista', question: 'Em qual lista?', options: ['Mercado da semana', 'Farmácia', 'Nova lista'] },
        okLabel: () => `"${it}" adicionado`,
      });
    }
  }

  m = l.match(/treino(?:\s+de\s+([a-zà-ú]+))?/);
  if (m) {
    const nome = `Treino${m[1] ? ` de ${m[1]}` : ''}`;
    items.push({
      id: 't',
      kind: 'treino',
      icon: 'treinos',
      tipo: 'Treino',
      modulo: 'Treinos',
      titulo: nome,
      fields: [{ k: 'Data', v: 'Hoje' }],
      need: { key: 'treino', question: 'Você já treinou ou quer agendar?', options: ['Já treinei', 'Agendar 19:00'] },
      okLabel: () => `${nome} registrado`,
    });
  }

  if (/agu[aá]/.test(l)) {
    const mlMatch = l.match(/(\d+)\s*ml/);
    items.push({
      id: 'a',
      kind: 'agua',
      icon: 'drop',
      tipo: 'Água',
      modulo: 'Saúde',
      titulo: mlMatch ? `+${mlMatch[1]} ml` : 'Água',
      fields: [{ k: 'Quando', v: 'Agora' }],
      need: mlMatch ? null : { key: 'ml', question: 'Quanto de água?', options: ['250 ml', '500 ml', '1 L'] },
      okLabel: () => `Água ${mlMatch ? `+${mlMatch[1]} ml` : ''} registrada`,
    });
  }

  if (!items.length) return { kind: 'esclarecer' };
  return { kind: 'ok', items };
}
