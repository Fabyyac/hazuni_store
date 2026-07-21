import type { Produto, Cliente, Venda, Compra, Movimentacao } from '../types';

const STORAGE_KEYS = {
  PRODUTOS: 'hazuni_produtos',
  CLIENTES: 'hazuni_clientes',
  VENDAS: 'hazuni_vendas',
  COMPRAS: 'hazuni_compras',
  MOVIMENTACOES: 'hazuni_movimentacoes',
};

export const Storage = {
  salvar: (chave: string, dados: any[]) => {
    localStorage.setItem(chave, JSON.stringify(dados));
  },

  carregar: <T>(chave: string): T[] => {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  },

  getProdutos: () => Storage.carregar<Produto>(STORAGE_KEYS.PRODUTOS),
  setProdutos: (dados: Produto[]) => Storage.salvar(STORAGE_KEYS.PRODUTOS, dados),

  getClientes: () => Storage.carregar<Cliente>(STORAGE_KEYS.CLIENTES),
  setClientes: (dados: Cliente[]) => Storage.salvar(STORAGE_KEYS.CLIENTES, dados),

  getVendas: () => Storage.carregar<Venda>(STORAGE_KEYS.VENDAS),
  setVendas: (dados: Venda[]) => Storage.salvar(STORAGE_KEYS.VENDAS, dados),

  getCompras: () => Storage.carregar<Compra>(STORAGE_KEYS.COMPRAS),
  setCompras: (dados: Compra[]) => Storage.salvar(STORAGE_KEYS.COMPRAS, dados),

  getMovimentacoes: () => Storage.carregar<Movimentacao>(STORAGE_KEYS.MOVIMENTACOES),
  setMovimentacoes: (dados: Movimentacao[]) => Storage.salvar(STORAGE_KEYS.MOVIMENTACOES, dados),

  exportarDados: () => {
    const dados = {
      produtos: Storage.getProdutos(),
      clientes: Storage.getClientes(),
      vendas: Storage.getVendas(),
      compras: Storage.getCompras(),
      movimentacoes: Storage.getMovimentacoes(),
      dataExportacao: new Date().toISOString(),
    };
    return JSON.stringify(dados, null, 2);
  },

  importarDados: (json: string) => {
    const dados = JSON.parse(json);
    if (dados.produtos) Storage.setProdutos(dados.produtos);
    if (dados.clientes) Storage.setClientes(dados.clientes);
    if (dados.vendas) Storage.setVendas(dados.vendas);
    if (dados.compras) Storage.setCompras(dados.compras);
    if (dados.movimentacoes) Storage.setMovimentacoes(dados.movimentacoes);
    return true;
  }
};