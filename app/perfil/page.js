'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ShoppingBag, Heart, MapPin, LogOut, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Verificar si hay sesión
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(userData);
    setEditData({
      name: userData.name,
      phone: userData.phone
    });
    setIsLoading(false);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('currentUser');
    router.push('/');
}

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      phone: user.phone
    });
  };

  const handleSave = () => {
    // Actualizar datos del usuario en localStorage
    const updatedUser = {
      ...user,
      name: editData.name,
      phone: editData.phone
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Actualizar en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.email === user.email 
        ? { ...u, name: editData.name, phone: editData.phone }
        : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <span className="text-2xl -rotate-12">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  TRIGO DE ORO
                </h1>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Banner de Perfil */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <User size={48} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black mb-2">¡Hola, {user.name}!</h2>
                <p className="text-orange-50">Bienvenido a tu perfil</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Personal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Información Personal</h3>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      <Edit2 size={18} />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                      >
                        <Save size={16} />
                        <span>Guardar</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-1 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
                      >
                        <X size={16} />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <User size={18} className="text-orange-500" />
                      <span>Nombre Completo</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-xl">{user.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Mail size={18} className="text-orange-500" />
                      <span>Correo Electrónico</span>
                    </label>
                    <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-xl">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <Phone size={18} className="text-orange-500" />
                      <span>Teléfono</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-xl">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="space-y-6">
              {/* Mis Pedidos */}
              <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Mis Pedidos</h4>
                    <p className="text-sm text-gray-600">Ver historial</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-orange-600">0</div>
                <p className="text-sm text-gray-500">pedidos realizados</p>
              </div>

              {/* Favoritos */}
              <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Favoritos</h4>
                    <p className="text-sm text-gray-600">Productos guardados</p>
                  </div>
                </div>
                <div className="text-3xl font-black text-pink-600">0</div>
                <p className="text-sm text-gray-500">productos favoritos</p>
              </div>

              {/* Direcciones */}
              <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Direcciones</h4>
                    <p className="text-sm text-gray-600">Gestionar entregas</p>
                  </div>
                </div>
                <button className="w-full bg-blue-500 text-white py-2 rounded-full font-semibold hover:bg-blue-600 transition mt-2">
                  Agregar Dirección
                </button>
              </div>
            </div>
          </div>

          {/* Botón Volver */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              <span>← Volver a la tienda</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}