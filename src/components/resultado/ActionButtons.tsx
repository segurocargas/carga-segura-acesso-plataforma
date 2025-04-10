
import React from 'react';
import { Share2, Send } from 'lucide-react';

interface ActionButtonsProps {
  onShareWhatsApp: () => void;
  onRequestSeguro: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onShareWhatsApp, 
  onRequestSeguro 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <button
        onClick={onShareWhatsApp}
        className="flex-1 flex items-center justify-center px-6 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#128C7E]/20 text-base group"
      >
        <Send size={20} className="mr-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span>Enviar para WhatsApp</span>
      </button>
      <button
        onClick={onRequestSeguro}
        className="flex-1 flex items-center justify-center px-6 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-[#2196F3]/20 text-base group"
      >
        <Share2 size={20} className="mr-2.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span>Solicitar Averbação do Seguro</span>
      </button>
    </div>
  );
};
