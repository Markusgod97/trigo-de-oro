'use client';

import { ShoppingCart, User, Star, MapPin, Phone, Facebook, Instagram, Twitter, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discount: number;
  emoji: string;
  rating: number;
  quantity: number;
}

export default function Home() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  });

  const products = [
    {
      id: 1,
      name: 'Pan Integral',
      description: '100% natural con semillas',
      price: 4250,
      oldPrice: 5000,
      discount: 15,
      emoji: '🥖',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Croissant Francés',
      description: 'Mantequilla premium importada',
      price: 3500,
      oldPrice: 4000,
      discount: 12,
      emoji: '🥐',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Pan de Chocolate',
      description: 'Con chips de chocolate belga',
      price: 5200,
      oldPrice: 6000,
      discount: 13,
      emoji: '🍫',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Baguette Tradicional',
      description: 'Receta francesa auténtica',
      price: 3800,
      oldPrice: null,
      discount: 0,
      emoji: '🥖',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Pan de Centeno',
      description: 'Rico en fibra y nutrientes',
      price: 4500,
      oldPrice: 5500,
      discount: 18,
      emoji: '🍞',
      rating: 4.5
    },
    {
      id: 6,
      name: 'Rosca de Canela',
      description: 'Suave y aromática',
      price: 6000,
      oldPrice: 7000,
      discount: 14,
      emoji: '🥨',
      rating: 4.9
    }
  ];

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <span className="text-2xl sm:text-3xl -rotate-12">🌾</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                  TRIGO DE ORO
                </h1>
                <p className="text-xs text-orange-600 font-semibold">Bakery & Café</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 font-semibold hover:text-orange-600 transition">Inicio</a>
              <a href="#menu" className="text-gray-700 font-semibold hover:text-orange-600 transition">Menú</a>
              <a href="#ofertas" className="text-gray-700 font-semibold hover:text-orange-600 transition">Ofertas</a>
              <a href="#contacto" className="text-gray-700 font-semibold hover:text-orange-600 transition">Contacto</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCart(!showCart)}
                className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full hover:shadow-lg transition transform hover:scale-110"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => currentUser ? router.push('/perfil') : router.push('/login')}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition transform hover:scale-110 relative group"
              >
                <User size={20} />
                {currentUser && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{item.emoji}</span>
                          <div>
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-600">${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 w-8 h-8 rounded-full font-bold hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-orange-500 text-white w-8 h-8 rounded-full font-bold hover:bg-orange-600"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-orange-600">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">${getTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition transform hover:-translate-y-1">
                  Proceder al Pago
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative max-w-xl text-white">
            <span className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold inline-block mb-4 animate-pulse">
              ¡NUEVO!
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">El Mejor Pan de Bogotá</h2>
            <p className="text-lg sm:text-xl mb-8 text-orange-50">Ingredientes premium, horneado fresco cada día</p>
            <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center space-x-2">
              <span>Pide Ahora</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Productos Section */}
      <section id="menu" className="container mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <h3 className="text-3xl sm:text-4xl font-black text-gray-800">Más Vendidos</h3>
          <button className="text-orange-600 font-bold hover:text-orange-700 transition flex items-center space-x-1">
            <span>Ver Todos</span>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="h-48 sm:h-56 bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center relative">
                <span className="text-6xl sm:text-8xl">{product.emoji}</span>
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-800">{product.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm block">
                        ${product.oldPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-orange-600">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition transform hover:scale-110"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ofertas Section */}
      <section id="ofertas" className="container mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl sm:text-4xl font-black mb-4">¡Descuentos Especiales!</h3>
          <p className="text-lg sm:text-xl mb-6 text-orange-50">Hasta 20% OFF en productos seleccionados</p>
          <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-xl transition transform hover:-translate-y-1">
            Ver Ofertas
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-white mt-20 py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Clock size={20} className="text-orange-600" />
                <span>Horarios</span>
              </h5>
              <p className="text-gray-600 text-sm mb-2">Lunes - Viernes: 6:00am - 9:00pm</p>
              <p className="text-gray-600 text-sm">Sábados: 7:00am - 10:00pm</p>
              <p className="text-gray-600 text-sm">Domingos: 8:00am - 8:00pm</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <MapPin size={20} className="text-orange-600" />
                <span>Ubicación</span>
              </h5>
              <p className="text-gray-600 text-sm mb-2">📍 Calle 72 #10-34</p>
              <p className="text-gray-600 text-sm">Bogotá, Colombia</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Phone size={20} className="text-orange-600" />
                <span>Contacto</span>
              </h5>
              <p className="text-gray-600 text-sm mb-2">📞 (601) 234-5678</p>
              <p className="text-gray-600 text-sm">📧 info@trigodeoro.com</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4">Síguenos</h5>
              <div className="flex space-x-4">
                <button title="Facebook" aria-label="Facebook" className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                  <Facebook size={20} />
                </button>
                <button title="Instagram" aria-label="Instagram" className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                  <Instagram size={20} />
                </button>
                <button title="Twitter" aria-label="Twitter" className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-lg transition transform hover:scale-110 flex items-center justify-center">
                  <Twitter size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
            © 2025 Trigo de Oro. Diseñado con ❤️ en Bogotá
          </div>
        </div>
      </footer>
    </div>
  );
}