import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Users, Calendar } from 'lucide-react';
import { Storage } from '../storage';
import type { Venda, Produto, Cliente } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    setVendas(Storage.getVendas());
    setProdutos(Storage.getProdutos());
    setClientes(Storage.getClientes());
  }, []);

  // Cálculos corretos
  const hoje = new Date().toISOString().split('T')[0];
  const vendasHoje = vendas.filter(v => v.data === hoje).reduce((soma, v) => soma + v.total, 0);
  const mesAtual = new Date().toISOString().slice(0, 7);
  const lucroMes = vendas.filter(v => v.data.startsWith(mesAtual)).reduce((soma, v) => soma + v.total, 0);

  // Dados do gráfico
  const ultimos7Dias = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date();
    data.setDate(data.getDate() - (6 - indice));
    const dataStr = data.toISOString().split('T')[0];
    const valor = vendas.filter(v => v.data === dataStr).reduce((soma, v) => soma + v.total, 0);
    return {
      data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      valor
    };
  });

  return (
    <div className="p-4 pb-24 bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Cabeçalho com a sua logo */}
      <div className="flex items-center gap-3 mb-6">
       <img 
          src="/logo.png" 
          alt="Logo Hazuni Store" 
          className="w-[72px] h-[72px] rounded-xl object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800"></h1>
          <p className="text-sm text-gray-500">Gestão simples e prática para o seu negócio</p>
        </div>
      </div>

      {/* Cards coloridos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <span className="text-xs font-medium opacity-90">Vendas Hoje</span>
          </div>
          <p className="text-xl font-bold">R$ {vendasHoje.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} />
            <span className="text-xs font-medium opacity-90">Lucro do Mês</span>
          </div>
          <p className="text-xl font-bold">R$ {lucroMes.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package size={18} />
            <span className="text-xs font-medium opacity-90">Produtos</span>
          </div>
          <p className="text-xl font-bold">{produtos.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />
            <span className="text-xs font-medium opacity-90">Clientes</span>
          </div>
          <p className="text-xl font-bold">{clientes.length}</p>
        </div>
      </div>

      {/* Gráfico de vendas */}
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-amber-500" />
          Vendas últimos 7 dias
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ultimos7Dias}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="data" tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
            <Tooltip formatter={(valor: number) => [`R$ ${valor.toFixed(2)}`, 'Total']} />
            <Bar dataKey="valor" fill="#D4AF37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}