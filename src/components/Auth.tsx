import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  LogIn,
  UserPlus,
  AlertCircle,
  Mail,
  Lock,
  User,
  MapPin,
  Building2,
  FileImage,
  Phone,
  Building,
  Navigation,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { estados } from '../data/estados';

interface AuthProps {
  onAuthSuccess: () => void;
}

const businessTypes = [
  { value: 'patio', label: 'Pátio' },
  { value: 'transportadora', label: 'Transportadora' },
  { value: 'cegonheiro', label: 'Cegonheiro' },
  { value: 'guincho', label: 'Guincho' },
  { value: 'locadora', label: 'Locadora' },
  { value: 'concessionaria', label: 'Concessionária de veículos' },
  { value: 'seminovos', label: 'Seminovos' },
  { value: 'mudancas', label: 'Mudanças' }
];

export function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [cnhPhoto, setCnhPhoto] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isSignUp) {
      getCurrentLocation();
    }
  }, [isSignUp, getCurrentLocation]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setCompanyName('');
    setPhone1('');
    setPhone2('');
    setState('');
    setCity('');
    setBusinessType('');
    setCnhPhoto(null);
    setError(null);
    setSuccessMessage(null);
    setLocation(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (resetPassword) {
        if (!email.trim()) {
          throw new Error('Por favor, informe seu email');
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setSuccessMessage('Instruções de recuperação de senha foram enviadas para seu email.');
        setTimeout(() => {
          setResetPassword(false);
          resetForm();
        }, 3000);
        return;
      }

      if (isSignUp) {
        if (!name.trim()) throw new Error('O nome é obrigatório');
        if (!companyName.trim()) throw new Error('O nome da empresa é obrigatório');
        if (!phone1.trim()) throw new Error('O telefone principal é obrigatório');
        if (!state) throw new Error('O estado é obrigatório');
        if (!city.trim()) throw new Error('A cidade é obrigatória');
        if (!businessType) throw new Error('O segmento do negócio é obrigatório');
        if (!email.trim()) throw new Error('O email é obrigatório');
        if (!password) throw new Error('A senha é obrigatória');
        if (password !== confirmPassword) throw new Error('As senhas não coincidem');
        if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              company_name: companyName,
              phone1,
              phone2,
              state,
              city,
              business_type: businessType,
              cnh_photo: cnhPhoto,
              latitude: location?.latitude,
              longitude: location?.longitude
            },
          },
        });

        if (error) {
          if (error.message.includes('user_already_exists') || error.message.includes('User already registered')) {
            throw new Error('Este email já está cadastrado. Por favor, faça login ou use outro email.');
          }
          throw error;
        }

        setSuccessMessage('Conta criada com sucesso! Você já pode fazer login.');
        setTimeout(() => {
          setIsSignUp(false);
          resetForm();
        }, 3000);
      } else {
        if (!email.trim() || !password) {
          throw new Error('Por favor, preencha todos os campos');
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou senha incorretos');
          }
          throw error;
        }

        onAuthSuccess();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCNHUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnhPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formKey = isSignUp ? 'signup' : (resetPassword ? 'reset' : 'login');

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2d2d2d] rounded-xl shadow-lg p-8">
          <h1
            onClick={() => {
              if (isSignUp || resetPassword) {
                setIsSignUp(false);
                setResetPassword(false);
                resetForm();
              }
            }}
            className={`text-4xl font-black text-white logo-font bg-gradient-to-r from-[#2196F3] to-[#1976D2] bg-clip-text text-transparent text-center mb-8 ${(isSignUp || resetPassword) ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          >
            SeguroCargas
          </h1>

          <div className="text-[#2196F3] text-sm font-medium bg-[#2196F3]/10 px-3 py-1 rounded-full border border-[#2196F3]/20 whitespace-nowrap text-center mb-8">
            Versão 1.5.5
          </div>

          {resetPassword && (
            <div key="resetPasswordHeader" className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Recuperar Senha</h2>
              <p className="text-gray-400 text-sm">
                Digite seu email para receber as instruções de recuperação de senha
              </p>
            </div>
          )}

          <form
            key={formKey}
            onSubmit={handleAuth}
            className="space-y-6"
          >
            {isSignUp && !resetPassword && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      required
                    />
                    <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Nome da Empresa
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      required
                    />
                    <Building className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Telefone Principal
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone1}
                        onChange={(e) => setPhone1(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                        required
                      />
                      <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Telefone Secundário
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone2}
                        onChange={(e) => setPhone2(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      />
                      <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Estado
                  </label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o estado</option>
                      {Object.entries(estados).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      required
                    />
                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Localização Atual
                  </label>
                  <div className="relative">
                    <div className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white flex items-center">
                      <Navigation className="absolute left-3 text-gray-400" size={20} />
                      {locationLoading ? (
                        <span className="text-gray-400">Obtendo localização...</span>
                      ) : location ? (
                        <span className="text-gray-400">
                          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Localização não disponível</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Qual o Segmento do negócio
                  </label>
                  <div className="relative">
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o segmento do negócio</option>
                      {businessTypes.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <Building2 className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Foto da CNH
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCNHUpload}
                      className="hidden"
                      id="cnh-photo"
                      required
                    />
                    <label
                      htmlFor="cnh-photo"
                      className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white flex items-center cursor-pointer hover:bg-[#262626] transition-colors"
                    >
                      <FileImage className="absolute left-3 text-gray-400" size={20} />
                      <span className="text-gray-400">
                        {cnhPhoto ? 'Foto selecionada' : 'Selecionar foto da CNH'}
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                  required
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            {!resetPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-12 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {isSignUp && !resetPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-10 pr-12 bg-[#1a1a1a] border border-[#404040] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-green-500 mr-3 mt-0.5" size={20} />
                <p className="text-green-500 text-sm">{successMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-xl flex items-center justify-center text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : resetPassword ? (
                'Enviar instruções'
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} className="mr-2" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Entrar
                </>
              )}
            </button>

            <div className="flex flex-col items-center gap-2 text-sm">
              {!resetPassword && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    resetForm();
                  }}
                  className="text-[#2196F3] hover:text-[#1976D2] transition-colors"
                >
                  {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Criar nova conta'}
                </button>
              )}
              
              <button
                type="button"
                onClick={() => {
                  setResetPassword(!resetPassword);
                  resetForm();
                }}
                className="text-[#2196F3] hover:text-[#1976D2] transition-colors"
              >
                {resetPassword ? 'Voltar ao login' : 'Esqueceu sua senha?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}