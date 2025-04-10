
import React from 'react';
import { Percent, Info } from 'lucide-react';

interface SeguroHeaderProps {
  setShowAboutUs: (show: boolean) => void;
}

export const SeguroHeader: React.FC<SeguroHeaderProps> = ({ setShowAboutUs }) => {
  return (
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
  );
};
