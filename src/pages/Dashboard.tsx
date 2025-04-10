
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Truck,
  FileText,
  AlertTriangle,
  BarChart3,
  Clock,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-cargo-blue font-bold text-xl">CargaSegura</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Olá, Administrador</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="text-gray-600">Bem-vindo à plataforma de gestão de seguros de carga</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Apólices Ativas</p>
                  <p className="text-2xl font-bold">37</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-cargo-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cargas em Trânsito</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Truck className="h-6 w-6 text-cargo-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Sinistros Abertos</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Valor Segurado</p>
                  <p className="text-2xl font-bold">R$ 2,5M</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-cargo-teal" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Suas Apólices Recentes</CardTitle>
                <CardDescription>Visualize e gerencie suas apólices de seguro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-cargo-blue/10 rounded mr-4">
                          <Package className="h-5 w-5 text-cargo-blue" />
                        </div>
                        <div>
                          <p className="font-medium">Apólice #{Math.floor(Math.random() * 10000)}</p>
                          <p className="text-sm text-gray-500">Eletrônicos - São Paulo → Rio de Janeiro</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-4 text-cargo-blue">Ver todas as apólices</Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Atividades Recentes</CardTitle>
                <CardDescription>Últimas movimentações no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: <FileText className="h-4 w-4" />, text: "Nova apólice emitida", time: "Há 2 horas" },
                    { icon: <Truck className="h-4 w-4" />, text: "Carga #8721 em trânsito", time: "Há 5 horas" },
                    { icon: <AlertTriangle className="h-4 w-4" />, text: "Sinistro reportado", time: "Ontem" },
                    { icon: <Clock className="h-4 w-4" />, text: "Renovação pendente", time: "2 dias atrás" }
                  ].map((item, index) => (
                    <div key={index} className="flex">
                      <div className="p-2 bg-gray-100 rounded mr-3">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
