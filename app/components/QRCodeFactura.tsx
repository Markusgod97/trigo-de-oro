'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeFacturaProps {
  data: string;
  size?: number;
  className?: string;
}

export default function QRCodeFactura({ 
  data, 
  size = 200, 
  className = '' 
}: QRCodeFacturaProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrOptions = {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        };
        
        const url = await QRCode.toDataURL(data, qrOptions);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generando QR:', error);
      }
    };

    generateQR();
  }, [data, size]);

  if (!qrCodeUrl) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={qrCodeUrl} 
        alt="Código QR de la factura" 
        width={size}
        height={size}
        className="rounded-lg border-4 border-white shadow-lg"
      />
      <p className="mt-2 text-xs text-gray-500 text-center">
        Escanee para verificar la factura
      </p>
    </div>
  );
}