-- =============================================================================
-- ESQUEMA Y DATA SEMILLA PARA SUPABASE - HYPER ENCUESTAS / SGF C.C. HIPER JUMBO
-- =============================================================================

-- 1. TABLA: leads (Prospectos comerciales C.C. Hiper Jumbo)
CREATE TABLE IF NOT EXISTS public.leads (
    id VARCHAR(50) PRIMARY KEY,
    nombre TEXT NOT NULL,
    zona TEXT NOT NULL,
    cat TEXT NOT NULL,
    prov TEXT NOT NULL,
    pago NUMERIC DEFAULT 0,
    pts INT DEFAULT 0,
    score VARCHAR(10) NOT NULL,
    plan TEXT NOT NULL,
    feas TEXT NOT NULL,
    accion TEXT NOT NULL,
    avatar VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: map_locals (Geometría del plano interactivo y asignación de vendedores)
CREATE TABLE IF NOT EXISTS public.map_locals (
    id VARCHAR(50) PRIMARY KEY,
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    w NUMERIC NOT NULL,
    h NUMERIC NOT NULL,
    nombre TEXT NOT NULL,
    score VARCHAR(10) NOT NULL,
    vendedor TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: survey_responses (Registro de Encuestas y Visitas Comerciales de Campo)
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    local_id VARCHAR(50) NOT NULL,
    nombre_local TEXT,
    zona TEXT,
    vendedor TEXT,
    visit_result TEXT NOT NULL,
    motivo_no_realizada TEXT,
    observaciones_visita TEXT,
    prov_actual TEXT,
    velocidad TEXT,
    pago_mensual TEXT,
    verificado_factura BOOLEAN DEFAULT FALSE,
    satisfaccion INT,
    fallas TEXT[],
    impacto TEXT,
    plan_sgf TEXT,
    contacto_nombre TEXT,
    contacto_tel TEXT,
    contacto_email TEXT,
    rol_decision TEXT,
    canal TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_locals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS: Lectura y escritura pública (Anon Key) + Gestión Admin
DROP POLICY IF EXISTS "Permitir lectura publica de leads" ON public.leads;
CREATE POLICY "Permitir lectura publica de leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir edicion publica de leads" ON public.leads;
CREATE POLICY "Permitir edicion publica de leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura publica de mapa" ON public.map_locals;
CREATE POLICY "Permitir lectura publica de mapa" ON public.map_locals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura y creacion publica de encuestas" ON public.survey_responses;
CREATE POLICY "Permitir lectura y creacion publica de encuestas" ON public.survey_responses FOR ALL USING (true) WITH CHECK (true);


-- =============================================================================
-- DATA SEMILLA REAL C.C. HIPER JUMBO (INSERTS ESTÁTICOS)
-- =============================================================================

-- Inserción de Prospectos (Leads)
INSERT INTO public.leads (id, nombre, zona, cat, prov, pago, pts, score, plan, feas, accion, avatar) VALUES
('PA50', 'Casino Platinum, C.A.', 'Planta Alta', 'Entretenimiento', 'Inter', 210, 96, 'A1', '600 Mbps Emp.', 'Factible', 'Negociando contrato', 'CP'),
('SOT',  'Hyper Gym, C.A.', 'Sótano', 'Fitness', 'NetUno', 145, 94, 'A1', '600 Mbps Emp.', 'Factible', 'Propuesta enviada', 'HG'),
('PA04', 'Hyper Mercado Modelo, C.A.', 'Planta Alta', 'Supermercado', 'Inter', 280, 92, 'A1', '600 Mbps Emp.', 'Factible', 'Reunión agendada', 'HM'),
('PA01', 'SISPROT GLOBAL FIBER (SGF)', 'Planta Alta', 'Oficina SGF', '—', 0, 100, 'A1', 'Punto de venta', 'Factible', '✅ Nuestra oficina en CC', 'SG'),
('PA07', 'TU PUNTO SHOP ELECTRONIC', 'Planta Alta', 'Electrónica', 'Fibex', 55, 88, 'A1', '300 Mbps PYME', 'Factible', 'Propuesta enviada', 'TP'),
('PB04', 'Mobile Shop Las Americas', 'Planta Baja', 'Telefonía', 'Datos Móviles', 0, 82, 'A2', '200 Mbps PYME', 'Factible', 'Cita agendada', 'MS'),
('PA09', 'Farmacia Malanga, C.A.', 'Planta Alta', 'Farmacia', 'Inter', 48, 80, 'A2', '200 Mbps PYME', 'Factible', 'Propuesta enviada', 'FM'),
('PA06', 'Lotus Beauty Studio, C.A.', 'Planta Alta', 'Belleza/Spa', 'NetUno', 38, 76, 'A2', '200 Mbps PYME', 'Factible', 'Cita agendada', 'LB'),
('PA03', 'KP Zona Digital, C.A.', 'Planta Alta', 'Tecnología', 'Fibex', 42, 74, 'B', '100 Mbps PYME', 'Factible', 'Seguimiento activo', 'KP'),
('PB05', 'Corporac. Logica Digital CA', 'Planta Baja', 'Tecnología', '360NET', 35, 71, 'B', '100 Mbps PYME', 'Factible', 'Primer contacto', 'CL'),
('FC01', 'Joanes Lunch, C.A.', 'Feria de Comida', 'Restaurante', 'Datos Móviles', 0, 68, 'B', '100 Mbps PYME', 'Con Obra', 'Visita técnica pend.', 'JL'),
('FC02', 'Express Hong Kong, C.A.', 'Feria de Comida', 'Rest. Asiática', 'Otro', 22, 65, 'B', '100 Mbps PYME', 'Con Obra', 'Seguimiento', 'EH'),
('FC04', 'Pizza Mia, C.A.', 'Feria de Comida', 'Pizzería', 'Inter', 30, 62, 'B', '100 Mbps PYME', 'Factible', 'Seguimiento', 'PM'),
('PA02', 'Lokuras Fashion, C.A.', 'Planta Alta', 'Moda', 'NetUno', 31, 58, 'C', '50 Mbps Hogar', 'Pendiente', 'Sin contacto aún', 'LF'),
('PA08', 'Venezia Joyas VIP, C.A.', 'Planta Alta', 'Joyería', '360NET', 28, 55, 'C', '50 Mbps Hogar', 'Pendiente', 'Revisión técnica', 'VJ'),
('PB01', 'Hyper Joyas, C.A.', 'Planta Baja', 'Joyería', 'Fibex', 25, 52, 'C', '50 Mbps Hogar', 'Pendiente', 'Sin contacto aún', 'HJ'),
('FC07', 'Shawarma Corner', 'Feria de Comida', 'Rest. Árabe', 'Otro', 18, 44, 'C', '50 Mbps Hogar', 'Pendiente', 'Sin contacto aún', 'SC'),
('PA05', 'Woman Fit', 'Planta Alta', 'Fitness/Moda', 'Sin servicio', 0, 38, 'D', 'N/A', 'Pendiente', 'Evaluar', 'WF'),
('FC09', 'LArtigian, ca.', 'Feria de Comida', 'Rest. Italiana', 'Sin servicio', 0, 32, 'D', 'N/A', 'No Factible', 'Descartado', 'LA'),
('PB06', 'Comercializadora Dogs M.', 'Planta Baja', 'Mascotas', 'Sin servicio', 0, 28, 'D', 'N/A', 'No Factible', 'Descartado', 'DM')
ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    zona = EXCLUDED.zona,
    cat = EXCLUDED.cat,
    prov = EXCLUDED.prov,
    pago = EXCLUDED.pago,
    pts = EXCLUDED.pts,
    score = EXCLUDED.score,
    plan = EXCLUDED.plan,
    feas = EXCLUDED.feas,
    accion = EXCLUDED.accion,
    avatar = EXCLUDED.avatar;


-- Inserción de Plano/Mapa de Locales
INSERT INTO public.map_locals (id, x, y, w, h, nombre, score, vendedor) VALUES
('PB04', 38,  72,  78, 48, 'Mobile Shop',      'A2', 'Carlos R.'),
('PB05', 124, 72,  78, 48, 'Logica Digital',   'B',  'Carlos R.'),
('PB01', 210, 72,  78, 48, 'Hyper Joyas',      'C',  'María L.'),
('PB06', 296, 72,  78, 48, 'Dogs Market',      'D',  'María L.'),
('PB02', 38,  130, 78, 48, 'Macoba Cafe',      'B',  'Carlos R.'),
('PB03', 124, 130, 78, 48, 'Tiro DEskina',     'C',  'Pedro M.'),
('PB07', 210, 130, 78, 48, 'Creativy Space',   'B',  'Pedro M.'),
('PB08', 296, 130, 78, 48, 'SATRIM Kiosco',    'C',  'Ana G.'),
('PA50', 38,  248, 100,54, 'Casino Platinum',  'A1', 'Carlos R.'),
('PA04', 148, 248, 100,54, 'Hyper Mercado',    'A1', 'Carlos R.'),
('PA07', 258, 248, 78, 54, 'Tu Punto Shop',    'A1', 'María L.'),
('PA01', 344, 248, 78, 54, 'SGF Oficina',      'A1', 'Nuestra oficina'),
('PA06', 38,  312, 78, 48, 'Lotus Beauty',     'A2', 'Pedro M.'),
('PA09', 124, 312, 78, 48, 'Farmacia Malanga', 'A2', 'María L.'),
('PA03', 210, 312, 78, 48, 'KP Zona Digital',  'B',  'Ana G.'),
('PA02', 296, 312, 78, 48, 'Lokuras Fashion',  'C',  'Ana G.'),
('FC01', 38,  432, 68, 44, 'Joanes Lunch',     'B',  'Pedro M.'),
('FC02', 114, 432, 68, 44, 'Express HK',       'B',  'Pedro M.'),
('FC04', 190, 432, 68, 44, 'Pizza Mia',        'B',  'Ana G.'),
('FC07', 266, 432, 68, 44, 'Shawarma Corner',  'C',  'Ana G.'),
('FC09', 342, 432, 68, 44, 'LArtigian',        'D',  '—'),
('FC05', 418, 432, 68, 44, 'Sazón Express',    'B',  'Carlos R.')
ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    score = EXCLUDED.score,
    vendedor = EXCLUDED.vendedor;

-- Registro de Encuesta Ejemplo Inicial
INSERT INTO public.survey_responses (
    local_id, nombre_local, zona, vendedor, visit_result, prov_actual, velocidad, pago_mensual,
    verificado_factura, satisfaccion, fallas, impacto, plan_sgf, contacto_nombre, contacto_tel,
    contacto_email, rol_decision, canal
) VALUES (
    'PB04', 'Mobile Shop Las Americas', 'Planta Baja', 'Carlos Ramírez', 'Completada', 'Inter', '50', '45',
    true, 2, ARRAY['Cortes frecuentes', 'Lentitud en hora pico'], 'Alto', 'PYME 300 Mbps ($44.83/mes)',
    'Ana Martínez', '+58 412-555-0198', 'ana@mobileshop.ve', 'Decisor Directo', 'WhatsApp'
);
