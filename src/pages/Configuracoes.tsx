import { Download, Upload, Trash2, Info } from 'lucide-react';
import { Storage } from '../storage';

export default function PaginaConfiguracoes() {
  const fazerBackup = () => {
    const dados = Storage.exportarDados();
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hazuni-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Backup salvo com sucesso!');
  };

  const restaurarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    if (!confirm('Isso vai substituir todos os dados atuais! Tem certeza?')) return;

    const leitor = new FileReader();
    leitor.onload = (evento) => {
      try {
        const json = evento.target?.result as string;
        const dados = JSON.parse(json);
        if (dados.produtos) Storage.setProdutos(dados.produtos);
        if (dados.clientes) Storage.setClientes(dados.clientes);
        if (dados.vendas) Storage.setVendas(dados.vendas);
        alert('Backup restaurado! A página vai recarregar.');
        window.location.reload();
      } catch {
        alert('Arquivo inválido! Escolha um arquivo de backup .json');
      }
    };
    leitor.readAsText(arquivo);
  };

  const limparTodosDados = () => {
    if (confirm('Tem CERTEZA? Isso apaga TODOS os produtos, clientes e vendas!')) {
      localStorage.clear();
      alert('Dados apagados! A página vai recarregar.');
      window.location.reload();
    }
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">Configurações</h1>

      <div className="space-y-4">
        {/* Sobre */}
        <div className="card">
          <div className="flex items-center gap-3">
            <Info size={20} className="text-primary" />
            <div>
              <h3 className="font-medium">Hazuni Store</h3>
              <p className="text-sm text-gray-500">Versão 1.0.0 • App de Gestão Comercial</p>
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="card">
          <h3 className="font-medium mb-3">Backup e Restauração</h3>
          <div className="space-y-3">
            <button onClick={fazerBackup} className="btn-primary flex items-center justify-center gap-2">
              <Download size={18} /> Salvar Backup
            </button>
            <label className="btn-secondary flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={18} /> Restaurar Backup
              <input type="file" accept=".json" onChange={restaurarBackup} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">Guarde o arquivo de backup em local seguro</p>
        </div>

        {/* Zerar Dados */}
        <div className="card">
          <h3 className="font-medium mb-3 text-red-500">Zerar Sistema</h3>
          <button onClick={limparTodosDados} className="w-full py-3 rounded-xl border border-red-200 text-red-600 flex items-center justify-center gap-2">
            <Trash2 size={18} /> Apagar Todos os Dados
          </button>
          <p className="text-xs text-gray-500 mt-2">Essa ação não pode ser desfeita</p>
        </div>
      </div>
    </div>
  );
}