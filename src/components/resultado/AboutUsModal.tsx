
import React from 'react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2d2d2d] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#404040]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Quem Somos</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-300 leading-relaxed">
            Somos a solução certa para você que trabalha com transporte de veículos usando cegonhas e guinchos. 
            Nosso seguro é projetado para ser prático, rápido e acessível, garantindo que você possa focar no que 
            realmente importa: crescer seu negócio.
          </p>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">O que nos diferencia:</h3>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                <h4 className="text-[#2196F3] font-medium mb-2">Praticidade</h4>
                <p className="text-gray-300">Processos simples e diretos.</p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                <h4 className="text-[#2196F3] font-medium mb-2">Velocidade</h4>
                <p className="text-gray-300">Respostas rápidas para não atrasar suas operações.</p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#404040]/30">
                <h4 className="text-[#2196F3] font-medium mb-2">Preços Acessíveis</h4>
                <p className="text-gray-300">Sem sacrificar a qualidade, oferecemos o melhor custo-benefício do mercado.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2196F3]/10 p-6 rounded-xl border border-[#2196F3]/20">
            <p className="text-white text-center">
              Escolha a tranquilidade e a segurança com a gente. Junte-se a nós e veja como podemos ajudar seu negócio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
