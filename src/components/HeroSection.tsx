
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Truck, Lock } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="cargo-gradient py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Proteção Total para sua Carga
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto">
            Seguro simplificado para transportadoras e empresas de logística. Proteja sua carga com apenas alguns cliques.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/dashboard">
              <Button className="bg-white text-cargo-blue hover:bg-cargo-light px-6 py-3">
                Acessar Plataforma
              </Button>
            </Link>
            <Link to="/#features">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-cargo-light rounded-lg cargo-shadow">
              <div className="p-3 rounded-full bg-cargo-blue text-white mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cargo-dark">Proteção Completa</h3>
              <p className="text-gray-600">Cobertura abrangente para diversos tipos de carga e riscos de transporte.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-cargo-light rounded-lg cargo-shadow">
              <div className="p-3 rounded-full bg-cargo-teal text-white mb-4">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cargo-dark">Rastreamento em Tempo Real</h3>
              <p className="text-gray-600">Acompanhe suas cargas e apólices de seguro em tempo real através da nossa plataforma.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-cargo-light rounded-lg cargo-shadow">
              <div className="p-3 rounded-full bg-cargo-green text-white mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cargo-dark">Processo Simplificado</h3>
              <p className="text-gray-600">Cotação, contratação e gestão de sinistros com facilidade e rapidez.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
