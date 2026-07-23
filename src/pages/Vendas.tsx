import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { Storage } from '../storage';

interface ItemVenda {
  produtoId: string;
  nome: string;
  precoVenda: number;
  precoCompra: number;
  quantidade: number;
}

interface Produto {
  id: string;
  nome: string;
  precoVenda: number;
  precoCompra: number;
}

interface Cliente {
  id: string;
  nome: string;
}

interface Venda {
  id: string;
  data: string;
  clienteNome?: string;
  itens: ItemVenda[];
  desconto: number;
  gastosExtras: number;
  taxas: number;
  observacao?: string;
  subtotal: number;
  totalCusto: number;
  total: number;
  lucroLiquido: number;
}

export default function PaginaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const [form, setForm] = useState({
    clienteNome: '',
    data: new Date().toISOString().split('T')[0],
    itens: [] as ItemVenda[],
    desconto: 0,
    gastosExtras: 0,
    taxas: 0,
    observacao: ''
  });

  useEffect(() => {
    setVendas(Storage.getVendas() || []);
    setProdutos(Storage.getProdutos() || []);
    setClientes(Storage.getClientes() || []); // ✅ Carrega clientes cadastrados
  }, []);

  // Cálculos automáticos
  const subtotal = form.itens.reduce((soma, item) => soma + (item.precoVenda * item.quantidade), 0);
  const totalCusto = form.itens.reduce((soma, item) => soma + (item.precoCompra * item.quantidade), 0);
  const totalVenda = subtotal - form.desconto;
  const lucroLiquido = totalVenda - totalCusto - form.gastosExtras - form.taxas;

  // Adiciona produto
  const adicionarProduto = (produtoId: string) => {
    if (!produtoId) return;
    const prod = produtos.find(p => p.id === produtoId);
    if (!prod) return;

    const existe = form.itens.find(i => i.produtoId === produtoId);
    if (existe) {
      setForm({
        ...form,
        itens: form.itens.map(i => i.produtoId === produtoId ? { ...i, quantidade: i.quantidade + 1 } : i)
      });
    } else {
      setForm({
        ...form,
        itens: [...form.itens, {
          produtoId: prod.id,
          nome: prod.nome,
          precoVenda: prod.precoVenda,
          precoCompra: prod.precoCompra,
          quantidade: 1
        }]
      });
    }
  };

  // Altera quantidade
  const alterarQtd = (produtoId: string, qtd: number) => {
    if (qtd < 1) return;
    setForm({
      ...form,
      itens: form.itens.map(i => i.produtoId === produtoId ? { ...i, quantidade: qtd } : i)
    });
  };

  // Remove produto
  const removerProduto = (produtoId: string) => {
    setForm({ ...form, itens: form.itens.filter(i => i.produtoId !== produtoId) });
  };

  // Salva venda
  const finalizarVenda = () => {
    if (form.itens.length === 0) {
      alert('Adicione pelo menos um produto!');
      return;
    }

    const nova: Venda = {
      id: Date.now().toString(),
      data: form.data,
      clienteNome: form.clienteNome || 'Não informado',
      itens: form.itens,
      desconto: form.desconto,
      gastosExtras: form.gastosExtras,
      taxas: form.taxas,
      observacao: form.observacao,
      subtotal,
      totalCusto,
      total: totalVenda,
      lucroLiquido
    };

    const lista = [...vendas, nova];
    Storage.setVendas(lista);
    setVendas(lista);
    setModalAberto(false);
    setForm({ clienteNome: '', data: new Date().toISOString().split('T')[0], itens: [], desconto: 0, gastosExtras: 0, taxas: 0, observacao: '' });
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
          <p className="text-gray-500">Nenhuma venda registrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendas.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="font-medium">{v.clienteNome} • {v.data}</p>
              <p className="text-lg font-bold text-[#D4AF37] mt-1">Total: R$ {v.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Lucro Líquido: R$ {v.lucroLiquido.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nova Venda</h2>
              <button onClick={() => setModalAberto(false)} className="p-1 text-gray-400"><X size={20} /></button>
            </div>

            <p className="text-xs text-gray-500 mb-4">Selecione um cliente cadastrado ou digite um novo nome.</p>

            <div className="space-y-3">
              {/* ✅ CAMPO COM LISTA DE CLIENTES CADASTRADOS */}
              <div>
                <label className="text-sm font-medium mb-1 block">Nome do Comprador</label>
                <select
                  value={form.clienteNome}
                  onChange={e => setForm({...form, clienteNome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white mb-2"
                >
                  <option value="">Selecione ou digite abaixo</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Ou digite um nome novo (opcional)"
                  value={form.clienteNome}
                  onChange={e => setForm({...form, clienteNome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Data da Venda</label>
                  <input 
                    type="date"
                    value={form.data}
                    onChange={e => setForm({...form, data: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Desconto (R$)</label>
                  <input 
                    type="number" min={0} step="0.01"
                    value={form.desconto}
                    onChange={e => setForm({...form, desconto: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Adicionar Produto</label>
                <select 
                  onChange={e => adicionarProduto(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4AF37] rounded-xl bg-white"
                  defaultValue=""
                >
                  <option value="">Escolha o produto</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} • R$ {p.precoVenda.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              {form.itens.length > 0 && (
                <div className="space-y-2">
                  {form.itens.map(item => (
                    <div key={item.produtoId} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">{item.nome}</p>
                        <p className="text-xs text-gray-500">R$ {item.precoVenda.toFixed(2)} x {item.quantidade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" min={1}
                          value={item.quantidade}
                          onChange={e => alterarQtd(item.produtoId, Number(e.target.value))}
                          className="w-12 px-2 py-1 border border-gray-200 rounded-lg text-center"
                        />
                        <button onClick={() => removerProduto(item.produtoId)} className="p-1 text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Gastos Extras (R$)</label>
                  <input 
                    type="number" min={0} step="0.01"
                    value={form.gastosExtras}
                    onChange={e => setForm({...form, gastosExtras: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Taxas (R$)</label>
                  <input 
                    type="number" min={0} step="0.01"
                    value={form.taxas}
                    onChange={e => setForm({...form, taxas: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Observação</label>
                  <input 
                    type="text" placeholder="Ex.: Motoboy"
                    value={form.observacao}
                    onChange={e => setForm({...form, observacao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* RESUMO FINAL */}
              <div className="border-t border-gray-200 pt-3 mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Custo</span>
                  <span className="text-red-500">- R$ {totalCusto.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Taxas</span>
                  <span>R$ {form.taxas.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>TOTAL DA VENDA</span>
                  <span className="text-[#D4AF37]">R$ {totalVenda.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-1">
                  <span></span>
                  <span className="text-green-600">↳ Lucro Líquido: R$ {lucroLiquido.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={finalizarVenda} className="w-full py-3 bg-[#D4AF37] text-white rounded-xl font-semibold mt-4">
                Finalizar Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}