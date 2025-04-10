import React, { useState, useEffect } from 'react';
import { History, ChevronDown, Share2, Send, Car, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/format';

interface Consultation {
  id: string;
  created_at: string;
  origin_state: string;
  origin_city: string;
  destination_state: string;
  destination_city: string;
  vehicles: any[];
  total_value: number;
  insurance_value: number;
  percentage: number;
}

export function ConsultationHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConsultations();
    }
  }, [isOpen]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setConsultations(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  const enviarFotos = async (veiculos: any[]) => {
    const fotosPromises = veiculos
      .filter(veiculo => veiculo.foto)
      .map((veiculo) => {
        if (veiculo.foto) {
          const base64Data = veiculo.foto.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          const fotoUrl = URL.createObjectURL(blob);
          
          window.open(fotoUrl, '_blank');
          setTimeout(() => URL.revokeObjectURL(fotoUrl), 100);
        }
      });

    await Promise.all(fotosPromises);
  };

  const compartilharWhatsApp = async (consultation: Consultation) => {
    const veiculosTexto = consultation.vehicles.map((veiculo, index) => `
*Veículo ${index + 1}*
${veiculo.modelo ? `Modelo: ${veiculo.modelo}` : ''}
${veiculo.placa ? `Placa: ${veiculo.placa}` : ''}
${veiculo.geolocalizacao ? `Localização: ${veiculo.geolocalizacao.latitude.toFixed(6)}, ${veiculo.geolocalizacao.longitude.toFixed(6)}` : ''}
${veiculo.dataFoto ? `Data da Foto: ${new Date(veiculo.dataFoto).toLocaleString()}` : ''}`).join('\n');

    const mensagem = `
AXA Seguro
Apólice nº 106540012538-001

*Consulta de Seguro*
Origem: ${consultation.origin_state} - ${consultation.origin_city}
Destino: ${consultation.destination_state} - ${consultation.destination_city}

*Veículos:*
${veiculosTexto}

*Valor Total do Seguro:* ${formatCurrency(consultation.insurance_value)}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem.trim())}`, '_blank');
    await enviarFotos(consultation.vehicles);
  };

  const fazerSeguro = async (consultation: Consultation) => {
    const veiculosTexto = consultation.vehicles.map((veiculo, index) => `
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
Origem: ${consultation.origin_state} - ${consultation.origin_city}
Destino: ${consultation.destination_state} - ${consultation.destination_city}

*Veículos:*
${veiculosTexto}

*Valor Total do Seguro:* ${formatCurrency(consultation.insurance_value)}

Solicito averbação do seguro para os veículos acima.`;

    window.open(`https://wa.me/5571992620566?text=${encodeURIComponent(mensagem.trim())}`, '_blank');
    await enviarFotos(consultation.vehicles);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        title="Ver histórico de consultas"
      >
        <History size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-[#2d2d2d] w-full max-w-3xl rounded-t-xl sm:rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-[#404040] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={24} className="text-[#2196F3]" />
            <h2 className="text-xl font-semibold text-white">Histórico de Consultas</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2196F3]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : consultations.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Nenhuma consulta encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="bg-[#1a1a1a] rounded-xl p-4 border border-[#404040]/30"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-[#2196F3]">
                      <Car size={20} />
                      <span className="font-medium">
                        {consultation.vehicles.length} veículo{consultation.vehicles.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(consultation.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="text-green-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Origem</p>
                        <p className="text-white">
                          {consultation.origin_city}, {consultation.origin_state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={20} className="text-red-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400">Destino</p>
                        <p className="text-white">
                          {consultation.destination_city}, {consultation.destination_state}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#2d2d2d] p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Valor Total</p>
                      <p className="text-white font-medium">
                        {formatCurrency(consultation.total_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Valor do Seguro</p>
                      <p className="text-[#4CAF50] font-medium">
                        {formatCurrency(consultation.insurance_value)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Veículos</p>
                    <div className="space-y-2">
                      {consultation.vehicles.map((vehicle: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 bg-[#2d2d2d] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Car size={16} className="text-[#2196F3]" />
                            <div>
                              <span className="text-white">
                                {vehicle.placa || 'Placa não informada'}
                              </span>
                              {vehicle.modelo && (
                                <p className="text-sm text-[#2196F3]">
                                  {vehicle.modelo}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[#4CAF50]">
                            {formatCurrency(vehicle.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={() => compartilharWhatsApp(consultation)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-lg transition-colors group"
                    >
                      <Send size={18} className="mr-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => fazerSeguro(consultation)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-lg transition-colors group"
                    >
                      <Share2 size={18} className="mr-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      Solicitar Averbação do Seguro
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}