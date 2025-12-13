'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Share2, Printer, Home } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  { ssr: false }
);

export default function FacturaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [factura, setFactura] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const facturaId = searchParams.get('id');
      
      if (facturaId) {
        const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
        const facturaEncontrada = facturas.find(f => f.id === facturaId);
        
        if (facturaEncontrada) {
          setFactura(facturaEncontrada);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
  }, [searchParams, router]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    if (!factura) return;
    
    const facturaText = `
TRIGO DE ORO - Bakery & Café
================================
FACTURA DE VENTA
================================

Factura #: ${factura.numero}
Fecha: ${factura.fecha}
Cliente: ${factura.cliente.nombre}
Email: ${factura.cliente.email}
Teléfono: ${factura.cliente.telefono}

================================
PRODUCTOS
================================
${factura.items.map(item => 
  `${item.quantity}x ${item.name} - $${item.price.toLocaleString()} = $${(item.price * item.quantity).toLocaleString()}`
).join('\n')}

================================
RESUMEN
================================
Subtotal: $${factura.subtotal.toLocaleString()}
IVA (19%): $${factura.iva.toLocaleString()}
Total: $${factura.total.toLocaleString()}

================================
Método de Pago: ${factura.metodoPago}
Estado: ${factura.estado}

¡Gracias por su compra!
www.trigodeoro.com
    `;

    const blob = new Blob([facturaText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Factura_${factura.numero}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!factura) return;
    
    const shareData = {
      title: `Factura ${factura.numero} - Trigo de Oro`,
      text: `Factura de compra por $${factura.total.toLocaleString()} en Trigo de Oro`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  if (!mounted || !factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando factura...</p>
        </div>
      </div>
    );
  }

  const qrData = JSON.stringify({
    factura: factura.numero,
    total: factura.total,
    fecha: factura.fecha,
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">¡Compra Exitosa!</h1>
          <p className="text-gray-600 text-lg">Tu pedido ha sido procesado correctamente</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition shadow-lg"
          >
            <Printer size={20} />
            <span>Imprimir</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition shadow-lg"
          >
            <Download size={20} />
            <span>Descargar</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition shadow-lg"
          >
            <Share2 size={20} />
            <span>Compartir</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                  <span className="text-4xl -rotate-12">🌾</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black">TRIGO DE ORO</h2>
                  <p className="text-orange-100">Bakery & Café</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">Factura de Venta</p>
                <p className="text-2xl font-bold">#{factura.numero}</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Información de la Empresa</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Razón Social:</strong> Trigo de Oro S.A.S.</p>
                <p><strong>NIT:</strong> 900.123.456-7</p>
                <p><strong>Dirección:</strong> Calle 72 #10-34, Bogotá</p>
                <p><strong>Teléfono:</strong> (601) 234-5678</p>
                <p><strong>Email:</strong> info@trigodeoro.com</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Información del Cliente</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Nombre:</strong> {factura.cliente.nombre}</p>
                <p><strong>Email:</strong> {factura.cliente.email}</p>
                <p><strong>Teléfono:</strong> {factura.cliente.telefono}</p>
                <p><strong>Fecha:</strong> {factura.fecha}</p>
                <p><strong>Hora:</strong> {factura.hora}</p>
              </div>
            </div>
          </div>

          <div className="p-8 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Detalle de Productos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-orange-500">
                    <th className="text-left p-3 font-bold text-gray-700">Cant.</th>
                    <th className="text-left p-3 font-bold text-gray-700">Producto</th>
                    <th className="text-right p-3 font-bold text-gray-700">Precio</th>
                    <th className="text-right p-3 font-bold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-3 text-gray-800">{item.quantity}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right text-gray-800">${item.price.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-orange-600">
                        ${(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Resumen de Pago</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${factura.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (19%):</span>
                  <span className="font-semibold">${factura.iva.toLocaleString()}</span>
                </div>
                <div className="h-px bg-gray-300"></div>
                <div className="flex justify-between text-xl font-black text-orange-600">
                  <span>TOTAL:</span>
                  <span>${factura.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1"><strong>Método de Pago:</strong></p>
                <p className="text-lg font-bold text-green-700">{factura.metodoPago}</p>
                <p className="text-xs text-gray-500 mt-2">Estado: {factura.estado}</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Código QR</h3>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-orange-400">
                {mounted && (
                  <QRCodeSVG
                    value={qrData}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center max-w-xs">
                Escanea este código para verificar tu factura
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">¡Gracias por tu compra en Trigo de Oro!</p>
            <p className="text-xs text-gray-500">
              www.trigodeoro.com | info@trigodeoro.com | (601) 234-5678
            </p>
          </div>
        </div>

        <div className="text-center mt-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition"
          >
            <Home size={24} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}