
import React from 'react';

interface OrigemDestinoInfoProps {
  estadoOrigem: string;
  cidadeOrigem: string;
  estadoDestino: string;
  cidadeDestino: string;
}

export const OrigemDestinoInfo: React.FC<OrigemDestinoInfoProps> = ({
  estadoOrigem,
  cidadeOrigem,
  estadoDestino,
  cidadeDestino
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
        <h4 className="text-[#2196F3] text-sm font-medium mb-2">Origem</h4>
        <p className="text-lg font-medium text-white mb-1">{estadoOrigem}</p>
        <p className="text-sm text-gray-400">{cidadeOrigem}</p>
      </div>
      <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
        <h4 className="text-[#2196F3] text-sm font-medium mb-2">Destino</h4>
        <p className="text-lg font-medium text-white mb-1">{estadoDestino}</p>
        <p className="text-sm text-gray-400">{cidadeDestino}</p>
      </div>
    </div>
  );
};
