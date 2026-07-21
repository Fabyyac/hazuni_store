export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  codigo: string;
  foto?: string;
  precoCompra: number;
  precoVenda: number;
  estoque: number;
  estoqueMinimo: number;
  fornecedor: string;
  observacoes: string;
  dataCadastro: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  whatsapp: string;
  instagram?: string;
  aniversario?: string;
  cidade: string;
  favorito: boolean;
  dataCadastro: string;
}

export interface Venda {
  id: string;
  clienteId: string;
  produtos: { produtoId: string; quantidade: number; valorUnitario: number }[];
  desconto: number;
  frete: number;
  formaPagamento: string;
  status: 'pendente' | 'concluida' | 'cancelada';
  rastreio?: string;
  total: number;
  data: string;
}

export interface Compra {
  id: string;
  fornecedor: string;
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  formaPagamento: string;
  total: number;
  data: string;
}

export interface Movimentacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  data: string;
  categoria: string;
}