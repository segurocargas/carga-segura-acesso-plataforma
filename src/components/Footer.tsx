
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cargo-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CargaSegura</h3>
            <p className="text-gray-300 mb-4">
              Proteção e tranquilidade para o transporte da sua carga.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-300 hover:text-white">
                  Recursos
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-gray-300 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                  Acesso à Plataforma
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Seguro de Transporte Nacional</li>
              <li className="text-gray-300">Seguro de Transporte Internacional</li>
              <li className="text-gray-300">Seguro de Responsabilidade Civil</li>
              <li className="text-gray-300">Gestão de Riscos</li>
            </ul>
          </div>
          
          <div id="contact">
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2" />
                contato@cargasegura.com.br
              </li>
              <li className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2" />
                0800 123 4567
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Av. Paulista, 1000, São Paulo - SP, 01310-100</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} CargaSegura. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
