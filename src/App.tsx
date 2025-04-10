import React, { useState, useEffect } from 'react';
import { Calculator, RefreshCw, Share, LogOut } from 'lucide-react';
import { Select } from './components/Select';
import { Loading } from './components/Loading';
import { ErrorModal } from './components/ErrorModal';
import { ResultadoConsultaComponent } from './components/ResultadoConsulta';
import { VeiculoInput } from './components/VeiculoInput';
import { Auth } from './components/Auth';
import { ConsultationHistory } from './components/ConsultationHistory';
import { ErrorBoundary } from './components/ErrorBoundary';
import { estados, capitais } from './data/estados';
import { dadosSeguros } from './data/mockData';
import { ResultadoConsulta, Veiculo } from './types';
import { calcularSeguro } from './utils/calculoSeguro';
import { supabase } from './lib/supabase';

// Constantes para cálculo do seguro
const VALOR_FIXO = 0.02; // 0,02%
const PERCENTUAL_IOF = 7.38; // 7,38%

// Mapeamento de siglas para nomes de estados em maiúsculas
const siglaParaNome: { [key: string]: string } = {
  'AC': 'ACRE',
  'AL': 'ALAGOAS',
  'AP': 'AMAPA',
  'AM': 'AMAZONAS',
  'BA': 'BAHIA',
  'CE': 'CEARA',
  'DF': 'DISTRITO FEDERAL',
  'ES': 'ESPIRITO SANTO',
  'GO': 'GOIAS',
  'MA': 'MARANHAO',
  'MT': 'MATO GROSSO',
  'MS': 'MATO GROSSO DO SUL',
  'MG': 'MINAS GERAIS',
  'PA': 'PARA',
  'PB': 'PARAIBA',
  'PR': 'PARANA',
  'PE': 'PERNAMBUCO',
  'PI': 'PIAUI',
  'RJ': 'RIO DE JANEIRO',
  'RN': 'RIO GRANDE DO NORTE',
  'RS': 'RIO GRANDE DO SUL',
  'RO': 'RONDONIA',
  'RR': 'RORAIMA',
  'SC': 'SANTA CATARINA',
  'SP': 'SAO PAULO',
  'SE': 'SERGIPE',
  'TO': 'TOCANTINS'
};

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [estadoOrigem, setEstadoOrigem] = useState('');
  const [estadoDestino, setEstadoDestino] = useState('');
  const [cidadeOrigem, setCidadeOrigem] = useState('');
  const [cidadeDestino, setCidadeDestino] = useState('');
  const [quantidadeVeiculos, setQuantidadeVeiculos] = useState('1');
  const [veiculos, setVeiculos] = useState<Veiculo[]>([{}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      // First try to get the current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // If no session exists, just clear local state and storage
        setSession(null);
        localStorage.removeItem('supabase.auth.token');
        return;
      }

      try {
        // Try local sign out first
        const { error: localError } = await supabase.auth.signOut({ scope: 'local' });
        
        if (localError) {
          console.warn('Local sign out failed:', localError);
        }

        try {
          // Then attempt global sign out
          await supabase.auth.signOut({ scope: 'global' });
        } catch (globalError) {
          console.warn('Global sign out failed:', globalError);
        }
      } catch (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      // Always ensure the session is cleared locally
      setSession(null);
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    }
  };

  const compartilharApp = async () => {
    const mensagem = `🚗 *SeguroCargas*\n\nAplicativo profissional para cálculo de seguro de transporte de veículos. Recursos:\n✅ Consulta automática de placas\n✅ Suporte a múltiplos veículos\n✅ Cálculo preciso com IOF\n✅ Integração com geolocalização\n\nAcesse agora: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SeguroCargas',
          text: 'Aplicativo profissional para cálculo de seguro de transporte de veículos com consulta de placas e geolocalização.',
          url: window.location.href
        });
      } else {
        // Fallback para WhatsApp se compartilhamento nativo não estiver disponível
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      // Fallback para copiar URL em caso de erro
      try {
        await navigator.clipboard.writeText(mensagem);
        alert('Mensagem copiada para a área de transferência!');
      } catch (clipboardErr) {
        console.error('Erro ao copiar para área de transferência:', clipboardErr);
        alert('Não foi possível compartilhar. Por favor, copie o link manualmente.');
      }
    }
  };

  const estadosOptions = [
    { value: '', label: 'Selecione o estado' },
    ...Object.entries(estados).map(([value, label]) => ({ value, label }))
  ];

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = Math.max(1, Math.min(20, Number(e.target.value)));
    setQuantidadeVeiculos(quantidade.toString());
    
    const novosVeiculos = Array(quantidade).fill({}).map((_, index) => 
      index < veiculos.length ? veiculos[index] : {}
    );
    setVeiculos(novosVeiculos);
  };

  const handleVeiculoChange = (index: number, veiculo: Veiculo) => {
    const newVeiculos = [...veiculos];
    newVeiculos[index] = veiculo;
    setVeiculos(newVeiculos);
  };

  const validarVeiculos = () => {
    return veiculos.every(veiculo => {
      const temIdentificacao = veiculo.placa || veiculo.foto;
      const temValor = typeof veiculo.valor === 'number' && veiculo.valor > 0;
      return temIdentificacao && temValor;
    });
  };

  const saveConsultation = async (resultado: ResultadoConsulta) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          user_id: session?.user?.id,
          origin_state: resultado.estadoOrigem,
          origin_city: resultado.cidadeOrigem,
          destination_state: resultado.estadoDestino,
          destination_city: resultado.cidadeDestino,
          vehicles: resultado.veiculos.map(v => ({
            ...v,
            foto: v.foto || null,
            fotoBase64: undefined // Remove base64 data before saving
          })),
          total_value: resultado.valorTotalVeiculos,
          insurance_value: resultado.calculoSeguro.valorTotalSeguro,
          percentage: resultado.percentual,
          vehicles_photos: resultado.veiculos
            .filter(v => v.foto)
            .map(v => ({
              url: v.foto,
              filename: v.nomeArquivo,
              metadata: {
                geolocalizacao: v.geolocalizacao,
                dataFoto: v.dataFoto
              }
            }))
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving consultation:', error);
    }
  };

  const handleConsulta = async () => {
    if (!estadoOrigem || !estadoDestino) {
      setError('Por favor, selecione os estados de origem e destino.');
      return;
    }

    if (!validarVeiculos()) {
      setError('Por favor, informe a placa ou foto e o valor para cada veículo.');
      return;
    }

    setLoading(true);

    try {
      const nomeEstadoOrigem = siglaParaNome[estadoOrigem];
      
      if (!nomeEstadoOrigem) {
        throw new Error(`Estado de origem ${estadoOrigem} não reconhecido.`);
      }
      
      const dadosOrigem = dadosSeguros.find(estado => 
        estado.ESTADO === nomeEstadoOrigem
      );

      if (!dadosOrigem) {
        throw new Error(`Estado de origem ${estadoOrigem} (${nomeEstadoOrigem}) não encontrado na base de dados.`);
      }

      const percentual = dadosOrigem[estadoDestino];

      if (percentual === undefined || typeof percentual !== 'number') {
        throw new Error(`Percentual não encontrado para a rota ${estadoOrigem} → ${estadoDestino}`);
      }

      const valorTotalVeiculos = veiculos.reduce((acc, veiculo) => acc + (veiculo.valor || 0), 0);
      const calculoSeguro = calcularSeguro(valorTotalVeiculos, percentual);

      const resultadoConsulta = {
        estadoOrigem: estados[estadoOrigem],
        estadoDestino: estados[estadoDestino],
        cidadeOrigem: cidadeOrigem || capitais[estadoOrigem],
        cidadeDestino: cidadeDestino || capitais[estadoDestino],
        percentual,
        veiculos: veiculos.map(v => ({
          ...v,
          foto: v.foto, // Keep the Supabase Storage URL
          fotoBase64: v.fotoBase64 // Keep base64 for preview
        })),
        quantidadeVeiculos: veiculos.length,
        valorTotalVeiculos,
        calculoSeguro
      };

      setResultado(resultadoConsulta);
      await saveConsultation(resultadoConsulta);
    } catch (erro) {
      console.error('Erro ao calcular seguro:', erro);
      setError(erro.message || 'Erro ao calcular o valor do seguro.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    console.log('Resetando formulário...');
    setEstadoOrigem('');
    setEstadoDestino('');
    setCidadeOrigem('');
    setCidadeDestino('');
    setQuantidadeVeiculos('1');
    setVeiculos([{}]);
    setResultado(null);
    console.log('Formulário resetado.');
  };

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black text-white logo-font bg-gradient-to-r from-[#2196F3] to-[#1976D2] bg-clip-text text-transparent">
                  SeguroCargas
                </h1>
                <button
                  onClick={compartilharApp}
                  className="flex items-center px-3 py-1.5 bg-[#2196F3]/10 hover:bg-[#2196F3]/20 text-[#2196F3] rounded-lg transition-colors border border-[#2196F3]/20"
                  title="Compartilhar aplicativo"
                >
                  <Share size={16} className="mr-1.5" />
                  <span className="text-sm">Compartilhar</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                {(!!resultado || veiculos.some(v => v.placa || v.valor) || estadoOrigem || estadoDestino) && (
                  <button
                    onClick={handleReset}
                    className="flex items-center px-4 py-2 bg-[#424242] hover:bg-[#616161] text-white rounded-lg transition-colors whitespace-nowrap"
                    title="Limpar dados e iniciar novo orçamento"
                  >
                    <RefreshCw size={20} className="mr-2" />
                    Novo Orçamento
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut size={20} className="mr-2" />
                  Sair
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-gray-400">
                Bem-vindo, {session?.user?.user_metadata?.name || session?.user?.email}
              </div>
              <div className="text-[#2196F3] text-sm font-medium bg-[#2196F3]/10 px-3 py-1 rounded-full border border-[#2196F3]/20 whitespace-nowrap">
                Versão 1.5.5
              </div>
            </div>
          </div>

          <div className="bg-[#2d2d2d] rounded-xl shadow-lg p-6 mb-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Quantidade de Veículos
              </h2>
              <div className="flex items-center bg-[#1a1a1a] rounded-xl p-4">
                <div className="flex flex-col mr-8">
                  <button
                    onClick={() => handleQuantidadeChange({ target: { value: String(Math.min(20, Number(quantidadeVeiculos) + 1)) } } as any)}
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-white bg-[#2196F3] rounded-lg hover:bg-[#1976D2] transition-colors mb-3"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleQuantidadeChange({ target: { value: String(Math.max(1, Number(quantidadeVeiculos) - 1)) } } as any)}
                    className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-white bg-[#2196F3] rounded-lg hover:bg-[#1976D2] transition-colors"
                  >
                    -
                  </button>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quantidadeVeiculos}
                    onChange={handleQuantidadeChange}
                    className="w-32 h-32 px-4 text-center text-6xl font-bold bg-transparent text-white border-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="space-y-4">
                {veiculos.map((veiculo, index) => (
                  <VeiculoInput
                    key={index}
                    index={index}
                    veiculo={veiculo}
                    onChange={handleVeiculoChange}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Origem
              </h2>
              <div className="space-y-6">
                <Select
                  label="Estado de Origem"
                  options={estadosOptions}
                  value={estadoOrigem}
                  onChange={(e) => setEstadoOrigem(e.target.value)}
                  showCheck={!!estadoOrigem}
                />

                <Select
                  label="Cidade de Origem"
                  options={[{ value: '', label: capitais[estadoOrigem] || 'Digite a cidade' }]}
                  value={cidadeOrigem}
                  onChange={(e) => setCidadeOrigem(e.target.value)}
                  isCity={true}
                  placeholder={capitais[estadoOrigem]}
                  showCheck={!!cidadeOrigem}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Destino
              </h2>
              <div className="space-y-6">
                <Select
                  label="Estado de Destino"
                  options={estadosOptions}
                  value={estadoDestino}
                  onChange={(e) => setEstadoDestino(e.target.value)}
                  showCheck={!!estadoDestino}
                />

                <Select
                  label="Cidade de Destino"
                  options={[{ value: '', label: capitais[estadoDestino] || 'Digite a cidade' }]}
                  value={cidadeDestino}
                  onChange={(e) => setCidadeDestino(e.target.value)}
                  isCity={true}
                  placeholder={capitais[estadoDestino]}
                  showCheck={!!cidadeDestino}
                />
              </div>
            </div>

            <button
              onClick={handleConsulta}
              className="w-full h-14 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl flex items-center justify-center text-lg font-medium transition-colors"
            >
              <Calculator className="mr-2" size={24} />
              Calcular Valor
            </button>
            
            <div className="mt-6 text-center text-gray-400 text-sm">
              © 2025 SeguroCargas - Todos os direitos reservados
            </div>
          </div>

          {resultado && (
            <ResultadoConsultaComponent
              resultado={resultado}
              isVisible={true}
            />
          )}
        </div>

        <ConsultationHistory />
        <Loading isLoading={loading} />
        <ErrorModal
          message={error}
          isOpen={!!error}
          onClose={() => setError('')}
        />
      </div>
    </ErrorBoundary>
  );
}