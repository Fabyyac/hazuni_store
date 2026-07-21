import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navegacao from './components/Navegacao';
import SplashScreen from './pages/Splash';
import Dashboard from './pages/Dashboard';
import PaginaProdutos from './pages/Produtos';
import PaginaClientes from './pages/Clientes';
import PaginaVendas from './pages/Vendas';
import PaginaRelatorios from './pages/Relatorios';
import PaginaConfiguracoes from './pages/Configuracoes';

export default function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <Routes>
          {/* Tela de abertura na rota inicial */}
          <Route path="/" element={<SplashScreen />} />
          {/* Página principal agora em /home */}
          <Route path="/home" element={<Dashboard />} />
          <Route path="/produtos" element={<PaginaProdutos />} />
          <Route path="/clientes" element={<PaginaClientes />} />
          <Route path="/vendas" element={<PaginaVendas />} />
          <Route path="/relatorios" element={<PaginaRelatorios />} />
          <Route path="/configuracoes" element={<PaginaConfiguracoes />} />
        </Routes>
        <Navegacao />
      </div>
    </Router>
  );
}