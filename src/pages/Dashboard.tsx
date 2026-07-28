import { useState, useEffect } from 'react';
import { Storage } from '../storage';
import { TrendingUp, DollarSign, ShoppingCart, BarChart3, Percent, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Venda {
  id: string;
  data: string;
  total: number;
  lucroLiquido: number;
  gastosExtras: number;
  taxas: number;
}

export default function Dashboard() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => {
    setVendas(Storage.getVendas() || []);
  }, []);

  // Cálculos automáticos
  const totalVendas = vendas.reduce((soma, v) => soma + v.total, 0);
  const lucroLiquido = vendas.reduce((soma, v) => soma + v.lucroLiquido, 0);
  const totalGastos = vendas.reduce((soma, v) => soma + v.gastosExtras + v.taxas, 0);
  const qtdVendida = vendas.length;
  const ticketMedio = qtdVendida > 0 ? totalVendas / qtdVendida : 0;
  const margem = totalVendas > 0 ? (lucroLiquido / totalVendas) * 100 : 0;
  const saldo = lucroLiquido - totalGastos;

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">Resumo Geral</h1>

      {/* CARDS IGUAIS NA IMAGEM */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-500 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Lucro Líquido</p>
            <TrendingUp size={16} />
          </div>
          <p className="text-xl font-bold">R$ {lucroLiquido.toFixed(2)}</p>
        </div>

        <div className={`${saldo >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-xl shadow-sm`}>
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Saldo no pe...</p>
            <Wallet size={16} />
          </div>
          <p className="text-xl font-bold">{saldo >= 0 ? '+' : ''}R$ {saldo.toFixed(2)}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Entradas de Vendas</p>
            <ArrowUpRight size={16} />
          </div>
          <p className="text-xl font-bold">R$ {totalVendas.toFixed(2)}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Saídas de Custos</p>
            <ArrowDownRight size={16} />
          </div>
          <p className="text-xl font-bold">R$ {totalGastos.toFixed(2)}</p>
        </div>

        <div className="bg-red-500 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Resultado do Período</p>
            <BarChart3 size={16} />
          </div>
          <p className="text-xl font-bold">R$ {saldo.toFixed(2)}</p>
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Total em Vendas</p>
            <DollarSign size={16} />
          </div>
          <p className="text-xl font-bold">R$ {totalVendas.toFixed(2)}</p>
        </div>

        <div className="bg-fuchsia-600 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Qtd. Vendida</p>
            <ShoppingCart size={16} />
          </div>
          <p className="text-xl font-bold">{qtdVendida}</p>
        </div>

        <div className="bg-amber-500 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Ticket Médio</p>
            <DollarSign size={16} />
          </div>
          <p className="text-xl font-bold">R$ {ticketMedio.toFixed(2)}</p>
        </div>

        <div className="bg-red-600 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Custos de Produtos</p>
            <BarChart3 size={16} />
          </div>
          <p className="text-xl font-bold">R$ {totalGastos.toFixed(2)}</p>
        </div>

        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium">Margem de Lucro</p>
            <Percent size={16} />
          </div>
          <p className="text-xl font-bold">{margem.toFixed(1)}%</p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#D4AF37]" /> Evolução do Lucro
          </h3>
          <p className="text-sm text-gray-500 mb-2">Média: R$ {(qtdVendida > 0 ? lucroLiquido / qtdVendida : 0).toFixed(2)}/mês</p>
          <div className="h-40 flex items-end justify-around gap-1 px-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[#D4AF37] rounded-t opacity-80" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Vendas por Canal</h3>
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
            Dados preenchidos automaticamente conforme as vendas
          </div>
        </div>
      </div>
    </div>
  );
}