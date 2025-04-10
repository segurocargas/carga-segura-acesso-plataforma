
import React from 'react';
import { VeiculoCard } from './VeiculoCard';
import { Veiculo } from '../../types';

interface VeiculosListProps {
  veiculos: Veiculo[];
}

export const VeiculosList: React.FC<VeiculosListProps> = ({ veiculos }) => {
  return (
    <div>
      <h4 className="text-[#2196F3] text-sm font-medium mb-4">Detalhes dos Veículos</h4>
      <div className="space-y-4">
        {veiculos.map((veiculo, index) => (
          <VeiculoCard 
            key={index}
            veiculo={veiculo}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
