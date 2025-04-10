
import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Headphones 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-cargo-blue" />,
      title: 'Cobertura Personalizada',
      description: 'Personalize sua apólice de acordo com o tipo de carga, rota e necessidades específicas da sua operação.'
    },
    {
      icon: <Clock className="h-10 w-10 text-cargo-teal" />,
      title: 'Contratação Rápida',
      description: 'Processo simplificado para contratação de seguro de carga, sem burocracia e com emissão imediata.'
    },
    {
      icon: <FileText className="h-10 w-10 text-cargo-green" />,
      title: 'Gestão de Documentos',
      description: 'Armazene e acesse todos os documentos relacionados às suas apólices e sinistros em um só lugar.'
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-cargo-blue" />,
      title: 'Relatórios e Análises',
      description: 'Visualize estatísticas e relatórios detalhados sobre suas apólices, sinistros e custos de seguro.'
    },
    {
      icon: <CreditCard className="h-10 w-10 text-cargo-teal" />,
      title: 'Pagamento Flexível',
      description: 'Diversas opções de pagamento para facilitar a contratação e renovação das suas apólices.'
    },
    {
      icon: <Headphones className="h-10 w-10 text-cargo-green" />,
      title: 'Suporte Dedicado',
      description: 'Equipe especializada disponível para ajudar em todas as etapas, desde a cotação até a resolução de sinistros.'
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-cargo-dark sm:text-4xl">
            Por que escolher a CargaSegura?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma foi desenvolvida pensando nas necessidades específicas do transporte de cargas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg cargo-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-cargo-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
