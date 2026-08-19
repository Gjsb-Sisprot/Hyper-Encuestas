// Generador con dimensiones extendidas de mapa arquitectónico (1100x850px) para navegación panorámica fluida (Pan & Zoom)

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

export const rawLocalsList: Array<{ id: string; nombre: string; zona: string; cat: string; score?: string; prov?: string; pago?: number; plan?: string }> = [
  // ESTACIONAMIENTO & ZONAS ESPECIALES
  { id: 'ED01', nombre: 'ESTACIONAMIENTO GENERAL', zona: 'PLANTA BAJA', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 210 },
  { id: 'ESOT01', nombre: 'ESTACIONAMIENTO SÓTANO', zona: 'SOTANO', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 210 },

  // PLANTA BAJA (PB) - Locales Reales
  { id: 'PB57', nombre: 'Hyper Mercado Modelo (Ancla)', zona: 'PLANTA BAJA', cat: 'Supermercado', score: 'A1', prov: 'Inter', pago: 280, plan: '600 Mbps Emp.' },
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
  { id: 'PB_SERV', nombre: 'Área de Carga & Servicios', zona: 'PLANTA BAJA', cat: 'Servicios Téc.', score: 'E' },

  // Restante PB
  ...Array.from({ length: 50 }, (_, i) => {
    const num = i + 9
    if ([16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 31, 32, 33, 34, 44, 57].includes(num)) return null
    const id = `PB${num < 10 ? '0' + num : num}`
    return { id, nombre: `Local Comercial PB ${id}`, zona: 'PLANTA BAJA', cat: 'Comercio PB', score: (i % 4 === 0 ? 'B' : i % 2 === 0 ? 'C' : 'E') as any, prov: i % 3 === 0 ? 'Inter' : i % 2 === 0 ? 'NetUno' : 'Sin servicio' }
  }).filter(Boolean) as any[],

  // PLANTA ALTA (PA) - Anclas & Locales
  { id: 'PA50', nombre: 'Casino Platinum, C.A', zona: 'PLANTA ALTA', cat: 'Entretenimiento VIP', score: 'A1', prov: 'Inter', pago: 210, plan: '600 Mbps Emp.' },
  { id: 'PA41', nombre: 'Cinex Hiper Jumbo (Salas)', zona: 'PLANTA ALTA', cat: 'Cine / Ocio', score: 'A1', prov: 'Inter', pago: 260, plan: '600 Mbps Emp.' },
  { id: 'PA01', nombre: 'SISPROT GLOBAL FIBER (SGF)', zona: 'PLANTA ALTA', cat: 'Oficina SGF', score: 'A1', prov: 'SGF Directo', pago: 0 },
  { id: 'PA03', nombre: 'KP Zona Digital', zona: 'PLANTA ALTA', cat: 'Electrónica', score: 'B', prov: '360NET', pago: 45 },
  { id: 'PA04', nombre: 'Hyper Mercado Admin', zona: 'PLANTA ALTA', cat: 'Oficinas', score: 'A1', prov: 'Inter', pago: 280 },
  { id: 'PA05', nombre: 'Woman Fit', zona: 'PLANTA ALTA', cat: 'Fitness/Ropa', score: 'D', prov: 'Sin servicio', pago: 0 },
  { id: 'PA06', nombre: 'Lotus Beauty Studio', zona: 'PLANTA ALTA', cat: 'Belleza/Spa', score: 'A2', prov: 'NetUno', pago: 38 },
  { id: 'PA07', nombre: 'TU PUNTO SHOP Electronic', zona: 'PLANTA ALTA', cat: 'Electrónica', score: 'A1', prov: 'Fibex', pago: 55 },
  { id: 'PA08', nombre: 'Venezia Joyas VIP', zona: 'PLANTA ALTA', cat: 'Joyería', score: 'C', prov: '360NET', pago: 28 },
  { id: 'PA09', nombre: 'Farmacia Malanga', zona: 'PLANTA ALTA', cat: 'Farmacia', score: 'A2', prov: 'Inter', pago: 48 },
  { id: 'PA17', nombre: 'The Cigar World, C. A.', zona: 'PLANTA ALTA', cat: 'Tabaquería VIP', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'PA18', nombre: 'A & V SPA Y ESTUDIO, C.A.', zona: 'PLANTA ALTA', cat: 'Spa & Estética', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PA22', nombre: 'ME AMO COMO SOY, C.A.', zona: 'PLANTA ALTA', cat: 'Boutique', score: 'B', prov: '360NET', pago: 55 },
  { id: 'PA30', nombre: 'Lokuras Fashion, C. A.', zona: 'PLANTA ALTA', cat: 'Ropa', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'PA33', nombre: 'Aston for Men, C. A.', zona: 'PLANTA ALTA', cat: 'Moda Caballeros', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'PAH', nombre: 'Youcandance Perez (Academia)', zona: 'PLANTA ALTA', cat: 'Academia Baile', score: 'A2', prov: 'Inter', pago: 85 },

  // FERIA DE COMIDA (FC)
  { id: 'FC03A', nombre: 'Joanes Lunch, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Comida Rápida', score: 'B', prov: 'Datos Móviles', pago: 55 },
  { id: 'FC04A', nombre: 'Express Hong Kong', zona: 'FERIA DE COMIDA', cat: 'Rest. Asiático', score: 'B', prov: 'Otro', pago: 55 },
  { id: 'FC04B', nombre: 'Grill Mania, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Parrilla', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'FC06', nombre: 'PIZZA MIA, C.A', zona: 'FERIA DE COMIDA', cat: 'Rest. Pizzería', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'FC07', nombre: 'Inversiones Jumbo Foods', zona: 'FERIA DE COMIDA', cat: 'Rest. Comida Rápida', score: 'B', prov: 'Fibex', pago: 55 },
  { id: 'FC08', nombre: 'Sazón Express, C. A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Criollo', score: 'B', prov: 'NetUno', pago: 55 },
  { id: 'FC09', nombre: 'QUIMI 2511, C.A.', zona: 'FERIA DE COMIDA', cat: 'Rest. Smoothies', score: 'B', prov: 'Sin servicio', pago: 55 },
  { id: 'FC13', nombre: 'MELENDEZ RUIZ INVERSIONES', zona: 'FERIA DE COMIDA', cat: 'Rest. Café/Postres', score: 'B', prov: '360NET', pago: 55 },

  ...Array.from({ length: 18 }, (_, i) => {
    const num = i + 1
    const id = `FC${num < 10 ? '0' + num : num}`
    if (['FC06','FC07','FC08','FC09','FC13'].includes(id)) return null
    return { id, nombre: `Local Feria ${id}`, zona: 'FERIA DE COMIDA', cat: 'Feria de Comida', score: 'D', prov: 'Sin servicio' }
  }).filter(Boolean) as any[],

  ...Array.from({ length: 35 }, (_, i) => {
    const num = i + 10
    const id = `PA${num < 10 ? '0' + num : num}`
    if (['PA17','PA18','PA22','PA30','PA33','PA41','PA50'].includes(id)) return null
    return { id, nombre: `Local PA ${id}`, zona: 'PLANTA ALTA', cat: 'Comercio PA', score: (i % 3 === 0 ? 'C' : 'E') as any, prov: i % 2 === 0 ? 'Fibex' : 'Sin servicio' }
  }).filter(Boolean) as any[],

  // SÓTANO (SOT)
  { id: 'SOT36', nombre: 'Hyper Gym Fitness Center', zona: 'SOTANO', cat: 'Gimnasio', score: 'A1', prov: 'NetUno', pago: 145, plan: '600 Mbps Emp.' },
  { id: 'SOT14', nombre: 'Depósito Central Logística', zona: 'SOTANO', cat: 'Almacén', score: 'C', prov: 'NetUno', pago: 40 },
  { id: 'SOT15', nombre: 'Servicios y Mantenimiento CC', zona: 'SOTANO', cat: 'Servicios', score: 'B', prov: 'Inter', pago: 55 },
  { id: 'SOT22', nombre: 'Oficinas Administrativas CC', zona: 'SOTANO', cat: 'Administración', score: 'A2', prov: 'Fibex', pago: 85 },
  { id: 'SOT30', nombre: 'Taller Eléctrico & Subestación', zona: 'SOTANO', cat: 'Técnico', score: 'B', prov: 'Inter', pago: 60 },
  { id: 'SOT_PARK', nombre: 'Estacionamiento Semisótano', zona: 'SOTANO', cat: 'Parking', score: 'E' },

  ...Array.from({ length: 55 }, (_, i) => {
    const num = i + 1
    if ([14, 15, 22, 30, 36].includes(num)) return null
    const id = `SOT${num < 10 ? '0' + num : num}`
    return { id, nombre: `Depósito Sótano ${id}`, zona: 'SOTANO', cat: 'Almacén / Depósito', score: (i % 5 === 0 ? 'C' : 'E') as any, prov: 'Sin servicio' }
  }).filter(Boolean) as any[],

  // EXTERIORES (EXT)
  { id: 'EXT_LUNA', nombre: 'Luna Park (8,452 m²)', zona: 'EXTERIOR', cat: 'Eventos/Recreación', score: 'A1', prov: 'Inter', pago: 350 },
  { id: 'EXT_PARK', nombre: 'Estacionamiento General SGF', zona: 'EXTERIOR', cat: 'Estacionamiento', score: 'A1', prov: 'SGF Fibra', pago: 0 },
  { id: 'EXT_PATIO', nombre: 'Patio de Carga Pesada', zona: 'EXTERIOR', cat: 'Logística', score: 'E' },
  { id: 'TR01', nombre: 'Casino Platinum Terraza', zona: 'EXTERIOR', cat: 'Terraza VIP', score: 'A1', prov: 'Inter', pago: 210 },
  { id: 'TR02', nombre: 'Terraza Abierta Hiper Jumbo', zona: 'EXTERIOR', cat: 'Terraza', score: 'A2', prov: 'Inter', pago: 85 },
]

export function generateAllMallUnits(): MallUnit[] {
  // Dimensiones holgadas para vista panorámica (1100 x 850px)
  const floorCounts: Record<string, number> = { PB: 0, PA: 0, SOT: 0, EXT: 0 }

  return rawLocalsList.map((item) => {
    let floor: 'PB' | 'PA' | 'SOT' | 'EXT' = 'PB'
    if (item.zona.includes('ALTA') || item.zona.includes('FERIA')) floor = 'PA'
    else if (item.zona.includes('SOTANO')) floor = 'SOT'
    else if (item.zona.includes('EXTERIOR')) floor = 'EXT'
    else floor = 'PB'

    if (floor === 'PB') {
      if (item.id === 'PB57') {
        return { id: item.id, nombre: item.nombre, floor, x: 380, y: 180, w: 340, h: 360, score: item.score || 'A1', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: item.pago || 280, plan: item.plan }
      }
      if (item.id === 'PB_SERV') {
        return { id: item.id, nombre: item.nombre, floor, x: 380, y: 560, w: 340, h: 90, score: 'E', cat: item.cat, prov: '—', estado: 'legal', pago: 0 }
      }

      const idx = floorCounts.PB++
      
      if (idx < 12) {
        // Pasillo Norte PB
        return { id: item.id, nombre: item.nombre, floor, x: 50 + idx * 82, y: 60, w: 76, h: 68, score: item.score || 'B', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: item.pago || 45 }
      } else if (idx < 26) {
        // Pasillo Oeste PB (Izquierda)
        const sideIdx = idx - 12
        const col = sideIdx % 3
        const row = Math.floor(sideIdx / 3)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 94, y: 160 + row * 76, w: 86, h: 68, score: item.score || 'C', cat: item.cat, prov: item.prov || 'NetUno', estado: 'alquilado', pago: item.pago || 35 }
      } else if (idx < 40) {
        // Pasillo Este PB (Derecha)
        const sideIdx = idx - 26
        const col = sideIdx % 3
        const row = Math.floor(sideIdx / 3)
        return { id: item.id, nombre: item.nombre, floor, x: 760 + col * 94, y: 160 + row * 76, w: 86, h: 68, score: item.score || 'B', cat: item.cat, prov: item.prov || 'Fibex', estado: 'alquilado', pago: item.pago || 55 }
      } else {
        // Pasillo Sur PB (Abajo)
        const botIdx = idx - 40
        const col = botIdx % 12
        const row = Math.floor(botIdx / 12)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 82, y: 670 + row * 76, w: 76, h: 68, score: item.score || 'E', cat: item.cat, prov: item.prov || 'Sin servicio', estado: 'disponible', pago: item.pago || 0 }
      }
    } else if (floor === 'PA') {
      if (item.id === 'PA50') {
        return { id: item.id, nombre: item.nombre, floor, x: 400, y: 60, w: 300, h: 180, score: 'A1', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: 210, plan: item.plan }
      }
      if (item.id === 'PA41') {
        return { id: item.id, nombre: item.nombre, floor, x: 400, y: 260, w: 300, h: 180, score: 'A1', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: 260, plan: item.plan }
      }

      const idx = floorCounts.PA++

      if (item.id.startsWith('FC') || idx < 20) {
        // ZONA FERIA DE COMIDA (Bloque Izquierda)
        const col = idx % 4
        const row = Math.floor(idx / 4)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 80, y: 60 + row * 74, w: 74, h: 66, score: item.score || 'B', cat: item.cat, prov: item.prov || 'Datos Móviles', estado: 'alquilado', pago: item.pago || 55 }
      } else if (idx < 35) {
        // ZONA DERECHA PA
        const rightIdx = idx - 20
        const col = rightIdx % 4
        const row = Math.floor(rightIdx / 4)
        return { id: item.id, nombre: item.nombre, floor, x: 730 + col * 82, y: 60 + row * 74, w: 76, h: 66, score: item.score || 'C', cat: item.cat, prov: item.prov || '360NET', estado: 'alquilado', pago: item.pago || 40 }
      } else {
        // ZONA SUR PA
        const botIdx = idx - 35
        const col = botIdx % 12
        const row = Math.floor(botIdx / 12)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 82, y: 470 + row * 76, w: 76, h: 68, score: item.score || 'E', cat: item.cat, prov: item.prov || 'Sin servicio', estado: 'disponible', pago: item.pago || 0 }
      }
    } else if (floor === 'SOT') {
      if (item.id === 'SOT_PARK') {
        return { id: item.id, nombre: item.nombre, floor, x: 320, y: 60, w: 460, h: 420, score: 'E', cat: item.cat, prov: '—', estado: 'alquilado', pago: 0 }
      }

      const idx = floorCounts.SOT++

      if (idx < 18) {
        const col = idx % 3
        const row = Math.floor(idx / 3)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 82, y: 60 + row * 74, w: 76, h: 66, score: item.score || 'C', cat: item.cat, prov: item.prov || 'NetUno', estado: 'alquilado', pago: item.pago || 40 }
      } else if (idx < 36) {
        const eastIdx = idx - 18
        const col = eastIdx % 3
        const row = Math.floor(eastIdx / 3)
        return { id: item.id, nombre: item.nombre, floor, x: 800 + col * 82, y: 60 + row * 74, w: 76, h: 66, score: item.score || 'B', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: item.pago || 50 }
      } else {
        const botIdx = idx - 36
        const col = botIdx % 12
        const row = Math.floor(botIdx / 12)
        return { id: item.id, nombre: item.nombre, floor, x: 50 + col * 82, y: 510 + row * 76, w: 76, h: 68, score: item.score || 'E', cat: item.cat, prov: item.prov || 'Sin servicio', estado: 'disponible', pago: item.pago || 0 }
      }
    } else {
      // EXTERIORES
      if (item.id === 'EXT_LUNA') {
        return { id: item.id, nombre: item.nombre, floor, x: 540, y: 60, w: 480, h: 360, score: 'A1', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: 350 }
      }
      if (item.id === 'EXT_PARK') {
        return { id: item.id, nombre: item.nombre, floor, x: 50, y: 60, w: 440, h: 650, score: 'A1', cat: item.cat, prov: 'SGF Fibra', estado: 'alquilado', pago: 0 }
      }

      const idx = floorCounts.EXT++
      const col = idx % 4
      const row = Math.floor(idx / 4)
      return { id: item.id, nombre: item.nombre, floor, x: 540 + col * 120, y: 440 + row * 90, w: 110, h: 80, score: item.score || 'A2', cat: item.cat, prov: item.prov || 'Inter', estado: 'alquilado', pago: item.pago || 100 }
    }
  })
}
