export interface Factura {
  id: string;
  numero: string;
  fecha: string;
  hora: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion?: string;
    identificacion?: string;
  };
  items: FacturaItem[];
  subtotal: number;
  iva: number;
  total: number;
  metodoPago: string;
  estado: 'Pagado' | 'Pendiente' | 'Cancelado';
  qrData?: string;
}

export interface FacturaItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  subtotal: number;
}

export interface Cliente {
  nombre: string;
  email: string;
  telefono: string;
  direccion?: string;
  identificacion?: string;
}

// Generar número de factura único
export const generarNumeroFactura = (): string => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TDO-${year}${month}${day}-${random}`;
};

// Calcular totales
export const calcularTotales = (items: FacturaItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const iva = Math.round(subtotal * 0.19); // 19% de IVA para Colombia
  const total = subtotal + iva;
  
  return { subtotal, iva, total };
};

// Crear factura
export const crearFactura = (
  cliente: Cliente,
  items: FacturaItem[],
  metodoPago: string = 'Tarjeta de Crédito'
): Factura => {
  const fecha = new Date();
  const numeroFactura = generarNumeroFactura();
  const { subtotal, iva, total } = calcularTotales(items);
  
  const factura: Factura = {
    id: `factura_${Date.now()}`,
    numero: numeroFactura,
    fecha: fecha.toLocaleDateString('es-CO'),
    hora: fecha.toLocaleTimeString('es-CO'),
    cliente,
    items,
    subtotal,
    iva,
    total,
    metodoPago,
    estado: 'Pagado',
  };
  
  return factura;
};

// Generar datos para QR
export const generarQRData = (factura: Factura): string => {
  const qrData = {
    empresa: 'Trigo de Oro Bakery & Café',
    nit: '901234567-8', // NIT de ejemplo
    numero: factura.numero,
    fecha: factura.fecha,
    cliente: factura.cliente.nombre,
    identificacion: factura.cliente.identificacion || 'N/A',
    subtotal: factura.subtotal,
    iva: factura.iva,
    total: factura.total,
    estado: factura.estado,
    metodoPago: factura.metodoPago,
    items: factura.items.length,
    timestamp: Date.now()
  };
  
  return JSON.stringify(qrData);
};

// Guardar factura en localStorage
export const guardarFactura = (factura: Factura): void => {
  const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
  facturas.push(factura);
  localStorage.setItem('facturas', JSON.stringify(facturas));
};

// Obtener factura por ID
export const obtenerFactura = (id: string): Factura | null => {
  const facturas = JSON.parse(localStorage.getItem('facturas') || '[]');
  return facturas.find((f: Factura) => f.id === id) || null;
};

// Obtener todas las facturas
export const obtenerFacturas = (): Factura[] => {
  return JSON.parse(localStorage.getItem('facturas') || '[]');
};