
import React, { useState } from 'react';
import { Share2, Percent, Send, Info } from 'lucide-react';
import { ResultadoConsulta } from '../types';
import { AboutUsModal } from './resultado/AboutUsModal';
import { SeguroHeader } from './resultado/SeguroHeader';
import { VeiculosSummary } from './resultado/VeiculosSummary';
import { ActionButtons } from './resultado/ActionButtons';
import { OrigemDestinoInfo } from './resultado/OrigemDestinoInfo';
import { VeiculosList } from './resultado/VeiculosList';
import { SeguroTotal } from './resultado/SeguroTotal';

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
          <SeguroHeader 
            setShowAboutUs={setShowAboutUs} 
          />

          <VeiculosSummary 
            quantidadeVeiculos={resultado.quantidadeVeiculos}
            valorTotalVeiculos={resultado.valorTotalVeiculos}
          />
          
          <ActionButtons 
            onShareWhatsApp={compartilharWhatsApp}
            onRequestSeguro={fazerSeguro}
          />
        </div>

        <div className="p-6 bg-[#1a1a1a] rounded-xl space-y-8 border border-[#404040]/20">
          <OrigemDestinoInfo 
            estadoOrigem={resultado.estadoOrigem}
            cidadeOrigem={resultado.cidadeOrigem}
            estadoDestino={resultado.estadoDestino}
            cidadeDestino={resultado.cidadeDestino}
          />

          <VeiculosList veiculos={resultado.veiculos} />

          <SeguroTotal valorTotalSeguro={resultado.calculoSeguro.valorTotalSeguro} percentualProLabore={resultado.calculoSeguro.percentualProLabore} />
        </div>
      </div>

      <AboutUsModal 
        isOpen={showAboutUs} 
        onClose={() => setShowAboutUs(false)} 
      />
    </>
  );
};
