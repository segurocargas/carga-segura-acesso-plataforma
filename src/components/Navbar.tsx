
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-cargo-blue font-bold text-xl">CargaSegura</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/#features" className="text-gray-600 hover:text-cargo-blue px-3 py-2 text-sm font-medium">
              Recursos
            </Link>
            <Link to="/#about" className="text-gray-600 hover:text-cargo-blue px-3 py-2 text-sm font-medium">
              Sobre Nós
            </Link>
            <Link to="/#contact" className="text-gray-600 hover:text-cargo-blue px-3 py-2 text-sm font-medium">
              Contato
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="ml-2">
                Entrar
              </Button>
            </Link>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-cargo-blue focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            <Link 
              to="/#features" 
              className="text-gray-600 hover:text-cargo-blue block px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link 
              to="/#about" 
              className="text-gray-600 hover:text-cargo-blue block px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre Nós
            </Link>
            <Link 
              to="/#contact" 
              className="text-gray-600 hover:text-cargo-blue block px-3 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
            <Link 
              to="/dashboard" 
              className="block w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" className="w-full mt-2">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
