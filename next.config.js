/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'via.placeholder.com', // Ejemplo: si usas placeholders
        },
        // Añadir el dominio:
        /*
        {
            protocol: 'https',
            hostname: 'tu-servicio-de-storage.com',
        },
        */
    ],
  },
  env: {
    NEXT_PUBLIC_PROJECT_NAME: 'Trigo De Oro App',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  compiler: {
    // Elimina console.logs en producción para limpiar la consola del navegador
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
module.exports = nextConfig;