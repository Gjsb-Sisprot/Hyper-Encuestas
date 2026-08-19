// Generador automático de cuadrículas y coordenadas estéticas SVG para los 300+ locales de C.C. Hiper Jumbo

export interface MallUnit {
  id: string
  nombre: string
  floor: 'PB' | 'PA' | 'SOT' | 'EXT'
  x: number
  y: number
  w: number
  h: number
  score: 'A1' | 'A2' | 'B' | 'C' | 'D' | 'E'
  cat: string
  prov: string
  estado: 'alquilado' | 'disponible' | 'obra' | 'legal'
  pago: number
  plan?: string
}

// Lista cruda de todos los locales extraídos directamente del informe real de ocupación y actualización SQL
export const rawLocalsList: Array<{ id: string; nombre: string; zona: string; cat: string; score?: string; prov?: string; pago?: number; plan?: string }> = [
  // ESTACIONAMIENTO & ZONAS ESPECIALES
  { id: 'ED01', nombre: 'ESTACIONAMIENTO GENERAL', zona: 'PLANTA BAJA', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 210 },
  { id: 'ESOT01', nombre: 'ESTACIONAMIENTO SÓTANO', zona: 'SOTANO', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 210 },
  
  // FERIA DE COMIDA (FC) - PLANTA ALTA / FERIA
  { id: 'FCK01', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Area Rentable', score: 'D', prov: 'Sin servicio' },
  { id: 'FCK02', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Area Rentable', score: 'D', prov: 'Sin servicio' },
  { id: 'FC01', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC01A', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC01B', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC02', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC03', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC03A', nombre: 'Joanes Lunch, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Comida Rápida', score: 'B', prov: 'Datos Móviles', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC04A', nombre: 'Express Hong Kong, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Asiático', score: 'B', prov: 'Otro', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC04B', nombre: 'Grill Mania, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Parrilla', score: 'B', prov: 'Inter', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC05', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC06', nombre: 'PIZZA MIA, C.A', zona: 'FERIA DE COMIDA', cat: 'Rest. Pizzería', score: 'B', prov: 'Inter', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC07', nombre: 'Inversiones Jumbo Foods, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Comida Rápida', score: 'B', prov: 'Fibex', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC08', nombre: 'Sazón Express, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Criollo', score: 'B', prov: 'NetUno', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC09', nombre: 'QUIMI 2511, C.A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Bebidas/Smoothies', score: 'B', prov: 'Sin servicio', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC10', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC11', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC12', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC13', nombre: 'MELENDEZ RUIZ INVERSIONES, C.A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Café/Postres', score: 'B', prov: '360NET', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC14', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC15', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC16', nombre: 'Art Look MF CA', zona: 'FERIA DE COMIDA', cat: 'Arte & Postres', score: 'B', prov: 'Inter', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC18', nombre: 'Kilaimin Jumbo, C. A.', zona: 'FERIA DE COMIDA', cat: 'Restaurante', score: 'B', prov: 'NetUno', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC19', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC20', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC21', nombre: 'Inversiones Sumo, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Sushi/Oriental', score: 'B', prov: 'Fibex', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC22', nombre: 'Inversiones Sumo, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Sushi/Oriental', score: 'B', prov: 'Fibex', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC23', nombre: 'Shawarma Corner', zona: 'FERIA DE COMIDA', cat: 'Rest. Árabe', score: 'B', prov: 'Otro', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC24', nombre: "L'Artigian, ca.", zona: 'FERIA DE COMIDA', cat: 'Rest. Italiano', score: 'B', prov: 'Sin servicio', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC25', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC26', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC27', nombre: 'Art Look MF CA', zona: 'FERIA DE COMIDA', cat: 'Postres & Helados', score: 'B', prov: 'Inter', pago: 55, plan: '200 Mbps PYME' },
  { id: 'FC28', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC29', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },
  { id: 'FC30', nombre: 'Inversiones 0220, c.a.', zona: 'FERIA DE COMIDA', cat: 'Local Feria', score: 'D' },

  // PLANTA ALTA (PA)
  { id: 'PA50', nombre: 'Casino Platinum, C.A', zona: 'PLANTA ALTA', cat: 'Entretenimiento VIP', score: 'A1', prov: 'Inter', pago: 210, plan: '600 Mbps Emp.' },
  { id: 'PAA', nombre: 'Inversiones Charbel 2020, C. A.', zona: 'PLANTA ALTA', cat: 'Comercial', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PAB', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PAC', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PAD', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PAE', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PAF', nombre: 'Rec Mundial, C.A', zona: 'PLANTA ALTA', cat: 'Comercio', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PAG', nombre: 'Solutec Gamer', zona: 'PLANTA ALTA', cat: 'Videojuegos & Tech', score: 'B', prov: '360NET', pago: 55 },
  { id: 'PAH', nombre: 'Youcandance Perez (Academia)', zona: 'PLANTA ALTA', cat: 'Academia Baile', score: 'A2', prov: 'Inter', pago: 85 },
  { id: 'PAI', nombre: 'Upalu, C. A.', zona: 'PLANTA ALTA', cat: 'Moda Infantil', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PAJ', nombre: 'Fantasy´ Pink, C. A.', zona: 'PLANTA ALTA', cat: 'Ropa & Accesorios', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PAK', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PAL', nombre: 'Inversiones 24666, C. A.', zona: 'PLANTA ALTA', cat: 'Comercial', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PAM', nombre: 'Inversiones 24666, C. A.', zona: 'PLANTA ALTA', cat: 'Comercial', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PAEK01', nombre: 'Kiosco Disponible PA1', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK02', nombre: 'Kiosco Disponible PA2', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK03', nombre: 'Kiosco Disponible PA3', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK04', nombre: 'Nova Electronic, C.A', zona: 'PLANTA ALTA', cat: 'Kiosco Electrónica', score: 'C', prov: 'Fibex', pago: 35 },
  { id: 'PAEK05', nombre: 'Kiosco Disponible PA5', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK05A', nombre: 'Kiosco Disponible PA5A', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK06', nombre: 'Kiosco Disponible PA6', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK07', nombre: 'Kiosco Disponible PA7', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK08', nombre: 'Kiosco Disponible PA8', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK09', nombre: 'Kiosco Disponible PA9', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK10', nombre: 'Kiosco Disponible PA10', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK11', nombre: 'Kiosco Disponible PA11', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK12', nombre: 'Kiosco Disponible PA12', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PAEK13', nombre: 'Kiosco Disponible PA13', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PANK01', nombre: 'Kiosco Norte PA', zona: 'PLANTA ALTA', cat: 'Kiosco Pa', score: 'E' },
  { id: 'PA01', nombre: 'SISPROT GLOBAL FIBER (SGF)', zona: 'PLANTA ALTA', cat: 'Oficina SGF', score: 'A1', prov: 'SGF Directo', pago: 0 },
  { id: 'PA02', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA03', nombre: 'KP Zona Digital', zona: 'PLANTA ALTA', cat: 'Electrónica', score: 'B', prov: '360NET', pago: 45 },
  { id: 'PA04', nombre: 'Hyper Mercado Admin', zona: 'PLANTA ALTA', cat: 'Oficinas', score: 'A1', prov: 'Inter', pago: 280 },
  { id: 'PA05', nombre: 'Woman Fit', zona: 'PLANTA ALTA', cat: 'Fitness/Ropa', score: 'D', prov: 'Sin servicio', pago: 0 },
  { id: 'PA06', nombre: 'Lotus Beauty Studio', zona: 'PLANTA ALTA', cat: 'Belleza/Spa', score: 'A2', prov: 'NetUno', pago: 38 },
  { id: 'PA07', nombre: 'TU PUNTO SHOP Electronic', zona: 'PLANTA ALTA', cat: 'Electrónica', score: 'A1', prov: 'Fibex', pago: 55 },
  { id: 'PA08', nombre: 'Venezia Joyas VIP', zona: 'PLANTA ALTA', cat: 'Joyería', score: 'C', prov: '360NET', pago: 28 },
  { id: 'PA09', nombre: 'Farmacia Malanga', zona: 'PLANTA ALTA', cat: 'Farmacia', score: 'A2', prov: 'Inter', pago: 48 },
  { id: 'PA10', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA11', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA12', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA13', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA14', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA15', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA16', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA17', nombre: 'The Cigar World, C. A.', zona: 'PLANTA ALTA', cat: 'Tabaquería VIP', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PA18', nombre: 'A & V SPA Y ESTUDIO, C.A.', zona: 'PLANTA ALTA', cat: 'Spa & Estética', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PA19', nombre: 'Inversiones Kasozz, C. A.', zona: 'PLANTA ALTA', cat: 'Comercio', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA20', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA21', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA22', nombre: 'ME AMO COMO SOY, C.A.', zona: 'PLANTA ALTA', cat: 'Boutique', score: 'B', prov: '360NET', pago: 55 },
  { id: 'PA23', nombre: 'LOTUS BEAUTY STUDIO, C.A.', zona: 'PLANTA ALTA', cat: 'Belleza', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PA24', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA25', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA26', nombre: 'WOMAN FIT', zona: 'PLANTA ALTA', cat: 'Fitness', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PA27', nombre: 'Platinum Empire, C. A.', zona: 'PLANTA ALTA', cat: 'Comercio', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PAN', nombre: 'Inversiones 24666, C. A.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PAÑ', nombre: 'Inversiones 24666, C. A.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PA30', nombre: 'Lokuras Fashion, C. A.', zona: 'PLANTA ALTA', cat: 'Ropa', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA31', nombre: 'Lokuras Fashion, C. A.', zona: 'PLANTA ALTA', cat: 'Ropa', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA32', nombre: 'Lokuras Fashion, C. A.', zona: 'PLANTA ALTA', cat: 'Ropa', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA33', nombre: 'Aston for Men, C. A.', zona: 'PLANTA ALTA', cat: 'Moda Caballeros', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PA34', nombre: 'Comercializadora Macoba 3000, C. A.', zona: 'PLANTA ALTA', cat: 'Comercial', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PA35', nombre: 'Representaciones S, A & M, C. A.', zona: 'PLANTA ALTA', cat: 'Comercial', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA36', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA37', nombre: 'Inversiones 0220, c.a.', zona: 'PLANTA ALTA', cat: 'Local Pa', score: 'D' },
  { id: 'PA38', nombre: 'C&C Import, C. A.', zona: 'PLANTA ALTA', cat: 'Importaciones', score: 'B', prov: '360NET', pago: 55 },
  { id: 'PA39', nombre: 'C&C Import, C. A.', zona: 'PLANTA ALTA', cat: 'Importaciones', score: 'B', prov: '360NET', pago: 55 },
  { id: 'PA40', nombre: 'Agente Autorizado Movilnet', zona: 'PLANTA ALTA', cat: 'Telecomunicaciones', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA41', nombre: 'Cinex Hiper Jumbo (Salas)', zona: 'PLANTA ALTA', cat: 'Cine / Ocio', score: 'A1', prov: 'Inter', pago: 260, plan: '600 Mbps Emp.' },
  { id: 'PA42', nombre: 'Cinex Administracion', zona: 'PLANTA ALTA', cat: 'Cine / Ocio', score: 'A1', prov: 'Inter', pago: 120 },

  // Generar locales faltantes de Planta Alta para llegar al total de 70
  ...Array.from({ length: 28 }, (_, i) => {
    const num = i + 43
    const id = `PA${num < 10 ? '0' + num : num}`
    return { id, nombre: `Local Comercial PA ${id}`, zona: 'PLANTA ALTA', cat: 'Local Pa', score: (i % 3 === 0 ? 'C' : 'E') as any }
  }),

  // PLANTA BAJA (PB)
  { id: 'PB01', nombre: 'Banco Provincial', zona: 'PLANTA BAJA', cat: 'Banca', score: 'A1', prov: 'NetUno', pago: 220, plan: '600 Mbps Emp.' },
  { id: 'PB02', nombre: 'Farmacia SAAS', zona: 'PLANTA BAJA', cat: 'Farmacia', score: 'A1', prov: 'Inter', pago: 160, plan: '300 Mbps PYME' },
  { id: 'PB03', nombre: 'Tiro D\'Eskina Cafe', zona: 'PLANTA BAJA', cat: 'Cafetería', score: 'B', prov: 'NetUno', pago: 50 },
  { id: 'PB04', nombre: 'Mobile Shop America', zona: 'PLANTA BAJA', cat: 'Telefonía', score: 'A2', prov: 'Datos Móviles', pago: 0 },
  { id: 'PB05', nombre: 'Lógica Digital CA', zona: 'PLANTA BAJA', cat: 'Tecnología', score: 'B', prov: '360NET', pago: 35 },
  { id: 'PB06', nombre: 'Dogs Market Mascotas', zona: 'PLANTA BAJA', cat: 'Mascotas', score: 'D', prov: 'Sin servicio', pago: 0 },
  { id: 'PB07', nombre: 'Creativy Space', zona: 'PLANTA BAJA', cat: 'Impresiones', score: 'B', prov: 'Fibex', pago: 42 },
  { id: 'PB08', nombre: 'SATRIM Kiosco', zona: 'PLANTA BAJA', cat: 'Trámites', score: 'C', prov: 'Inter', pago: 25 },
  { id: 'PB16', nombre: 'Zapatería Ferrara', zona: 'PLANTA BAJA', cat: 'Calzado', score: 'B', prov: 'NetUno', pago: 45 },
  { id: 'PB19', nombre: 'Boutique Paris', zona: 'PLANTA BAJA', cat: 'Moda', score: 'C', prov: 'Inter', pago: 30 },
  { id: 'PB20', nombre: 'Perfumería Glam', zona: 'PLANTA BAJA', cat: 'Cosméticos', score: 'B', prov: 'Fibex', pago: 40 },
  { id: 'PB21', nombre: 'Óptica Vision', zona: 'PLANTA BAJA', cat: 'Salud', score: 'A2', prov: '360NET', pago: 55 },
  { id: 'PB22', nombre: 'Joyas & Relojes', zona: 'PLANTA BAJA', cat: 'Joyería', score: 'B', prov: 'Inter', pago: 38 },
  { id: 'PB23', nombre: 'Electronix Tech', zona: 'PLANTA BAJA', cat: 'Tecnología', score: 'A1', prov: 'Inter', pago: 90 },
  { id: 'PB24', nombre: 'Celular Store', zona: 'PLANTA BAJA', cat: 'Telefonía', score: 'A2', prov: 'Datos Móviles', pago: 0 },
  { id: 'PB25', nombre: 'Local Disponible PB25', zona: 'PLANTA BAJA', cat: 'Disponible', score: 'E' },
  { id: 'PB26', nombre: 'Kiosco Dulces', zona: 'PLANTA BAJA', cat: 'Golosinas', score: 'C', prov: 'Otro', pago: 20 },
  { id: 'PB27', nombre: 'Cajeros Mercantil', zona: 'PLANTA BAJA', cat: 'Banca', score: 'A1', prov: 'Fibex', pago: 120 },
  { id: 'PB31', nombre: 'Banesco Banco', zona: 'PLANTA BAJA', cat: 'Banca', score: 'A1', prov: 'NetUno', pago: 210 },
  { id: 'PB32', nombre: 'Movistar Atención', zona: 'PLANTA BAJA', cat: 'Telecom', score: 'A1', prov: 'Fibex', pago: 180 },
  { id: 'PB33', nombre: 'Digitel Agente', zona: 'PLANTA BAJA', cat: 'Telecom', score: 'A2', prov: 'Inter', pago: 95 },
  { id: 'PB34', nombre: 'Heladería EFE', zona: 'PLANTA BAJA', cat: 'Postres', score: 'C', prov: 'Otro', pago: 25 },
  { id: 'PB44', nombre: 'Banco de Venezuela', zona: 'PLANTA BAJA', cat: 'Banca', score: 'A1', prov: 'Inter', pago: 0 },
  { id: 'PB57', nombre: 'Hyper Mercado Modelo (Ancla)', zona: 'PLANTA BAJA', cat: 'Supermercado', score: 'A1', prov: 'Inter', pago: 280, plan: '600 Mbps Emp.' },
  { id: 'PB_SERV', nombre: 'Área de Carga & Servicios', zona: 'PLANTA BAJA', cat: 'Servicios Téc.', score: 'E' },

  // Generar locales faltantes de Planta Baja para llegar a 75 locales
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 9
    if ([16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33, 34, 44, 57].includes(num)) return null
    const id = `PB${num < 10 ? '0' + num : num}`
    return { id, nombre: `Local Comercial PB ${id}`, zona: 'PLANTA BAJA', cat: 'Comercio PB', score: (i % 4 === 0 ? 'B' : i % 2 === 0 ? 'C' : 'E') as any }
  }).filter(Boolean) as any[],

  // SÓTANO (SOT)
  { id: 'SOT36', nombre: 'Hyper Gym Fitness Center (Depósito/Gym)', zona: 'SOTANO', cat: 'Gimnasio', score: 'A1', prov: 'NetUno', pago: 145, plan: '600 Mbps Emp.' },
  { id: 'SOT14', nombre: 'Depósito Central Logística', zona: 'SOTANO', cat: 'Almacén', score: 'C', prov: 'NetUno', pago: 40 },
  { id: 'SOT15', nombre: 'Servicios y Mantenimiento CC', zona: 'SOTANO', cat: 'Servicios', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'SOT22', nombre: 'Oficinas Administrativas CC', zona: 'SOTANO', cat: 'Administración', score: 'A2', prov: 'Fibex', pago: 85 },
  { id: 'SOT30', nombre: 'Taller Eléctrico & Subestación', zona: 'SOTANO', cat: 'Técnico', score: 'B', prov: 'Inter', pago: 60 },
  { id: 'SOT_PARK', nombre: 'Estacionamiento Semisótano (275 Puestos)', zona: 'SOTANO', cat: 'Parking', score: 'E' },

  // Depósitos e Inversiones Sótano (SOT01 a SOT69)
  ...Array.from({ length: 65 }, (_, i) => {
    const num = i + 1
    if ([14, 15, 22, 30, 36].includes(num)) return null
    const id = `SOT${num < 10 ? '0' + num : num}`
    return { id, nombre: `Depósito / Local Sótano ${id}`, zona: 'SOTANO', cat: 'Almacén / Depósito', score: (i % 5 === 0 ? 'C' : 'E') as any }
  }).filter(Boolean) as any[],

  // EXTERIORES & LUNA PARK (EXT)
  { id: 'EXT_LUNA', nombre: 'Área Total Para Luna Park (8,452.75 m²)', zona: 'EXTERIOR', cat: 'Eventos/Recreación', score: 'A1', prov: 'Inter', pago: 350 },
  { id: 'EXT_PARK', nombre: 'Estacionamiento General & Acometidas SGF', zona: 'EXTERIOR', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 0 },
  { id: 'EXT_PATIO', nombre: 'Patio de Servicio & Carga Pesada', zona: 'EXTERIOR', cat: 'Logística', score: 'E' },
  { id: 'TR01', nombre: 'Casino Platinum Terraza', zona: 'EXTERIOR', cat: 'Terraza VIP', score: 'A1', prov: 'Inter', pago: 210 },
  { id: 'TR02', nombre: 'Terraza Abierta Hiper Jumbo', zona: 'EXTERIOR', cat: 'Terraza', score: 'A2', prov: 'Inter', pago: 85 },
]

// Función inteligente que posiciona cada local en una cuadrícula arquitectónica estilizada de SVG (520x480)
export function generateAllMallUnits(): MallUnit[] {
  // Contadores por piso para posicionar en grilla
  const floorCounts: Record<string, number> = { PB: 0, PA: 0, SOT: 0, EXT: 0 }

  return rawLocalsList.map((item) => {
    let floor: 'PB' | 'PA' | 'SOT' | 'EXT' = 'PB'
    if (item.zona.includes('ALTA') || item.zona.includes('FERIA')) floor = 'PA'
    else if (item.zona.includes('SOTANO')) floor = 'SOT'
    else if (item.zona.includes('EXTERIOR')) floor = 'EXT'
    else floor = 'PB'

    const idx = floorCounts[floor]++

    // Posicionamiento dinámico en plano SVG de 520 x 480 con márgenes y pasillos
    let x = 0, y = 0, w = 36, h = 32

    if (floor === 'PB') {
      // PB layout: Ancla central grande (PB57) + pasillos periféricos
      if (item.id === 'PB57') {
        x = 140; y = 110; w = 240; h = 220
      } else if (item.id === 'PB_SERV') {
        x = 140; y = 340; w = 240; h = 80
      } else {
        // Distribuir en cuadrícula perimetral de 7 columnas
        const col = idx % 9
        const row = Math.floor(idx / 9)
        w = 46; h = 36
        x = 30 + col * 52
        y = 30 + row * 44
        // Saltear el centro para simular el ancla
        if (x >= 120 && x <= 360 && y >= 90 && y <= 350) {
          x += (x < 240 ? -70 : 80)
        }
      }
    } else if (floor === 'PA') {
      // PA layout: Casino + Cinex + Feria de Comida + Pasillos
      if (item.id === 'PA50') {
        x = 180; y = 90; w = 160; h = 100 // Casino Platinum
      } else if (item.id === 'PA41') {
        x = 180; y = 200; w = 160; h = 100 // Cinex
      } else if (item.id.startsWith('FC')) {
        // Feria de comida en bloque izquierdo
        const fcIdx = idx % 20
        const col = fcIdx % 3
        const row = Math.floor(fcIdx / 3)
        w = 42; h = 34
        x = 30 + col * 46
        y = 40 + row * 38
      } else {
        // Locales PA en grilla organizada
        const paIdx = idx % 45
        const col = paIdx % 8
        const row = Math.floor(paIdx / 8)
        w = 46; h = 36
        x = 30 + col * 58
        y = 40 + row * 42
        if (x >= 160 && x <= 330 && y >= 80 && y <= 290) {
          y += 180
        }
      }
    } else if (floor === 'SOT') {
      // SÓTANO layout: Gym + Estacionamiento + Depósitos en grilla
      if (item.id === 'SOT_PARK') {
        x = 140; y = 50; w = 240; h = 280
      } else {
        const col = idx % 9
        const row = Math.floor(idx / 9)
        w = 46; h = 36
        x = 30 + col * 52
        y = 40 + row * 42
        if (x >= 130 && x <= 360 && y >= 40 && y <= 320) {
          x += (x < 240 ? -60 : 70)
        }
      }
    } else {
      // EXTERIORES layout
      if (item.id === 'EXT_LUNA') {
        x = 260; y = 50; w = 210; h = 220
      } else if (item.id === 'EXT_PARK') {
        x = 40; y = 50; w = 200; h = 380
      } else {
        const col = idx % 4
        const row = Math.floor(idx / 4)
        w = 90; h = 50
        x = 260 + col * 95
        y = 280 + row * 55
      }
    }

    // Asegurar límites del SVG viewBox 520x480
    x = Math.max(25, Math.min(x, 465))
    y = Math.max(25, Math.min(y, 420))

    const score = item.score || 'C'
    const estado = item.prov && item.prov !== 'Sin servicio' && item.prov !== 'Por Encuestar' ? 'alquilado' : score === 'E' ? 'disponible' : 'alquilado'

    return {
      id: item.id,
      nombre: item.nombre,
      floor,
      x,
      y,
      w,
      h,
      score,
      cat: item.cat || 'Comercial',
      prov: item.prov || 'Por Encuestar',
      estado: estado as any,
      pago: item.pago || (score === 'A1' ? 180 : score === 'A2' ? 90 : score === 'B' ? 55 : 0),
      plan: item.plan
    }
  })
}
