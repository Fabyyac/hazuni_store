import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { Storage } from '../storage';
import type { Venda, Produto, Cliente } from '../types';

export default function PaginaRelatorios() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    setVendas(Storage.getVendas());
    setProdutos(Storage.getProdutos());
    setClientes(Storage.getClientes());
  }, []);

  // Cálculos gerais corrigidos
  const totalVendas = vendas.reduce((soma, v) => soma + v.total, 0);
  const totalItensVendidos = vendas.reduce((soma, v) => soma + v.produtos.reduce((s, p) => s + p.quantidade, 0), 0);
  const estoqueBaixo = produtos.filter(p => p.estoqueAtual <= p.estoqueMinimo).length;

  // Vendas por mês
  const vendasPorMes = vendas.reduce((lista, v) => {
    const mes = v.data.slice(0, 7);
    const item = lista.find(i => i.mes === mes);
    if (item) item.valor += v.total;
    else lista.push({ mes, valor: v.total });
    return lista;
  }, [] as { mes: string; valor: number }[]).slice(-6);

  // Formas de pagamento
  const formasPagamento = vendas.reduce((lista, v) => {
    const item = lista.find(i => i.nome === v.formaPagamento);
    if (item) item.valor += v.total;
    else lista.push({ nome: v.formaPagamento || 'Não informado', valor: v.total });
    return lista;
  }, [] as { nome: string; valor: number }[]);

  const CORES = ['#D4AF37', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">Relatórios</h1>

      {/* Cards Resumo */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-[#D4AF37]" />
            <span className="text-sm text-gray-500">Total Vendas</span>
          </div>
          <p className="text-xl font-bold mt-1">R$ {totalVendas.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-500" />
            <span className="text-sm text-gray-500">Itens Vendidos</span>
          </div>
          <p className="text-xl font-bold mt-1">{totalItensVendidos}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-500" />
            <span className="text-sm text-gray-500">Clientes</span>
          </div>
          <p className="text-xl font-bold mt-1">{clientes.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className={estoqueBaixo > 0 ? 'text-red-500' : 'text-gray-500'} />
            <span className="text-sm text-gray-500">Estoque Baixo</span>
          </div>
          <p className="text-xl font-bold mt-1">{estoqueBaixo}</p>
        </div>
      </div>

      {/* Gráfico de Vendas */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Vendas por Período</h3>
        {vendasPorMes.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={vendasPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip formatter={(v: number) => [`R$ ${v.toFixed(2)}`, 'Total']} />
              <Bar dataKey="valor" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-6">Sem dados para exibir</p>
        )}
      </div>

      {/* Gráfico de Pagamento */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Pagamento</h3>
        {formasPagamento.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={formasPagamento} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={60}>
                {formasPagamento.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`R$ ${v.toFixed(2)}`, 'Valor']} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 py-6">Sem dados para exibir</p>
        )}
      </div>
    </div>
  );
}