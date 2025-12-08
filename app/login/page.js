'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simular llamada a API
    setTimeout(() => {
      // Obtener usuarios del localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Buscar usuario
      const user = users.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Guardar sesión
        localStorage.setItem('currentUser', JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone
        }));
        
        // Redirigir al perfil
        router.push('/perfil');
      } else {
        setErrors({ general: 'Correo o contraseña incorrectos' });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <span className="text-4xl -rotate-12">🌾</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  TRIGO DE ORO
                </h1>
              </div>
            </div>
          </Link>
          <p className="text-gray-600 text-lg">Bienvenido de nuevo</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {errors.general && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Recordar y Olvidaste */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-orange-600 font-semibold hover:text-orange-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">o continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center space-x-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
              <span className="text-xl">G</span>
              <span className="font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
              <span className="text-xl">f</span>
              <span className="font-semibold text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Registro */}
          <p className="text-center text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-orange-600 font-bold hover:text-orange-700">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Volver al inicio */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-orange-600 font-semibold transition">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}