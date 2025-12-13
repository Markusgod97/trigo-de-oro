'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

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
  const loadingContainerStyle = {
    width: size,
    height: size,   
};

  if (!qrCodeUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`} 
        style={loadingContainerStyle}
      >
        <p className="text-gray-500">Generando código QR...</p>
      </div>
    );   
  };
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image 
        src={qrCodeUrl} 
        alt="Código QR de la factura"   
        width={size}
        height={size}
        className="rounded-lg border-4 border-white shadow-lg"
        unoptimized
      />
      <p className="mt-2 text-xs text-gray-500 text-center">
        Escanee para verificar la factura
      </p>
    </div>
  );
}