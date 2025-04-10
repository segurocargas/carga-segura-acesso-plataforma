
import React from 'react';
import { Veiculo } from '../../types';

interface VeiculoCardProps {
  veiculo: Veiculo;
  index: number;
}

export const VeiculoCard: React.FC<VeiculoCardProps> = ({ veiculo, index }) => {
  return (
    <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[#404040]/30">
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
  );
};
