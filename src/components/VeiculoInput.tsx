import React, { useState, useRef } from 'react';
import { Camera, Search, AlertTriangle, X } from 'lucide-react';
import { Veiculo } from '../types';
import { supabase } from '../lib/supabase';

interface VeiculoInputProps {
  index: number;
  veiculo: Veiculo;
  onChange: (index: number, veiculo: Veiculo) => void;
}

export const VeiculoInput: React.FC<VeiculoInputProps> = ({ index, veiculo, onChange }) => {
  const [consultando, setConsultando] = useState(false);
  const [erro, setErro] = useState('');
  const [fotoSelecionada, setFotoSelecionada] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const encontrarModeloMaiorScore = (modeloAPI: string, dadosFipe: any[]) => {
    if (!dadosFipe || dadosFipe.length === 0) return null;

    const modeloNormalizado = modeloAPI.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const extrairValor = (texto_valor: string): number => {
      return parseFloat(texto_valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
    };

    const modelosOrdenados = [...dadosFipe].sort((a, b) => {
      if (a.score !== undefined && b.score !== undefined) {
        const scoreDiff = b.score - a.score;
        if (scoreDiff === 0) {
          return extrairValor(b.texto_valor) - extrairValor(a.texto_valor);
        }
        return scoreDiff;
      }
      return extrairValor(b.texto_valor) - extrairValor(a.texto_valor);
    });

    const melhorModelo = modelosOrdenados[0];

    if (melhorModelo) {
      console.log("Modelo selecionado:", melhorModelo.texto_modelo);
      console.log("Valor:", melhorModelo.texto_valor);
      if (melhorModelo.score !== undefined) {
        console.log("Score:", melhorModelo.score);
      }
      return melhorModelo;
    }

    return null;
  };

  const handlePlacaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const placa = e.target.value.toUpperCase();
    onChange(index, { ...veiculo, placa });

    if (erro) setErro('');

    if (placa.length === 7) {
      try {
        setConsultando(true);
        setErro('');

        const response = await fetch(
          `https://wdapi2.com.br/consulta/${placa}/5b04e685d1c92f5cb1dd6be9f417b872`
        );

        if (!response.ok) {
          throw new Error('Falha ao consultar a placa');
        }

        const data = await response.json();
        
        const modeloCompleto = `${data.marca} ${data.modelo}`;
        console.log("Modelo da API:", modeloCompleto);
        console.log("Dados FIPE completos:", data.fipe?.dados);
        
        const situacaoFurtoRoubo = data.situacao || 'Não consta';
        const chassi = data.chassi_completo || data.chassi || 'Não informado';
        
        const modeloEncontrado = encontrarModeloMaiorScore(modeloCompleto, data.fipe?.dados);
        
        if (modeloEncontrado) {
          const valorFipe = modeloEncontrado.texto_valor;
          const valor = valorFipe ? 
            parseFloat(valorFipe.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) : 
            undefined;

          onChange(index, { 
            ...veiculo, 
            placa,
            modelo: modeloEncontrado.texto_modelo,
            valor,
            situacaoFurtoRoubo,
            chassi
          });
        } else {
          onChange(index, { 
            ...veiculo, 
            placa,
            modelo: modeloCompleto,
            situacaoFurtoRoubo,
            chassi
          });
        }
      } catch (error) {
        setErro('Erro ao consultar a placa. Verifique se a placa está correta.');
      } finally {
        setConsultando(false);
      }
    }
  };

  const getGeolocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocalização não suportada pelo navegador."));
      }
    });
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const { latitude, longitude } = await getGeolocation();
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const fotoBase64 = reader.result as string;
          const timestamp = new Date().toISOString();
          const fileName = `foto_veiculo_${index + 1}_${timestamp}_${latitude}_${longitude}.jpg`;
          
          try {
            // Upload the photo to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('vehicle-photos')
              .upload(fileName, file);

            if (uploadError) {
              throw uploadError;
            }

            const { data: urlData } = supabase.storage
              .from('vehicle-photos')
              .getPublicUrl(fileName);

            const photoUrl = urlData.publicUrl;

            setFotoSelecionada(true);
            setPreviewUrl(fotoBase64);
            
            // Update vehicle state with photo data
            onChange(index, {
              ...veiculo,
              foto: photoUrl,
              fotoBase64: fotoBase64, // Keep base64 for preview
              geolocalizacao: { latitude, longitude },
              valor: veiculo.valor || 50000,
              dataFoto: timestamp,
              nomeArquivo: fileName
            });
            
            console.log(`Foto salva para veículo ${index + 1}:`, {
              url: photoUrl,
              nomeArquivo: fileName,
              latitude,
              longitude,
              tamanho: file.size,
              tipo: file.type,
              hora: timestamp
            });
          } catch (error) {
            console.error("Erro ao fazer upload da foto:", error);
            setErro("Erro ao salvar a foto. Por favor, tente novamente.");
          }
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Erro ao processar foto:", error);
        setErro("Não foi possível processar a foto. Verifique as permissões do navegador.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoverFoto = async () => {
    if (veiculo.nomeArquivo) {
      try {
        const { error } = await supabase.storage
          .from('vehicle-photos')
          .remove([veiculo.nomeArquivo]);

        if (error) {
          console.error("Erro ao remover foto:", error);
        }
      } catch (error) {
        console.error("Erro ao remover foto:", error);
      }
    }

    setFotoSelecionada(false);
    setPreviewUrl(null);
    onChange(index, {
      ...veiculo,
      foto: undefined,
      fotoBase64: undefined,
      geolocalizacao: undefined,
      dataFoto: undefined,
      nomeArquivo: undefined
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(e.target.value);
    onChange(index, { ...veiculo, valor: isNaN(valor) ? undefined : valor });
  };

  const formatarValor = (valor: number | undefined) => {
    if (valor === undefined) return '';
    return valor.toString();
  };

  const temRestricao = veiculo.situacaoFurtoRoubo && 
    !["Sem restrição", "Não consultado"].includes(veiculo.situacaoFurtoRoubo.trim());

  return (
    <div className="p-6 border border-[#404040] rounded-xl bg-[#1a1a1a]">
      <div className="flex items-center justify-between mb-6">
        <div className="bg-[#2196F3]/10 px-4 py-2 rounded-lg border border-[#2196F3]/20">
          <h2 className="text-xl font-semibold text-[#2196F3]">Veículo {index + 1}</h2>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Placa do Veículo
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={7}
              placeholder="ABC1234"
              value={veiculo.placa || ''}
              onChange={handlePlacaChange}
              className={`w-full h-12 px-4 pr-12 border ${erro ? 'border-red-500' : 'border-[#404040]'} rounded-xl bg-[#2d2d2d] text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent placeholder-gray-500`}
            />
            {consultando && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2196F3]"></div>
              </div>
            )}
            {!consultando && veiculo.placa && veiculo.placa.length === 7 && (
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2196F3]" size={20} />
            )}
          </div>
          {erro && (
            <p className="mt-2 text-sm text-red-500">{erro}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Modelo do Veículo
          </label>
          <input
            type="text"
            placeholder="Modelo"
            value={veiculo.modelo || ''}
            readOnly
            className="w-full h-12 px-4 border border-[#404040] rounded-xl bg-[#2d2d2d] text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Chassi do Veículo
          </label>
          <input
            type="text"
            placeholder="Chassi"
            value={veiculo.chassi || ''}
            readOnly
            className="w-full h-12 px-4 border border-[#404040] rounded-xl bg-[#2d2d2d] text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Foto do Veículo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFotoChange}
              className="hidden"
              id={`foto-${index}`}
              ref={fileInputRef}
              disabled={uploading}
            />
            <label
              htmlFor={`foto-${index}`}
              className={`w-full h-12 px-4 border border-[#404040] rounded-xl bg-[#2d2d2d] text-white flex items-center justify-center cursor-pointer hover:bg-[#404040] transition-colors ${fotoSelecionada ? 'border-[#4CAF50]' : ''} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2196F3] mr-2"></div>
                  <span>Salvando foto...</span>
                </>
              ) : (
                <>
                  <Camera className={`mr-2 ${fotoSelecionada ? 'text-[#4CAF50]' : 'text-gray-400'}`} size={20} />
                  {fotoSelecionada ? 'Alterar foto' : 'Adicionar foto'}
                </>
              )}
            </label>
          </div>

          {previewUrl && (
            <div className="mt-4 relative">
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt={`Veículo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemoverFoto}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                  disabled={uploading}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-2 p-3 bg-[#2d2d2d] rounded-lg space-y-2">
                <p className="text-sm text-[#4CAF50]">Foto carregada com sucesso!</p>
                {veiculo.geolocalizacao && (
                  <p className="text-xs text-gray-400">
                    Localização: {veiculo.geolocalizacao.latitude.toFixed(6)}, {veiculo.geolocalizacao.longitude.toFixed(6)}
                  </p>
                )}
                {veiculo.dataFoto && (
                  <p className="text-xs text-gray-400">
                    Data: {new Date(veiculo.dataFoto).toLocaleString()}
                  </p>
                )}
                {veiculo.nomeArquivo && (
                  <p className="text-xs text-gray-400">
                    Arquivo: {veiculo.nomeArquivo}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Valor do Veículo
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={formatarValor(veiculo.valor)}
            onChange={handleValorChange}
            className="w-full h-12 px-4 border border-[#404040] rounded-xl bg-[#2d2d2d] text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent placeholder-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Situação Furto/Roubo
          </label>
          <div className="w-full h-12 px-4 border border-[#404040] rounded-xl bg-[#2d2d2d] text-white flex items-center justify-between">
            {temRestricao ? (
              <span className="animate-pulse text-red-500 font-medium flex items-center">
                {veiculo.situacaoFurtoRoubo}
                <AlertTriangle size={20} className="ml-2 text-red-500" />
              </span>
            ) : (
              <span className="text-white">{veiculo.situacaoFurtoRoubo || 'Não consultado'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};