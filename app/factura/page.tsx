'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Download, Printer, Mail, Share2, Check } from 'lucide-react';
import QRCodeFactura from '../components/QRCodeFactura';
import { Factura, obtenerFactura } from '../utils/facturacion';
import { generarQRData } from '../utils/facturacion';

export default function FacturaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const facturaId = searchParams.get('id');
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState<string>('');

  useEffect(() => {
    if (!facturaId) {
      router.push('/');
      return;
    }

    const facturaEncontrada = obtenerFactura(facturaId);
    
    if (facturaEncontrada) {
      setFactura(facturaEncontrada);
      setQrData(generarQRData(facturaEncontrada));
    } else {
      router.push('/');
    }
    
    setLoading(false);
  }, [facturaId, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!factura) return;
    const  element = document.getElementById('factura-content');
    if (!element) return;
 try {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      useCORS: true,
      background: '#ffffff',
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calcular dimensiones manteniendo proporción
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`factura-${factura.numero}.pdf`);
  } catch (error) {
    console.error('Error generando PDF:', error);
    // Fallback: abrir diálogo de impresión
    window.print();
  }
};

  const handleShare = async () => {
    if (!factura) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Factura ${factura.numero}`,
          text: `Factura de Trigo de Oro - Total: $${factura.total.toLocaleString()}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error compartiendo:', error);
    }
  };

  const handleSendEmail = () => {
    if (!factura) return;
    
    const subject = `Factura ${factura.numero} - Trigo de Oro`;
    const body = `Estimado/a ${factura.cliente.nombre},\n\nAdjunto su factura por valor de $${factura.total.toLocaleString()}.\n\nGracias por su compra.\n\nTrigo de Oro Bakery & Café`;
    
    window.location.href = `mailto:${factura.cliente.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando factura...</p>
        </div>
      </div>
    );
  }

  if (!factura) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header de acciones */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-3 justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Factura #{factura.numero}</h1>
            <p className="text-gray-600">Estado: 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                factura.estado === 'Pagado' 
                  ? 'bg-green-100 text-green-800' 
                  : factura.estado === 'Pendiente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {factura.estado}
              </span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <Printer size={18} />
              Imprimir
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Download size={18} />
              PDF
            </button>
            
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              <Mail size={18} />
              Email
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              {copied ? 'Copiado' : 'Compartir'}
            </button>
          </div>
        </div>

        {/* Contenido de la factura */}
        <div id="factura-content" className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sección izquierda - Información de la factura */}
            <div className="lg:col-span-2">
              {/* Encabezado */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-3xl font-bold text-orange-600">TRIGO DE ORO</h2>
                  <p className="text-gray-600">Bakery & Café</p>
                  <p className="text-gray-600">NIT: 901234567-8</p>
                  <p className="text-gray-600">Calle 72 #10-34, Bogotá</p>
                  <p className="text-gray-600">Tel: (601) 234-5678</p>
                </div>
                
                <div className="mt-4 sm:mt-0 text-right">
                  <h1 className="text-3xl font-black text-gray-800 mb-2">FACTURA</h1>
                  <p className="text-gray-600 font-medium">N°: {factura.numero}</p>
                  <p className="text-gray-600">Fecha: {factura.fecha}</p>
                  <p className="text-gray-600">Hora: {factura.hora}</p>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Datos del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-700">Nombre:</p>
                    <p className="text-gray-800">{factura.cliente.nombre}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Email:</p>
                    <p className="text-gray-800">{factura.cliente.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Teléfono:</p>
                    <p className="text-gray-800">{factura.cliente.telefono}</p>
                  </div>
                  {factura.cliente.identificacion && (
                    <div>
                      <p className="font-semibold text-gray-700">Identificación:</p>
                      <p className="text-gray-800">{factura.cliente.identificacion}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de productos */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles de la Compra</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                        <th className="p-3 text-left">Producto</th>
                        <th className="p-3 text-center">Cantidad</th>
                        <th className="p-3 text-right">Precio Unitario</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura.items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{item.emoji}</span>
                              <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Código: PROD-{item.id.toString().padStart(3, '0')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-3 text-right font-medium">
                            ${item.price.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-bold text-orange-600">
                            ${(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="ml-auto w-full sm:w-80">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${factura.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IVA (19%):</span>
                      <span className="font-medium">${factura.iva.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>TOTAL:</span>
                        <span className="text-orange-600">${factura.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Método de Pago:</p>
                    <p className="text-green-600 font-medium">✓ {factura.metodoPago}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Fecha de Vencimiento:</p>
                    <p className="text-gray-700">Al momento del pago</p>
                  </div>
                  <div>
                    <p className="font-semibold">Términos y Condiciones:</p>
                    <p className="text-gray-700">Productos sujetos a disponibilidad</p>
                  </div>
                  <div>
                    <p className="font-semibold">Autorización DIAN:</p>
                    <p className="text-gray-700">Resolución 18764012345678</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección derecha - QR y Resumen */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Código QR */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    Verificación Digital
                  </h3>
                  <div className="flex justify-center">
                    {qrData && <QRCodeFactura data={qrData} size={220} />}
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-600">
                    Este código QR contiene toda la información de la factura para su verificación.
                  </p>
                  <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
                    <p>Factura electrónica válida para la DIAN</p>
                    <p>Generado el: {new Date().toLocaleString('es-CO')}</p>
                  </div>
                </div>

                {/* Resumen de pago */}
                <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Resumen de Pago</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Referencia:</span>
                      <span className="font-mono font-bold">{factura.numero}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fecha:</span>
                      <span>{factura.fecha}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hora:</span>
                      <span>{factura.hora}</span>
                    </div>
                    <div className="border-t border-white/30 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Pagado:</span>
                        <span className="text-2xl">${factura.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/30">
                    <p className="text-sm text-center">
                      Gracias por su compra en Trigo de Oro
                    </p>
                    <p className="text-xs text-center mt-2 opacity-80">
                      ¡Vuelva pronto!
                    </p>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="bg-white rounded-xl p-4 shadow border">
                  <h4 className="font-bold text-gray-800 mb-3">¿Necesita ayuda?</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <span className="text-orange-600 font-medium mr-2">📧</span>
                      <span>facturacion@trigodeoro.com</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-orange-600 font-medium mr-2">📞</span>
                      <span>Servicio al cliente: (601) 234-5678</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-orange-600 font-medium mr-2">🕒</span>
                      <span>Horario: Lunes a Viernes 8am - 6pm</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Esta es una factura electrónica válida de acuerdo con la Resolución DIAN No. 18764012345678</p>
            <p className="mt-1">Trigo de Oro Bakery & Café • Calle 72 #10-34, Bogotá • NIT: 901234567-8</p>
            <p className="mt-1">Factura generada automáticamente por el sistema de Trigo de Oro</p>
          </div>
        </div>

        {/* Botones finales */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}