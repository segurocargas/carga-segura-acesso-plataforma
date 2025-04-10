
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import LoginForm from '@/components/LoginForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <Features />
      
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:space-x-10">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-cargo-dark mb-6">
                Sobre a CargaSegura
              </h2>
              <p className="text-gray-600 mb-4">
                A CargaSegura é uma plataforma inovadora de gerenciamento de seguros de carga, criada para simplificar e otimizar todo o processo de contratação e gestão de apólices.
              </p>
              <p className="text-gray-600 mb-4">
                Nossa missão é proporcionar tranquilidade e segurança para transportadoras e empresas de logística, garantindo que suas cargas estejam protegidas contra os diversos riscos do transporte.
              </p>
              <p className="text-gray-600">
                Com uma equipe especializada e anos de experiência no setor, desenvolvemos soluções que realmente atendem às necessidades do mercado de transporte de cargas.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-50 p-8 rounded-lg cargo-shadow">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
