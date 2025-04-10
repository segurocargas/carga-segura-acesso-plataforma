
import React from 'react';

interface SeguroTotalProps {
  valorTotalSeguro: number;
  percentualProLabore: number;
}

export const SeguroTotal: React.FC<SeguroTotalProps> = ({ 
  valorTotalSeguro,
  percentualProLabore
}) => {
  return (
    <div className="border-t border-[#404040]/30 pt-6">
      <div className="bg-gradient-to-r from-[#1E8E3E]/10 to-[#34A853]/10 p-6 rounded-xl border border-[#34A853]/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-lg font-medium text-white">Valor Total do Seguro:</span>
          <span className="text-3xl font-bold text-[#4CAF50]">
            {valorTotalSeguro.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </span>
        </div>
      </div>
      <input 
        type="hidden" 
        id="percentualProLabore" 
        value={percentualProLabore} 
      />
    </div>
  );
};
