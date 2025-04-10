
import React from 'react';

interface VeiculosSummaryProps {
  quantidadeVeiculos: number;
  valorTotalVeiculos: number;
}

export const VeiculosSummary: React.FC<VeiculosSummaryProps> = ({ 
  quantidadeVeiculos, 
  valorTotalVeiculos 
}) => {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/20">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-400">Total de Veículos:</span>
        <span className="text-white font-semibold text-lg">{quantidadeVeiculos}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-400">Valor Total da Carga:</span>
        <span className="text-[#4CAF50] font-semibold text-lg">
          {valorTotalVeiculos.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })}
        </span>
      </div>
    </div>
  );
};
