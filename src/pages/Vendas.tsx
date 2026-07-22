import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Storage } from '../storage';

// Tipos simplificados para evitar erro de sintaxe
interface ItemVenda {
  produtoId: string;
  quantidade: number;
}

interface Produto {
  id: string;
  nome: string;
  precoVenda: number;
  [chave: string]: any;
}

interface Cliente {
  id: string;
  nome: string;
}

interface Venda {
  id: string;
  data: string;
  clienteId: string;
  produtos: ItemVenda[];
  desconto: number;
  formaPagamento: string;
  total: number;
}

export default function PaginaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  
  const [form, setForm] = useState({
    clienteId: '',
    itens: [] as ItemVenda[],
    desconto: 0,
    formaPagamento: 'Dinheiro'
  });

  // Carrega dados ao abrir
  useEffect(() => {
    setVendas(Storage.getVendas() || []);
    setProdutos(Storage.getProdutos() || []);
    setClientes(Storage.getClientes() || []);
  }, []);

  // Cálculo total
  const totalItens = form.itens.reduce((soma, item) => {
    const prod = produtos.find(p => p.id === item.produtoId);
    return soma + (prod ? prod.precoVenda * item.quantidade : 0);
  }, 0);
  const totalFinal = totalItens - form.desconto;

  // Adiciona produto
  const adicionarProduto = (produtoId: string) => {
    if (!produtoId) return;
    const existe = form.itens.find(i => i.produtoId === produtoId);
    if (existe) {
      setForm({
        ...form,
        itens: form.itens.map(i => 
          i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      });
    } else {
      setForm({
        ...form,
        itens: [...form.itens, { produtoId, quantidade: 1 }]
      });
    }
  };

  // Altera quantidade
  const alterarQuantidade = (produtoId: string, qtd: number) => {
    if (qtd < 1) return;
    setForm({
      ...form,
      itens: form.itens.map(i => 
        i.produtoId === produtoId ? { ...i, quantidade: qtd } : i
      )
    });
  };

  // Remove produto
  const removerProduto = (produtoId: string) => {
    setForm({
      ...form,
      itens: form.itens.filter(i => i.produtoId !== produtoId)
    });
  };

  // Finaliza venda
  const finalizarVenda = () => {
    if (!form.clienteId || form.itens.length === 0) {
      alert('Selecione um cliente e pelo menos um produto!');
      return;
    }
    const novaVenda: Venda = {
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      clienteId: form.clienteId,
      produtos: form.itens,
      desconto: form.desconto,
      formaPagamento: form.formaPagamento,
      total: totalFinal
    };
    const listaAtualizada = [...vendas, novaVenda];
    Storage.setVendas(listaAtualizada);
    setVendas(listaAtualizada);
    setModalAberto(false);
    setForm({ clienteId: '', itens: [], desconto: 0, formaPagamento: 'Dinheiro' });
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Vendas</h1>
        <button onClick={() => setModalAberto(true)} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={18} /> Nova Venda
        </button>
      </div>

      {vendas.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Nenhuma venda registrada ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendas.map(v => {
            const cliente = clientes.find(c => c.id === v.clienteId);
            return (
              <div key={v.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="font-semibold">{cliente?.nome || 'Cliente não identificado'}</p>
                <p className="text-sm text-gray-500">Data: {v.data} • {v.formaPagamento}</p>
                <p className="text-lg font-bold text-[#D4AF37] mt-1">R$ {v.total.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nova Venda</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Cliente *</label>
                <select 
                  value={form.clienteId} 
                  onChange={e => setForm({...form, clienteId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Adicionar Produto</label>
                <div className="flex gap-2">
                  <select 
                    onChange={e => adicionarProduto(e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#D4AF37] rounded-xl bg-white"
                    defaultValue=""
                  >
                    <option value="">Escolha o produto</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} • R$ {p.precoVenda.toFixed(2)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {form.itens.length > 0 && (
                <div className="space-y-2 mt-2">
                  {form.itens.map(item => {
                    const prod = produtos.find(p => p.id === item.produtoId);
                    if (!prod) return null;
                    return (
                      <div key={item.produtoId} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium">{prod.nome}</p>
                          <p className="text-xs text-gray-500">R$ {prod.precoVenda.toFixed(2)} cada</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min={1} 
                            value={item.quantidade}
                            onChange={e => alterarQuantidade(item.produtoId, Number(e.target.value))}
                            className="w-12 px-2 py-1 border border-gray-200 rounded-lg text-center"
                          />
                          <button onClick={() => removerProduto(item.produtoId)} className="p-1 text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Desconto (R$)</label>
                  <input 
                    type="number" 
                    min={0} 
                    step="0.01"
                    value={form.desconto}
                    onChange={e => setForm({...form, desconto: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pagamento</label>
                  <select 
                    value={form.formaPagamento}
                    onChange={e => setForm({...form, formaPagamento: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option>Dinheiro</option>
                    <option>PIX</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                  </select>
                </div>
              </div>

              <div className="text-right pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">Total: R$ {totalItens.toFixed(2)}</p>
                <p className="text-xl font-bold text-[#D4AF37]">Total Final: R$ {totalFinal.toFixed(2)}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setModalAberto(false)} className="flex-1 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Cancelar</button>
                <button onClick={finalizarVenda} className="flex-1 py-2 bg-[#D4AF37] text-white rounded-xl font-medium">Finalizar Venda</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}