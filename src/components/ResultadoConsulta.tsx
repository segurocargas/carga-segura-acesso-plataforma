import React, { useState } from 'react';
import { Share2, Percent, Send, Camera, Info } from 'lucide-react';
import { ResultadoConsulta } from '../types';

interface ResultadoConsultaProps {
  resultado: ResultadoConsulta;
  isVisible: boolean;
}

export const ResultadoConsultaComponent: React.FC<ResultadoConsultaProps> = ({ resultado, isVisible }) => {
  const [showAboutUs, setShowAboutUs] = useState(false);

  const enviarFotos = async (veiculos: ResultadoConsulta['veiculos']) => {
    const fotosPromises = veiculos
      .filter(veiculo => veiculo.foto)
      .map((veiculo) => {
        if (veiculo.foto) {
          window.open(veiculo.foto, '_blank');
        }
      });

    await Promise.all(fotosPromises);
  };

  const fazerSeguro = async () => {
    const veiculosTexto = resultado.veiculos.map((veiculo, index) => `
*Veículo ${index + 1}*
${veiculo.modelo ? `Modelo: ${veiculo.modelo}` : ''}
${veiculo.placa ? `Placa: ${veiculo.placa}` : ''}
${veiculo.chassi ? `Chassi: ${veiculo.chassi}` : ''}
${veiculo.geolocalizacao ? `Localização: ${veiculo.geolocalizacao.latitude.toFixed(6)}, ${veiculo.geolocalizacao.longitude.toFixed(6)}` : ''}
${veiculo.dataFoto ? `Data da Foto: ${new Date(veiculo.dataFoto).toLocaleString()}` : ''}`).join('\n');

    const mensagem = `
*SOLICITAÇÃO DE AVERBAÇÃO DE SEGURO*
AXA Seguro
Apólice nº 106540012538-001

*Rota:*
Origem: ${resultado.estadoOrigem} - ${resultado.cidadeOrigem}
Destino: ${resultado.estadoDestino} - ${resultado.cidadeDestino}

*Veículos: ${resultado.quantidadeVeiculos} veículo(s)*
${veiculosTexto}

*Valor Total do Seguro:* ${resultado.calculoSeguro.valorTotalSeguro.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}

Solicito averbação do seguro para os veículos acima.`;

    window.open(`https://wa.me/5571992620566?text=${encodeURIComponent(mensagem.trim())}`, '_blank');
    await enviarFotos(resultado.veiculos);
  };

  const compartilharWhatsApp = async () => {
    const veiculosTexto = resultado.veiculos.map((veiculo, index) => `
*Veículo ${index + 1}*
${veiculo.modelo ? `Modelo: ${veiculo.modelo}` : ''}
${veiculo.placa ? `Placa: ${veiculo.placa}` : ''}
${veiculo.geolocalizacao ? `Localização: ${veiculo.geolocalizacao.latitude.toFixed(6)}, ${veiculo.geolocalizacao.longitude.toFixed(6)}` : ''}
${veiculo.dataFoto ? `Data da Foto: ${new Date(veiculo.dataFoto).toLocaleString()}` : ''}`).join('\n');

    const mensagem = `
AXA Seguro
Apólice nº 106540012538-001

*Consulta de Seguro*
Origem: ${resultado.estadoOrigem} - ${resultado.cidadeOrigem}
Destino: ${resultado.estadoDestino} - ${resultado.cidadeDestino}

*Veículos: ${resultado.quantidadeVeiculos} veículo(s)*
${veiculosTexto}

*Valor Total do Seguro:* ${resultado.calculoSeguro.valorTotalSeguro.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem.trim())}`, '_blank');
    await enviarFotos(resultado.veiculos);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-gradient-to-b from-[#2d2d2d] to-[#262626] rounded-xl shadow-lg p-6 border border-[#404040]/30">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2196F3]/20 to-[#2196F3]/10 flex items-center justify-center mr-4 border border-[#2196F3]/20">
                <Percent className="text-[#2196F3]" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-1">Resultado da Consulta</h3>
                <p className="text-sm text-[#2196F3]">AXA Seguro · Apólice nº 106540012538-001</p>
              </div>
            </div>
            <button
              onClick={() => setShowAboutUs(true)}
              className="flex items-center px-4 py-2 bg-[#2196F3]/10 hover:bg-[#2196F3]/20 text-[#2196F3] rounded-lg transition-colors border border-[#2196F3]/20"
            >
              <Info size={20} className="mr-2" />
              Quem Somos Nós
            </button>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total de Veículos:</span>
              <span className="text-white font-semibold text-lg">{resultado.quantidadeVeiculos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Valor Total da Carga:</span>
              <span className="text-[#4CAF50] font-semibold text-lg">
                {resultado.valorTotalVeiculos.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={compartilharWhatsApp}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#128C7E]/20 text-base group"
            >
              <Send size={20} className="mr-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>Enviar para WhatsApp</span>
            </button>
            <button
              onClick={fazerSeguro}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#2196F3]/20 text-base group"
            >
              <Share2 size={20} className="mr-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>Solicitar Averbação do Seguro</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#1a1a1a] rounded-xl space-y-8 border border-[#404040]/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
              <h4 className="text-[#2196F3] text-sm font-medium mb-2">Origem</h4>
              <p className="text-lg font-medium text-white mb-1">{resultado.estadoOrigem}</p>
              <p className="text-sm text-gray-400">{resultado.cidadeOrigem}</p>
            </div>
            <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
              <h4 className="text-[#2196F3] text-sm font-medium mb-2">Destino</h4>
              <p className="text-lg font-medium text-white mb-1">{resultado.estadoDestino}</p>
              <p className="text-sm text-gray-400">{resultado.cidadeDestino}</p>
            </div>
          </div>

          <div>
            <h4 className="text-[#2196F3] text-sm font-medium mb-4">Detalhes dos Veículos</h4>
            <div className="space-y-4">
              {resultado.veiculos.map((veiculo, index) => (
                <div key={index} className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-white font-medium">Veículo {index + 1}</span>
                      {veiculo.modelo && (
                        <p className="text-[#2196F3] text-sm mt-1">{veiculo.modelo}</p>
                      )}
                    </div>
                    <span className="text-[#4CAF50] font-medium">
                      {veiculo.valor?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>

                  {veiculo.foto && (
                    <div className="mb-4">
                      <img
                        src={veiculo.foto}
                        alt={`Veículo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    {veiculo.placa && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Placa:</span>
                        <span className="text-sm text-white">{veiculo.placa}</span>
                      </div>
                    )}
                    {veiculo.chassi && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Chassi:</span>
                        <span className="text-sm text-white">{veiculo.chassi}</span>
                      </div>
                    )}
                    {veiculo.geolocalizacao && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Localização:</span>
                        <span className="text-sm text-white">
                          {veiculo.geolocalizacao.latitude.toFixed(6)}, {veiculo.geolocalizacao.longitude.toFixed(6)}
                        </span>
                      </div>
                    )}
                    {veiculo.dataFoto && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Data da Foto:</span>
                        <span className="text-sm text-white">
                          {new Date(veiculo.dataFoto).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#404040]/30 pt-6">
            <div className="bg-gradient-to-r from-[#1E8E3E]/10 to-[#34A853]/10 p-6 rounded-xl border border-[#34A853]/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-lg font-medium text-white">Valor Total do Seguro:</span>
                <span className="text-3xl font-bold text-[#4CAF50]">
                  {resultado.calculoSeguro.valorTotalSeguro.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
              </div>
            </div>
            <input 
              type="hidden" 
              id="percentualProLabore" 
              value={resultado.calculoSeguro.percentualProLabore} 
            />
          </div>
        </div>
      </div>

      {showAboutUs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2d2d2d] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#404040]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Quem Somos</h2>
                <button
                  onClick={() => setShowAboutUs(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Somos a solução certa para você que trabalha com transporte de veículos usando cegonhas e guinchos. 
                Nosso seguro é projetado para ser prático, rápido e acessível, garantindo que você possa focar no que 
                realmente importa: crescer seu negócio.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">O que nos diferencia:</h3>
                <div className="space-y-4">
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                    <h4 className="text-[#2196F3] font-medium mb-2">Praticidade</h4>
                    <p className="text-gray-300">Processos simples e diretos.</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                    <h4 className="text-[#2196F3] font-medium mb-2">Velocidade</h4>
                    <p className="text-gray-300">Respostas rápidas para não atrasar suas operações.</p>
                  </div>
                  <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                    <h4 className="text-[#2196F3] font-medium mb-2">Preços Acessíveis</h4>
                    <p className="text-gray-300">Sem sacrificar a qualidade, oferecemos o melhor custo-benefício do mercado.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#2196F3]/10 p-6 rounded-xl border border-[#2196F3]/20">
                <p className="text-white text-center">
                  Escolha a tranquilidade e a segurança com a gente. Junte-se a nós e veja como podemos ajudar seu negócio.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};