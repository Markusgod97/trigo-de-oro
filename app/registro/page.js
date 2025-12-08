'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegistroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (10 dígitos)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      // Obtener usuarios existentes
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el email ya existe
      const emailExists = users.some(u => u.email === formData.email);
      
      if (emailExists) {
        setErrors({ general: 'Este correo ya está registrado' });
        setIsLoading(false);
        return;
      }

      // Agregar nuevo usuario
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Guardar sesión
      localStorage.setItem('currentUser', JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }));

      // Redirigir al perfil
      router.push('/perfil');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center p-4 py-12">
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
          <p className="text-gray-600 text-lg">Crea tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Registro
          </h2>

          {errors.general && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

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

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="3001234567"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.phone}</span>
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

            {/* Confirmar Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Términos */}
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">
                  Acepto los{' '}
                  <a href="#" className="text-orange-600 font-semibold hover:text-orange-700">
                    términos y condiciones
                  </a>
                  {' '}y la{' '}
                  <a href="#" className="text-orange-600 font-semibold hover:text-orange-700">
                    política de privacidad
                  </a>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.acceptTerms}</span>
                </p>
              )}
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
                  <span>Registrando...</span>
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-orange-600 font-bold hover:text-orange-700">
              Inicia sesión
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