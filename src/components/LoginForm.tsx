
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulating login process
    setTimeout(() => {
      // For demo purposes, let's consider admin@cargasegura.com with password "123456" as valid credentials
      if (email === 'admin@cargasegura.com' && password === '123456') {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à plataforma CargaSegura",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "E-mail ou senha incorretos. Tente novamente.",
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Acesso à Plataforma</CardTitle>
        <CardDescription className="text-center">
          Entre com suas credenciais para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.email}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="#" className="text-sm text-cargo-blue hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.password}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-cargo-blue hover:bg-cargo-blue/90"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-500">Não tem uma conta? </span>
          <a href="#" className="text-cargo-blue hover:underline">
            Entre em contato
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center text-center text-xs text-gray-500">
        <p>Use admin@cargasegura.com / 123456 para testar</p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
