import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navegar = useNavigate();

  useEffect(() => {
    const tempo = setTimeout(() => {
      navegar('/home'); // Vai para a página principal
    }, 2000);
    return () => clearTimeout(tempo);
  }, [navegar]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {/* Sua logo que está na pasta public */}
      <img src="/logo.png" alt="Hazuni Store" className="w-40 h-auto mb-4" />
      <h1 className="text-2xl font-bold text-[#D4AF37]">Hazuni Store</h1>
      <p className="text-sm text-gray-500 mt-2">Carregando...</p>
    </div>
  );
}