import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, DollarSign, Calendar, User, Package } from 'lucide-react';
import { Storage } from '../storage';
import type { Venda, Produto, Cliente } from '../types';

interface ItemVenda {
  produtoId: string;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export default function PaginaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [desconto, setDesconto] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setVendas(Storage.getVendas());
    setProdutos(Storage.getProdutos());
    setClientes(Storage.getClientes());
  };

  const totalItens = itens.reduce((soma, item) => soma + item.subtotal, 0);
  const totalFinal = totalItens - desconto;

  const adicionarItem = () => {
    if (!produtoSelecionado) {
      alert('Escolha um produto!');
      return;
    }
    const prod = produtos.find(p => p.id === produtoSelecionado);
    if (!prod) return;

    if (quantidade > prod.estoque) {
      alert(`Só temos ${prod.estoque} unidades em estoque!`);
      return;
    }

    const itemExistente = itens.find(i => i.produtoId === produtoSelecionado);
    if (itemExistente) {
      const novaQtd = itemExistente.quantidade + quantidade;
      if (novaQtd > prod.estoque) {
        alert(`Estoque insuficiente! Restam ${prod.estoque - itemExistente.quantidade} unidades`);
        return;
      }
      setItens(itens.map(i => 
        i.produtoId === produtoSelecionado 
          ? { ...i, quantidade: novaQtd, subtotal: novaQtd * i.precoUnitario }
          : i
      ));
    } else {
      const novoItem: ItemVenda = {
        produtoId: prod.id,
        nomeProduto: prod.nome,
        precoUnitario: prod.precoVenda,
        quantidade: quantidade,
        subtotal: prod.precoVenda * quantidade
      };
      setItens([...itens, novoItem]);
    }

    setProdutoSelecionado('');
    setQuantidade(1);
  };

  const removerItem = (produtoId: string) => {
    setItens(itens.filter(i => i.produtoId !== produtoId));
  };

  const salvarVenda = () => {
    if (!clienteSelecionado) {
      alert('Selecione o cliente!');
      return;
    }
    if (itens.length === 0) {
      alert('Adicione pelo menos um produto!');
      return;
    }
    if (totalFinal < 0) {
      alert('Desconto não pode ser maior que o total!');
      return;
    }

    // 1. Salvar a venda
    const novaVenda: Venda = {
      id: Date.now().toString(),
      clienteId: clienteSelecionado,
      produtos: itens.map(i => ({
        produtoId: i.produtoId,
        quantidade: i.quantidade,
        valorUnitario: i.precoUnitario
      })),
      desconto: desconto,
      frete: 0,
      formaPagamento: formaPagamento,
      status: 'concluida',
      total: totalFinal,
      data: new Date().toISOString().split('T')[0]
    };

    const listaVendas = [...vendas, novaVenda];
    Storage.setVendas(listaVendas);

    // 2. Atualizar estoque dos produtos
    const listaProdutos = produtos.map(p => {
      const itemVendido = itens.find(i => i.produtoId === p.id);
      if (itemVendido) {
        return { ...p, estoque: p.estoque - itemVendido.quantidade };
      }
      return p;
    });
    Storage.setProdutos(listaProdutos);

    // 3. Limpar e recarregar
    carregarDados();
    setModalAberto(false);
    setClienteSelecionado('');
    setItens([]);
    setDesconto(0);
    alert('Venda registrada com sucesso! Estoque atualizado.');
  };

  const getNomeCliente = (id: string) => {
    return clientes.find(c => c.id === id)?.nome || 'Cliente não encontrado';
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Vendas</h1>
        <button onClick={() => setModalAberto(true)} className="bg-primary text-white p-3 rounded-xl flex items-center gap-2">
          <Plus size={18} /> Nova Venda
        </button>
      </div>

      {vendas.length === 0 ? (
        <div className="card text-center py-10">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhuma venda registrada ainda</p>
          <button onClick={() => setModalAberto(true)} className="btn-primary mt-4 max-w-xs mx-auto">Registrar primeira venda</button>
        </div>
      ) : (
        <div className="space-y-4">
          {[...vendas].reverse().map(v => (
            <div key={v.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gray-500" />
                    <span className="font-medium">{getNomeCliente(v.clienteId)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} /> {v.data}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} /> {v.formaPagamento}
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {v.produtos.length} produto(s) • {v.desconto > 0 ? `Desconto: R$ ${v.desconto.toFixed(2)}` : 'Sem desconto'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">R$ {v.total.toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">Concluída</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE NOVA VENDA */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nova Venda</h2>

            <div className="space-y-3">
              {/* Cliente */}
              <div>
                <label className="text-sm font-medium">Cliente *</label>
                <select
                  value={clienteSelecionado}
                  onChange={e => setClienteSelecionado(e.target.value)}
                  className="input-field"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              {/* Adicionar Produto */}
              <div className="border-t pt-3">
                <label className="text-sm font-medium mb-2 block">Adicionar Produto</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={produtoSelecionado}
                      onChange={e => setProdutoSelecionado(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Escolha o produto</option>
                      {produtos.filter(p => p.estoque > 0).map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome} • R$ {p.precoVenda.toFixed(2)} ({p.estoque} disp)
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={e => setQuantidade(Number(e.target.value))}
                    className="input-field text-center"
                  />
                </div>
                <button onClick={adicionarItem} className="btn-secondary mt-2 w-full py-2">
                  <Plus size={16} className="inline" /> Adicionar
                </button>
              </div>

              {/* Itens da Venda */}
              {itens.length > 0 && (
                <div className="border rounded-xl p-3 bg-gray-50">
                  <h4 className="font-medium mb-2">Itens da venda:</h4>
                  {itens.map(item => (
                    <div key={item.produtoId} className="flex justify-between items-center py-1 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm">{item.nomeProduto}</p>
                        <p className="text-xs text-gray-500">{item.quantidade} x R$ {item.precoUnitario.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">R$ {item.subtotal.toFixed(2)}</span>
                        <button onClick={() => removerItem(item.produtoId)} className="text-red-500 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Valores */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Desconto (R$)</label>
                  <input type="number" min={0} step="0.01" value={desconto} onChange={e => setDesconto(Number(e.target.value))} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium">Pagamento</label>
                  <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} className="input-field">
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="credito">Cartão Crédito</option>
                    <option value="debito">Cartão Débito</option>
                  </select>
                </div>
              </div>

              <div className="text-right pt-2">
                <p className="text-sm text-gray-600">Total: R$ {totalItens.toFixed(2)} {desconto > 0 && `- R$ ${desconto.toFixed(2)}`}</p>
                <p className="text-2xl font-bold text-primary">Total Final: R$ {totalFinal.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalAberto(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={salvarVenda} className="btn-primary flex-1">Finalizar Venda</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}