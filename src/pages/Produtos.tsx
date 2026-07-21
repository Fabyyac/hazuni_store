import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, PackageSearch } from 'lucide-react';
import { Storage } from '../storage';
import type { Produto } from '../types';

export default function PaginaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [form, setForm] = useState<Omit<Produto, 'id' | 'dataCadastro'>>({
    nome: '', categoria: '', codigo: '', precoCompra: 0, precoVenda: 0,
    estoqueAtual: 0, estoqueMinimo: 1, fornecedor: '', observacoes: ''
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    const lista = Storage.getProdutos();
    setProdutos(lista);
  };

  const abrirModal = (produto?: Produto) => {
    if (produto) {
      setProdutoEdicao(produto);
      setForm({
        nome: produto.nome, categoria: produto.categoria || '', codigo: produto.codigo || '',
        precoCompra: produto.precoCompra, precoVenda: produto.precoVenda,
        estoqueAtual: produto.estoqueAtual, estoqueMinimo: produto.estoqueMinimo,
        fornecedor: produto.fornecedor || '', observacoes: produto.observacoes || ''
      });
    } else {
      setProdutoEdicao(null);
      setForm({
        nome: '', categoria: '', codigo: '', precoCompra: 0, precoVenda: 0,
        estoqueAtual: 0, estoqueMinimo: 1, fornecedor: '', observacoes: ''
      });
    }
    setModalAberto(true);
  };

  const salvarProduto = () => {
    if (!form.nome || form.precoVenda <= 0) {
      alert('Preencha o nome e o preço de venda do produto!');
      return;
    }

    let lista = [...produtos];
    if (produtoEdicao) {
      lista = lista.map(p => p.id === produtoEdicao.id ? { ...produtoEdicao, ...form } : p);
    } else {
      const novo: Produto = {
        ...form,
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      lista.push(novo);
    }

    Storage.setProdutos(lista);
    carregarProdutos();
    setModalAberto(false);
  };

  const excluirProduto = (id: string) => {
    if (confirm('Tem certeza que quer excluir esse produto?')) {
      const lista = produtos.filter(p => p.id !== id);
      Storage.setProdutos(lista);
      carregarProdutos();
    }
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Produtos</h1>
        <button onClick={() => abrirModal()} className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus size={18} /> Novo
        </button>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl">
          <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Nenhum produto cadastrado ainda</p>
          <button onClick={() => abrirModal()} className="bg-[#D4AF37] text-white px-6 py-2 rounded-xl">Cadastrar primeiro</button>
        </div>
      ) : (
        <div className="space-y-4">
          {produtos.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{p.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.codigo && `Código: ${p.codigo} • `}
                    Estoque: {p.estoqueAtual}
                  </p>
                  <p className="text-sm font-medium text-[#D4AF37] mt-1">
                    R$ {p.precoVenda.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirModal(p)} className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => excluirProduto(p.id)} className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CORRIGIDO: CENTRALIZADO NO MEIO, IGUAL NAS OUTRAS PÁGINAS */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{produtoEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome *</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <input type="text" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium">Código</label>
                  <input type="text" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Preço Compra (R$)</label>
                  <input type="number" step="0.01" value={form.precoCompra} onChange={e => setForm({...form, precoCompra: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium">Preço Venda (R$) *</label>
                  <input type="number" step="0.01" value={form.precoVenda} onChange={e => setForm({...form, precoVenda: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Estoque Atual</label>
                  <input type="number" value={form.estoqueAtual} onChange={e => setForm({...form, estoqueAtual: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium">Estoque Mínimo</label>
                  <input type="number" value={form.estoqueMinimo} onChange={e => setForm({...form, estoqueMinimo: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Fornecedor</label>
                <input type="text" value={form.fornecedor} onChange={e => setForm({...form, fornecedor: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
              </div>

              <div>
                <label className="text-sm font-medium">Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalAberto(false)} className="flex-1 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-xl font-medium">Cancelar</button>
              <button onClick={salvarProduto} className="flex-1 py-2 bg-[#D4AF37] text-white rounded-xl font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}