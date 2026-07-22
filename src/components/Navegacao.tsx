import { NavLink } from 'react-router-dom';
import { Home, Package, Users, ShoppingCart, BarChart3, Settings } from 'lucide-react';

export default function Navegacao() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 max-w-md mx-auto shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      {/* Espaço extra embaixo para não cobrir os botões do sistema */}
      <div className="flex justify-around py-2 pb-6">
        <NavLink 
          to="/home" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <Home size={20} />
          <span>Início</span>
        </NavLink>

        <NavLink 
          to="/produtos" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <Package size={20} />
          <span>Produtos</span>
        </NavLink>

        <NavLink 
          to="/clientes" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <Users size={20} />
          <span>Clientes</span>
        </NavLink>

        <NavLink 
          to="/vendas" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <ShoppingCart size={20} />
          <span>Vendas</span>
        </NavLink>

        <NavLink 
          to="/relatorios" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <BarChart3 size={20} />
          <span>Relatórios</span>
        </NavLink>

        <NavLink 
          to="/configuracoes" 
          className={({ isActive }) => `flex flex-col items-center p-2 text-xs ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}
        >
          <Settings size={20} />
          <span>Ajustes</span>
        </NavLink>
      </div>
    </nav>
  );
}