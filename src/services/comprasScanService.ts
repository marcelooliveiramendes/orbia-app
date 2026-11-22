import { create } from 'zustand';

// Estado efêmero do fluxo de escaneamento (não persiste — nada é salvo até a
// confirmação explícita do usuário, regra 1 de docs/HANDOFF.md).
export type OcrItem = {
  id: string;
  name: string;
  quantity: string;
  selected: boolean;
  uncertain?: string;
};

export type CupomLine = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  kg?: boolean;
  uncertain?: string;
  edited?: string;
  conferred?: boolean;
};

const OCR_SEED: OcrItem[] = [
  { id: 'o1', name: 'Pão de forma', quantity: '1', selected: true },
  { id: 'o2', name: 'Ovos', quantity: '12', selected: true },
  { id: 'o3', name: 'Maçã', quantity: '6', selected: true },
  { id: 'o4', name: 'Requeijão', quantity: '1', selected: true, uncertain: 'Leitura incerta: confira o nome' },
  { id: 'o5', name: 'Iogurte natural', quantity: '4', selected: true },
  { id: 'o6', name: 'Esponja', quantity: '2', selected: true, uncertain: 'Quantidade incerta: "2?" na foto' },
];

const CUPOM_SEED: CupomLine[] = [
  { id: 'c1', name: 'Arroz branco 5 kg', qty: 1, unitPrice: 27.9 },
  { id: 'c2', name: 'Feijão carioca 1 kg', qty: 2, unitPrice: 8.49 },
  { id: 'c3', name: 'Leite integral 1 L', qty: 6, unitPrice: 5.29 },
  { id: 'c4', name: 'Banana prata', qty: 1.215, unitPrice: 6.99, kg: true, uncertain: 'Peso incerto' },
  { id: 'c5', name: 'Café torrado 500 g', qty: 1, unitPrice: 21.9, uncertain: 'Preço incerto: "21,9_"' },
  { id: 'c6', name: 'Peito de frango', qty: 1.84, unitPrice: 19.9, kg: true },
  { id: 'c7', name: 'Azeite extra virgem 500 ml', qty: 1, unitPrice: 39.9 },
  { id: 'c8', name: 'Detergente 500 ml', qty: 3, unitPrice: 2.79 },
];

export const CUPOM_DISCOUNT = 4.44;
export const CUPOM_TOTAL = 187.46;
export const CUPOM_MERCHANT = 'Mercado Pão de Mel';

type ComprasScanState = {
  targetListId: string | null;
  ocr: OcrItem[];
  cupom: CupomLine[];
  conta: string;
  categoria: string;
  marcarComprados: boolean;
  startScan: (targetListId: string | null) => void;
  toggleOcrItem: (id: string) => void;
  setOcrName: (id: string, name: string) => void;
  setOcrQuantity: (id: string, quantity: string) => void;
  setCupomEdit: (id: string, value: string) => void;
  conferCupomLine: (id: string) => void;
  setConta: (v: string) => void;
  setCategoria: (v: string) => void;
  toggleMarcarComprados: () => void;
  reset: () => void;
};

export const useComprasScanService = create<ComprasScanState>((set, get) => ({
  targetListId: null,
  ocr: OCR_SEED,
  cupom: CUPOM_SEED,
  conta: '',
  categoria: 'Mercado',
  marcarComprados: false,
  startScan: (targetListId) =>
    set({
      targetListId,
      ocr: OCR_SEED.map((o) => ({ ...o })),
      cupom: CUPOM_SEED.map((c) => ({ ...c })),
      conta: '',
      categoria: 'Mercado',
      marcarComprados: false,
    }),
  toggleOcrItem: (id) => set({ ocr: get().ocr.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o)) }),
  setOcrName: (id, name) => set({ ocr: get().ocr.map((o) => (o.id === id ? { ...o, name, uncertain: o.id === 'o4' ? undefined : o.uncertain } : o)) }),
  setOcrQuantity: (id, quantity) =>
    set({ ocr: get().ocr.map((o) => (o.id === id ? { ...o, quantity, uncertain: o.id === 'o6' ? undefined : o.uncertain } : o)) }),
  setCupomEdit: (id, value) => set({ cupom: get().cupom.map((c) => (c.id === id ? { ...c, edited: value } : c)) }),
  conferCupomLine: (id) => set({ cupom: get().cupom.map((c) => (c.id === id ? { ...c, conferred: true } : c)) }),
  setConta: (v) => set({ conta: v }),
  setCategoria: (v) => set({ categoria: v }),
  toggleMarcarComprados: () => set({ marcarComprados: !get().marcarComprados }),
  reset: () =>
    set({
      targetListId: null,
      ocr: OCR_SEED.map((o) => ({ ...o })),
      cupom: CUPOM_SEED.map((c) => ({ ...c })),
      conta: '',
      categoria: 'Mercado',
      marcarComprados: false,
    }),
}));

export function categoriaDe(nome: string): string {
  const x = nome.toLowerCase();
  if (/(leite|queijo|iogurte|requeij|manteiga)/.test(x)) return 'Laticínios';
  if (/(banana|tomate|alface|ma[cç][aã]|cebola|batata|fruta)/.test(x)) return 'Hortifruti';
  if (/(p[aã]o|bolo|biscoito)/.test(x)) return 'Padaria';
  if (/(sab[aã]o|detergente|esponja|papel|amaciante)/.test(x)) return 'Limpeza';
  if (/(arroz|feij[aã]o|caf[eé]|azeite|ovo|a[cç][uú]car|macarr)/.test(x)) return 'Mercearia';
  return 'Outros';
}
