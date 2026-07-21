import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Phone, MessageCircle, Calendar, MapPin, UserSearch } from 'lucide-react';
import { Storage } from '../storage';
import type { Cliente } from '../types';

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEdicao, setClienteEdicao] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Omit<Cliente, 'id' | 'dataCadastro'>>({
    nome: '', telefone: '', whatsapp: '', instagram: '',
    aniversario: '', cidade: '', favorito: false
  });

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = () => {
    const lista = Storage.getClientes();
    setClientes(lista);
  };

  const abrirModal = (cliente?: Cliente) => {
    if (cliente) {
      setClienteEdicao(cliente);
      setForm({
        nome: cliente.nome, telefone: cliente.telefone, whatsapp: cliente.whatsapp,
        instagram: cliente.instagram || '', aniversario: cliente.aniversario || '',
        cidade: cliente.cidade, favorito: cliente.favorito
      });
    } else {
      setClienteEdicao(null);
      setForm({
        nome: '', telefone: '', whatsapp: '', instagram: '',
        aniversario: '', cidade: '', favorito: false
      });
    }
    setModalAberto(true);
  };

  const salvarCliente = () => {
    if (!form.nome || !form.whatsapp) {
      alert('Preencha o nome e o WhatsApp do cliente!');
      return;
    }

    let lista = [...clientes];
    if (clienteEdicao) {
      lista = lista.map(c => c.id === clienteEdicao.id ? { ...clienteEdicao, ...form } : c);
    } else {
      const novo: Cliente = {
        ...form,
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      lista.push(novo);
    }

    Storage.setClientes(lista);
    carregarClientes();
    setModalAberto(false);
  };

  const excluirCliente = (id: string) => {
    if (confirm('Tem certeza que quer excluir esse cliente?')) {
      const lista = clientes.filter(c => c.id !== id);
      Storage.setClientes(lista);
      carregarClientes();
    }
  };

  const toggleFavorito = (id: string) => {
    const lista = clientes.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c);
    Storage.setClientes(lista);
    carregarClientes();
  };

  const abrirWhatsApp = (numero: string) => {
    const numeroLimpo = numero.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Clientes</h1>
        <button onClick={() => abrirModal()} className="bg-[#D4AF37] text-white p-3 rounded-xl flex items-center gap-2">
          <Plus size={18} /> Novo
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="card text-center py-10">
          <UserSearch size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Nenhum cliente cadastrado ainda</p>
          <button onClick={() => abrirModal()} className="btn-primary mt-4 max-w-xs mx-auto">Cadastrar primeiro</button>
        </div>
      ) : (
        <div className="space-y-4">
          {clientes.map(c => (
            <div key={c.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{c.nome}</h3>
                    <button onClick={() => toggleFavorito(c.id)} className="p-1">
                      <Star size={16} className={c.favorito ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone size={14} /> {c.telefone || 'Não informado'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {c.cidade || 'Não informado'}
                    </div>
                    {c.instagram && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Instagram: {c.instagram}</span>
                      </div>
                    )}
                    {c.aniversario && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} /> {c.aniversario}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-3">
                  <button onClick={() => abrirWhatsApp(c.whatsapp)} className="p-2 rounded-lg bg-green-50 text-green-600">
                    <MessageCircle size={16} />
                  </button>
                  <button onClick={() => abrirModal(c)} className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => excluirCliente(c.id)} className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{clienteEdicao ? 'Editar Cliente' : 'Novo Cliente'}</h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome Completo *</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <input type="tel" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium">WhatsApp *</label>
                  <input type="tel" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Instagram</label>
                  <input type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} className="input-field" placeholder="@usuario" />
                </div>
                <div>
                  <label className="text-sm font-medium">Data Aniversário</label>
                  <input type="date" value={form.aniversario} onChange={e => setForm({...form, aniversario: e.target.value})} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Cidade</label>
                <input type="text" value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} className="input-field" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="favorito" checked={form.favorito} onChange={e => setForm({...form, favorito: e.target.checked})} className="w-4 h-4 text-[#D4AF37]" />
                <label htmlFor="favorito" className="text-sm font-medium">Marcar como cliente favorito</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalAberto(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={salvarCliente} className="btn-primary flex-1">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}