import { useState, useRef, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  fetchLeadsFromSupabase,
  fetchMapLocalsFromSupabase,
  fetchSurveysFromSupabase,
  Lead,
  SurveyResponse,
} from "./lib/supabase"
import { generateAllMallUnits, MallUnit } from "./lib/mapData"
import SurveyForm from "./SurveyForm"

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const brand = "#0052FF"
const cyber = "#00A3FF"
const ink = "#0F172A"
const slate = "#334155"
const muted = "#94A3B8"
const light = "#F8FAFC"
const snow = "#FFFFFF"
const border = "#E2E8F0"
const green = "#10B981"
const amber = "#F59E0B"
const red = "#EF4444"
const blue = "#3B82F6"

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const badge = (score: string) => {
  const m: Record<string, [string, string, string]> = {
    A1: ["#ECFDF5", "#065F46", "#10B981"],
    A2: ["#ECFDF5", "#065F46", "#34D399"],
    B: ["#EFF6FF", "#1D4ED8", "#3B82F6"],
    C: ["#FFFBEB", "#92400E", "#F59E0B"],
    D: ["#FEF2F2", "#991B1B", "#EF4444"],
    E: ["#F9FAFB", "#374151", "#9CA3AF"],
  }
  const [bg, fg, border] = m[score] ?? m["E"]
  return (
    <span
      style={{
        background: bg,
        color: fg,
        border: `1.5px solid ${border}40`,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".03em",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {score}
    </span>
  )
}

const feasTag = (status: string) => {
  const m: Record<string, [string, string]> = {
    Factible: ["#ECFDF5", "#065F46"],
    "Con Obra": ["#FFFBEB", "#92400E"],
    "No Factible": ["#FEF2F2", "#991B1B"],
    Pendiente: ["#FFF7ED", "#9A3412"],
  }
  const [bg, fg] = m[status] ?? ["#F9FAFB", "#374151"]
  return (
    <span
      style={{
        background: bg,
        color: fg,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  )
}

type View = "dashboard" | "crm" | "map" | "surveys" | "form"

// ─── CRM DATA — Real C.C. Hiper Jumbo businesses from occupancy report 06-08-2026
const leads = [
  // PLANTA ALTA — Anclas y locales de alto tráfico
  {
    id: "PA50",
    nombre: "Casino Platinum, C.A.",
    zona: "Planta Alta",
    cat: "Entretenimiento",
    prov: "Inter",
    pago: 210,
    pts: 96,
    score: "A1",
    plan: "600 Mbps Emp.",
    feas: "Factible",
    accion: "Negociando contrato",
    avatar: "CP",
  },
  {
    id: "SOT",
    nombre: "Hyper Gym, C.A.",
    zona: "Sótano",
    cat: "Fitness",
    prov: "NetUno",
    pago: 145,
    pts: 94,
    score: "A1",
    plan: "600 Mbps Emp.",
    feas: "Factible",
    accion: "Propuesta enviada",
    avatar: "HG",
  },
  {
    id: "PA04",
    nombre: "Hyper Mercado Modelo, C.A.",
    zona: "Planta Alta",
    cat: "Supermercado",
    prov: "Inter",
    pago: 280,
    pts: 92,
    score: "A1",
    plan: "600 Mbps Emp.",
    feas: "Factible",
    accion: "Reunión agendada",
    avatar: "HM",
  },
  {
    id: "PA01",
    nombre: "SISPROT GLOBAL FIBER (SGF)",
    zona: "Planta Alta",
    cat: "Oficina SGF",
    prov: "—",
    pago: 0,
    pts: 100,
    score: "A1",
    plan: "Punto de venta",
    feas: "Factible",
    accion: "✅ Nuestra oficina en CC",
    avatar: "SG",
  },
  {
    id: "PA07",
    nombre: "TU PUNTO SHOP ELECTRONIC",
    zona: "Planta Alta",
    cat: "Electrónica",
    prov: "Fibex",
    pago: 55,
    pts: 88,
    score: "A1",
    plan: "300 Mbps PYME",
    feas: "Factible",
    accion: "Propuesta enviada",
    avatar: "TP",
  },
  {
    id: "PB04",
    nombre: "Mobile Shop Las Americas",
    zona: "Planta Baja",
    cat: "Telefonía",
    prov: "Datos Móviles",
    pago: 0,
    pts: 82,
    score: "A2",
    plan: "200 Mbps PYME",
    feas: "Factible",
    accion: "Cita agendada",
    avatar: "MS",
  },
  {
    id: "PA09",
    nombre: "Farmacia Malanga, C.A.",
    zona: "Planta Alta",
    cat: "Farmacia",
    prov: "Inter",
    pago: 48,
    pts: 80,
    score: "A2",
    plan: "200 Mbps PYME",
    feas: "Factible",
    accion: "Propuesta enviada",
    avatar: "FM",
  },
  {
    id: "PA06",
    nombre: "Lotus Beauty Studio, C.A.",
    zona: "Planta Alta",
    cat: "Belleza/Spa",
    prov: "NetUno",
    pago: 38,
    pts: 76,
    score: "A2",
    plan: "200 Mbps PYME",
    feas: "Factible",
    accion: "Cita agendada",
    avatar: "LB",
  },
  {
    id: "PA03",
    nombre: "KP Zona Digital, C.A.",
    zona: "Planta Alta",
    cat: "Tecnología",
    prov: "Fibex",
    pago: 42,
    pts: 74,
    score: "B",
    plan: "100 Mbps PYME",
    feas: "Factible",
    accion: "Seguimiento activo",
    avatar: "KP",
  },
  {
    id: "PB05",
    nombre: "Corporac. Logica Digital CA",
    zona: "Planta Baja",
    cat: "Tecnología",
    prov: "360NET",
    pago: 35,
    pts: 71,
    score: "B",
    plan: "100 Mbps PYME",
    feas: "Factible",
    accion: "Primer contacto",
    avatar: "CL",
  },
  {
    id: "FC01",
    nombre: "Joanes Lunch, C.A.",
    zona: "Feria de Comida",
    cat: "Restaurante",
    prov: "Datos Móviles",
    pago: 0,
    pts: 68,
    score: "B",
    plan: "100 Mbps PYME",
    feas: "Con Obra",
    accion: "Visita técnica pend.",
    avatar: "JL",
  },
  {
    id: "FC02",
    nombre: "Express Hong Kong, C.A.",
    zona: "Feria de Comida",
    cat: "Rest. Asiática",
    prov: "Otro",
    pago: 22,
    pts: 65,
    score: "B",
    plan: "100 Mbps PYME",
    feas: "Con Obra",
    accion: "Seguimiento",
    avatar: "EH",
  },
  {
    id: "FC04",
    nombre: "Pizza Mia, C.A.",
    zona: "Feria de Comida",
    cat: "Pizzería",
    prov: "Inter",
    pago: 30,
    pts: 62,
    score: "B",
    plan: "100 Mbps PYME",
    feas: "Factible",
    accion: "Seguimiento",
    avatar: "PM",
  },
  {
    id: "PA02",
    nombre: "Lokuras Fashion, C.A.",
    zona: "Planta Alta",
    cat: "Moda",
    prov: "NetUno",
    pago: 31,
    pts: 58,
    score: "C",
    plan: "50 Mbps Hogar",
    feas: "Pendiente",
    accion: "Sin contacto aún",
    avatar: "LF",
  },
  {
    id: "PA08",
    nombre: "Venezia Joyas VIP, C.A.",
    zona: "Planta Alta",
    cat: "Joyería",
    prov: "360NET",
    pago: 28,
    pts: 55,
    score: "C",
    plan: "50 Mbps Hogar",
    feas: "Pendiente",
    accion: "Revisión técnica",
    avatar: "VJ",
  },
  {
    id: "PB01",
    nombre: "Hyper Joyas, C.A.",
    zona: "Planta Baja",
    cat: "Joyería",
    prov: "Fibex",
    pago: 25,
    pts: 52,
    score: "C",
    plan: "50 Mbps Hogar",
    feas: "Pendiente",
    accion: "Sin contacto aún",
    avatar: "HJ",
  },
  {
    id: "FC07",
    nombre: "Shawarma Corner",
    zona: "Feria de Comida",
    cat: "Rest. Árabe",
    prov: "Otro",
    pago: 18,
    pts: 44,
    score: "C",
    plan: "50 Mbps Hogar",
    feas: "Pendiente",
    accion: "Sin contacto aún",
    avatar: "SC",
  },
  {
    id: "PA05",
    nombre: "Woman Fit",
    zona: "Planta Alta",
    cat: "Fitness/Moda",
    prov: "Sin servicio",
    pago: 0,
    pts: 38,
    score: "D",
    plan: "N/A",
    feas: "Pendiente",
    accion: "Evaluar",
    avatar: "WF",
  },
  {
    id: "FC09",
    nombre: "L'Artigian, ca.",
    zona: "Feria de Comida",
    cat: "Rest. Italiana",
    prov: "Sin servicio",
    pago: 0,
    pts: 32,
    score: "D",
    plan: "N/A",
    feas: "No Factible",
    accion: "Descartado",
    avatar: "LA",
  },
  {
    id: "PB06",
    nombre: "Comercializadora Dogs M.",
    zona: "Planta Baja",
    cat: "Mascotas",
    prov: "Sin servicio",
    pago: 0,
    pts: 28,
    score: "D",
    plan: "N/A",
    feas: "No Factible",
    accion: "Descartado",
    avatar: "DM",
  },
]

// Real C.C. Hiper Jumbo locals from occupancy report — 5 zones
const mapLocals = [
  // PLANTA BAJA — locales PB
  {
    id: "PB04",
    x: 38,
    y: 72,
    w: 78,
    h: 48,
    nombre: "Mobile Shop",
    score: "A2",
    vendedor: "Carlos R.",
  },
  {
    id: "PB05",
    x: 124,
    y: 72,
    w: 78,
    h: 48,
    nombre: "Logica Digital",
    score: "B",
    vendedor: "Carlos R.",
  },
  {
    id: "PB01",
    x: 210,
    y: 72,
    w: 78,
    h: 48,
    nombre: "Hyper Joyas",
    score: "C",
    vendedor: "María L.",
  },
  {
    id: "PB06",
    x: 296,
    y: 72,
    w: 78,
    h: 48,
    nombre: "Dogs Market",
    score: "D",
    vendedor: "María L.",
  },
  {
    id: "PB02",
    x: 38,
    y: 130,
    w: 78,
    h: 48,
    nombre: "Macoba Cafe",
    score: "B",
    vendedor: "Carlos R.",
  },
  {
    id: "PB03",
    x: 124,
    y: 130,
    w: 78,
    h: 48,
    nombre: "Tiro D'Eskina",
    score: "C",
    vendedor: "Pedro M.",
  },
  {
    id: "PB07",
    x: 210,
    y: 130,
    w: 78,
    h: 48,
    nombre: "Creativy Space",
    score: "B",
    vendedor: "Pedro M.",
  },
  {
    id: "PB08",
    x: 296,
    y: 130,
    w: 78,
    h: 48,
    nombre: "SATRIM Kiosco",
    score: "C",
    vendedor: "Ana G.",
  },
  // PLANTA ALTA — locales PA
  {
    id: "PA50",
    x: 38,
    y: 248,
    w: 100,
    h: 54,
    nombre: "Casino Platinum",
    score: "A1",
    vendedor: "Carlos R.",
  },
  {
    id: "PA04",
    x: 148,
    y: 248,
    w: 100,
    h: 54,
    nombre: "Hyper Mercado",
    score: "A1",
    vendedor: "Carlos R.",
  },
  {
    id: "PA07",
    x: 258,
    y: 248,
    w: 78,
    h: 54,
    nombre: "Tu Punto Shop",
    score: "A1",
    vendedor: "María L.",
  },
  {
    id: "PA01",
    x: 344,
    y: 248,
    w: 78,
    h: 54,
    nombre: "SGF Oficina",
    score: "A1",
    vendedor: "Nuestra oficina",
  },
  {
    id: "PA06",
    x: 38,
    y: 312,
    w: 78,
    h: 48,
    nombre: "Lotus Beauty",
    score: "A2",
    vendedor: "Pedro M.",
  },
  {
    id: "PA09",
    x: 124,
    y: 312,
    w: 78,
    h: 48,
    nombre: "Farmacia Malanga",
    score: "A2",
    vendedor: "María L.",
  },
  {
    id: "PA03",
    x: 210,
    y: 312,
    w: 78,
    h: 48,
    nombre: "KP Zona Digital",
    score: "B",
    vendedor: "Ana G.",
  },
  {
    id: "PA02",
    x: 296,
    y: 312,
    w: 78,
    h: 48,
    nombre: "Lokuras Fashion",
    score: "C",
    vendedor: "Ana G.",
  },
  // FERIA DE COMIDA — locales FC
  {
    id: "FC01",
    x: 38,
    y: 432,
    w: 68,
    h: 44,
    nombre: "Joanes Lunch",
    score: "B",
    vendedor: "Pedro M.",
  },
  {
    id: "FC02",
    x: 114,
    y: 432,
    w: 68,
    h: 44,
    nombre: "Express HK",
    score: "B",
    vendedor: "Pedro M.",
  },
  {
    id: "FC04",
    x: 190,
    y: 432,
    w: 68,
    h: 44,
    nombre: "Pizza Mia",
    score: "B",
    vendedor: "Ana G.",
  },
  {
    id: "FC07",
    x: 266,
    y: 432,
    w: 68,
    h: 44,
    nombre: "Shawarma Corner",
    score: "C",
    vendedor: "Ana G.",
  },
  {
    id: "FC09",
    x: 342,
    y: 432,
    w: 68,
    h: 44,
    nombre: "L'Artigian",
    score: "D",
    vendedor: "—",
  },
  {
    id: "FC05",
    x: 418,
    y: 432,
    w: 68,
    h: 44,
    nombre: "Sazón Express",
    score: "B",
    vendedor: "Carlos R.",
  },
]

const scoreHex: Record<string, string> = {
  A1: "#10B981",
  A2: "#34D399",
  B: "#3B82F6",
  C: "#F59E0B",
  D: "#EF4444",
  E: "#CBD5E1",
}

// Real data from C.C. Hiper Jumbo — 69,759 m² total, 5 zonas
const provData = [
  { name: "Inter", value: 31 },
  { name: "NetUno", value: 24 },
  { name: "Fibex", value: 19 },
  { name: "360NET", value: 12 },
  { name: "Datos Móv.", value: 8 },
  { name: "Otro/Sin", value: 6 },
]
const prospData = [
  { name: "A1", v: 5, c: "#10B981" },
  { name: "A2", v: 3, c: "#34D399" },
  { name: "B", v: 6, c: "#3B82F6" },
  { name: "C", v: 4, c: "#F59E0B" },
  { name: "D", v: 3, c: "#EF4444" },
  { name: "E", v: 2, c: "#CBD5E1" },
]
const areaData = [
  { d: "Sem 1", s: 2 },
  { d: "Sem 2", s: 5 },
  { d: "Sem 3", s: 9 },
  { d: "Sem 4", s: 14 },
  { d: "Sem 5", s: 18 },
  { d: "Sem 6", s: 20 },
]

// ─── SHELL ───────────────────────────────────────────────────────────────────
interface AppProps {
  userEmail?: string
  onLogout?: () => void
  onOpenSurvey?: () => void
}

export default function App({ userEmail, onLogout, onOpenSurvey }: AppProps) {
  const [view, setView] = useState<View>("dashboard")
  const [leadsList, setLeadsList] = useState(leads)
  const [surveysList, setSurveysList] = useState<SurveyResponse[]>([])
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null)
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null)

  const loadData = async () => {
    const dbLeads = await fetchLeadsFromSupabase()
    if (dbLeads && dbLeads.length > 0) {
      setLeadsList(dbLeads as any)
    }
    const dbSurveys = await fetchSurveysFromSupabase()
    setSurveysList(dbSurveys)
    setIsSupabaseConnected(true)
  }

  useEffect(() => {
    loadData()
  }, [])

  const navItems: { id: View; icon: string; label: string }[] = [
    { id: "dashboard", icon: "◈", label: "Análisis" },
    { id: "crm", icon: "◉", label: "Prospectos" },
    { id: "map", icon: "⬡", label: "Mapa" },
    { id: "surveys", icon: "📋", label: "Respuestas" },
    { id: "form", icon: "📝", label: "Encuesta" },
  ]

  return (
    <div
      className="app-shell"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#0A0F1E",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        className="app-sidebar"
        style={{
          width: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          background: "#0D1526",
          borderRight: `1px solid #1A2540`,
          gap: 4,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg,${brand},${cyber})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            boxShadow: `0 0 20px ${brand}60`,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>
            S
          </span>
        </div>
        <div
          className="app-sidebar-nav"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              title={n.label}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "none",
                background: view === n.id ? `${brand}22` : "transparent",
                color: view === n.id ? cyber : "#475569",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                transition: "all .15s",
                outline: view === n.id ? `1.5px solid ${brand}44` : "none",
              }}
            >
              <span>{n.icon}</span>
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                {n.label.slice(0, 4)}
              </span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#1E3A5F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
          title={userEmail || "Admin SGF"}
        >
          <span style={{ color: cyber, fontSize: 11, fontWeight: 700 }}>
            ADM
          </span>
        </div>
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <header
          className="top-header"
          style={{
            height: 52,
            background: "#0D1526",
            borderBottom: `1px solid #1A2540`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
              Hyper Encuestas SGF
            </span>
            <span style={{ color: "#1E3A5F", margin: "0 8px" }}>·</span>
            <span style={{ color: "#64748B", fontSize: 12 }}>
              C.C. Hiper Jumbo
            </span>
          </div>
          <div style={{ flex: 1 }} />

          {/* Indicador Supabase */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: green,
                display: "inline-block",
                boxShadow: `0 0 8px ${green}`,
              }}
            />
            <span style={{ color: green, fontSize: 11, fontWeight: 700 }}>
              ⚡ Supabase {isSupabaseConnected ? "Conectado" : "Listo"}
            </span>
          </div>

          <button
            onClick={() => setView("form")}
            style={{
              background: `linear-gradient(135deg, ${brand}, ${cyber})`,
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: `0 4px 14px ${brand}40`,
              whiteSpace: "nowrap",
            }}
          >
            <span>📝</span> Nueva Encuesta
          </button>

          {userEmail && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#111827",
                border: `1px solid #1F2937`,
                borderRadius: 8,
                padding: "4px 10px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: cyber,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 140,
                }}
              >
                👤 {userEmail}
              </span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 700,
                    marginLeft: 2,
                  }}
                >
                  Salir
                </button>
              )}
            </div>
          )}
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", background: "#0A0F1E" }}>
          {view === "dashboard" && (
            <Dashboard
              surveys={surveysList}
              totalLocals={leadsList.length || 326}
              onNavigateToForm={() => setView("form")}
            />
          )}
          {view === "crm" && <CRM data={leadsList} />}
          {view === "map" && <MapView />}
          {view === "surveys" && (
            <SurveysView
              surveys={surveysList}
              onRefresh={loadData}
              onNavigateToForm={() => setView("form")}
              onSelectSurvey={(s) => setSelectedSurvey(s)}
              onEditLocal={(id) => setEditingLocalId(id)}
            />
          )}
          {view === "form" && (
            <div
              style={{
                padding: "24px 20px 40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100%",
              }}
            >
              <div style={{ maxWidth: 680, width: "100%" }}>
                <SurveyForm
                  isEmbedded={true}
                  onCompleteInModal={() => {
                    loadData()
                    setView("surveys")
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Detalles Encuesta (Top-level Viewport Overlay) */}
      {selectedSurvey && (
        <div
          className="modal-overlay animate-in"
          onClick={() => setSelectedSurvey(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSurvey(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#94A3B8",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
                paddingRight: 30,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${brand}, ${cyber})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#fff",
                  boxShadow: `0 0 20px ${brand}50`,
                  flexShrink: 0,
                }}
              >
                {(selectedSurvey.local_id || "LC").slice(0, 2)}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#F8FAFC",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedSurvey.nombre_local || selectedSurvey.local_id}
                </h3>
                <p
                  style={{
                    margin: "2px 0 0",
                    color: cyber,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Local: <code>{selectedSurvey.local_id}</code> ·{" "}
                  {selectedSurvey.zona || "Planta Baja"}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#111827",
                borderRadius: 16,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 20,
                border: "1px solid #1F2937",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748B", fontWeight: 500 }}>
                  Estatus Visita
                </span>
                <span
                  style={{
                    background:
                      selectedSurvey.visit_result === "Completada"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    color:
                      selectedSurvey.visit_result === "Completada"
                        ? green
                        : amber,
                    border: `1px solid ${
                      selectedSurvey.visit_result === "Completada"
                        ? green
                        : amber
                    }40`,
                    padding: "3px 12px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {selectedSurvey.visit_result}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>Proveedor Actual:</span>
                <strong style={{ color: "#F1F5F9" }}>
                  {selectedSurvey.prov_actual || "Sin proveedor"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>Redes Sociales:</span>
                <strong style={{ color: cyber }}>
                  {selectedSurvey.redes_sociales || "No registrado"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>
                  Sistema de Facturación / ERP:
                </span>
                <strong style={{ color: "#F8FAFC" }}>
                  {selectedSurvey.sistema_facturacion || "No registrado"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>¿Pagos Automatizados?:</span>
                <strong style={{ color: "#CBD5E1" }}>
                  {selectedSurvey.pagos_automatizados || "No registrado"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>
                  Interés en Automatización:
                </span>
                <strong
                  style={{
                    color: selectedSurvey.interes_automatizar?.includes("Sí")
                      ? green
                      : amber,
                  }}
                >
                  {selectedSurvey.interes_automatizar || "No registrado"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  borderTop: "1px solid #1A2438",
                  paddingTop: 8,
                }}
              >
                <span style={{ color: "#64748B" }}>Contacto / Decisor:</span>
                <strong style={{ color: "#F8FAFC" }}>
                  {selectedSurvey.contacto_nombre || "No registrado"}{" "}
                  {selectedSurvey.contacto_tel
                    ? `(${selectedSurvey.contacto_tel})`
                    : ""}
                </strong>
              </div>

              {selectedSurvey.observaciones_visita && (
                <div style={{ borderTop: "1px solid #1A2438", paddingTop: 8 }}>
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Observaciones de Visita:
                  </span>
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: 12,
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    "{selectedSurvey.observaciones_visita}"
                  </p>
                </div>
              )}

              {selectedSurvey.fallas && selectedSurvey.fallas.length > 0 && (
                <div style={{ borderTop: "1px solid #1A2438", paddingTop: 10 }}>
                  <span
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "block",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    Fallas Reportadas del ISP actual
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedSurvey.fallas.map((f, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "rgba(239, 68, 68, 0.12)",
                          border: `1px solid ${red}30`,
                          color: "#FCA5A5",
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ⚠️ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedSurvey(null)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${brand}, ${cyber})`,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 16px ${brand}40`,
              }}
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      )}

      {/* Modal Repetir Encuesta (Top-level Viewport Overlay) */}
      {editingLocalId && (
        <div
          className="modal-overlay animate-in"
          onClick={() => setEditingLocalId(null)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 680 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📋</span>
                <div>
                  <h3 style={{ color: "#F8FAFC", fontSize: 16, fontWeight: 800, margin: 0 }}>
                    Actualizar Encuesta Comercial
                  </h3>
                  <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>
                    Local ID: <strong style={{ color: cyber }}>{editingLocalId}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingLocalId(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#94A3B8",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
            <SurveyForm
              initialLocalId={editingLocalId}
              isEmbedded={true}
              onCompleteInModal={() => {
                setEditingLocalId(null)
                loadData()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({
  surveys,
  totalLocals,
  onNavigateToForm,
}: {
  surveys: SurveyResponse[]
  totalLocals: number
  onNavigateToForm?: () => void
}) {
  const completed = surveys.filter((s) => s.visit_result === "Completada")
  const countEncuestados = surveys.length
  const pctEncuestados =
    totalLocals > 0 ? ((countEncuestados / totalLocals) * 100).toFixed(1) : "0"

  // Encuestas realizadas hoy (comparando fecha de created_at o local date)
  const todayStr = new Date().toISOString().split("T")[0]
  const todaySurveys = surveys.filter((s) => {
    if (!s.created_at) return true // si es recién enviada en la sesión actual
    return s.created_at.startsWith(todayStr)
  })
  const countToday = todaySurveys.length

  const totalMonthlyRev = completed.reduce(
    (acc, s) => acc + (parseFloat(s.pago_mensual || "0") || 0),
    0,
  )
  const avgTicket =
    completed.length > 0 ? (totalMonthlyRev / completed.length).toFixed(2) : "0"

  // Cálculos de cuota de mercado en todo el Centro Comercial (~300+ locales)
  const sgfClientsCount =
    leads.filter((l) => l.prov.includes("SGF") || l.prov.includes("Sisprot"))
      .length || 0
  const sgfSharePct =
    totalLocals > 0 ? ((sgfClientsCount / totalLocals) * 100).toFixed(1) : "0"

  // Competidores principales
  const interCount = leads.filter((l) => l.prov === "Inter").length || 0
  const interPct =
    totalLocals > 0 ? ((interCount / totalLocals) * 100).toFixed(1) : "0"

  const kpis = [
    {
      label: "Encuestas realizadas hoy",
      value: `${countToday}`,
      total: "hoy",
      pct: null,
      color: green,
      icon: "📅",
      trend:
        countToday === 0
          ? "Sin registros hoy"
          : `+${countToday} registradas en la jornada`,
    },
    {
      label: "Locales encuestados (Total)",
      value: `${countEncuestados}`,
      total: `/ ${totalLocals}`,
      pct: parseFloat(pctEncuestados),
      color: brand,
      icon: "📍",
      trend:
        countEncuestados === 0
          ? "En espera de respuestas"
          : `+${countEncuestados} registrados en Supabase`,
    },
    {
      label: "Dominio Mercado SGF",
      value: `${sgfSharePct}%`,
      total: `(${sgfClientsCount} locales)`,
      pct: parseFloat(sgfSharePct),
      color: cyber,
      icon: "⚡",
      trend: `SGF vs Inter (${interPct}%) en C.C.`,
    },
    {
      label: "Encuestas completadas",
      value: `${completed.length}`,
      total: "locales",
      pct:
        countEncuestados > 0
          ? Math.round((completed.length / countEncuestados) * 100)
          : 0,
      color: "#A78BFA",
      icon: "⭐",
      trend: "Censo efectivo en campo",
    },
    {
      label: "Ticket promedio",
      value: `$${avgTicket}`,
      total: "USD",
      pct: null,
      color: amber,
      icon: "💰",
      trend: "Promedio ISP reportado",
    },
    {
      label: "Ingreso potencial",
      value: `$${totalMonthlyRev.toLocaleString()}`,
      total: "/mes",
      pct: null,
      color: "#34D399",
      icon: "📈",
      trend: "Captado de encuestas reales",
    },
  ]

  // Distribución dinámica por proveedor según encuestas reales
  const provCounts: Record<string, number> = {}
  completed.forEach((s) => {
    const prov = s.prov_actual || "Otro"
    provCounts[prov] = (provCounts[prov] || 0) + 1
  })

  const provBars =
    Object.keys(provCounts).length > 0
      ? Object.entries(provCounts).map(([name, count]) => ({
          name,
          v: Math.round((count / completed.length) * 100),
        }))
      : [{ name: "Sin datos", v: 0 }]

  // Progresión histórica
  const areaData = [
    { d: "Sem 1", s: Math.round(countEncuestados * 0.1) },
    { d: "Sem 2", s: Math.round(countEncuestados * 0.3) },
    { d: "Sem 3", s: Math.round(countEncuestados * 0.6) },
    { d: "Sem 4", s: countEncuestados },
  ]

  const prospData = [
    { name: "Completadas", v: completed.length, c: green },
    {
      name: "Novedades / Alertas",
      v: surveys.length - completed.length,
      c: amber,
    },
    {
      name: "Por Encuestar",
      v: Math.max(0, totalLocals - surveys.length),
      c: slate,
    },
  ]

  return (
    <div className="animate-in" style={{ padding: "28px 28px 40px" }}>
      {/* Section label */}
      <div style={{ marginBottom: 22 }}>
        <p
          style={{
            color: "#475569",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Resumen Ejecutivo (En Vivo)
        </p>
        <h1
          style={{
            color: "#F1F5F9",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.02em",
          }}
        >
          Dashboard Comercial Supabase
        </h1>
      </div>

      {countEncuestados === 0 && (
        <div
          style={{
            background: "rgba(0, 163, 255, 0.08)",
            border: "1px solid rgba(0, 163, 255, 0.25)",
            borderRadius: 14,
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#F8FAFC",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Base de Datos lista para iniciar el Censo
              </p>
              <p style={{ margin: 0, color: "#94A3B8", fontSize: 12 }}>
                Las métricas están en 0. Al llenar encuestas desde el{" "}
                <strong>Formulario Público</strong>, los indicadores se
                actualizarán automáticamente en tiempo real.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToForm && onNavigateToForm()}
            style={{
              background: `linear-gradient(135deg, ${brand}, ${cyber})`,
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            📝 Llenar Encuesta
          </button>
        </div>
      )}

      {/* KPI row */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {kpis.map((k) => (
          <div
            key={k.label}
            style={{
              background: "#111827",
              border: `1px solid #1F2937`,
              borderRadius: 16,
              padding: "18px 18px 16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2.5,
                background: `linear-gradient(90deg,${k.color},${k.color}00)`,
                borderRadius: "16px 16px 0 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>{k.icon}</span>
              {k.pct !== null && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: k.color,
                    background: `${k.color}18`,
                    padding: "2px 8px",
                    borderRadius: 99,
                  }}
                >
                  {k.pct}%
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 3,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  color: "#F1F5F9",
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-.02em",
                  lineHeight: 1,
                }}
              >
                {k.value}
              </span>
              <span style={{ color: "#475569", fontSize: 13, fontWeight: 500 }}>
                {k.total}
              </span>
            </div>
            <p
              style={{
                color: "#64748B",
                fontSize: 11,
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              {k.label}
            </p>
            {k.pct !== null && (
              <div
                style={{
                  height: 3,
                  background: "#1F2937",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, k.pct)}%`,
                    height: "100%",
                    background: k.color,
                    borderRadius: 2,
                  }}
                />
              </div>
            )}
            <p style={{ color: "#374151", fontSize: 10, marginTop: 6 }}>
              {k.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Area chart: encuestas en el tiempo */}
        <DarkCard
          title="Progreso del Censo"
          sub="Locales encuestados en Supabase"
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={areaData}
              margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={brand} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={brand} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="d"
                tick={{ fontSize: 10, fill: "#4B5563" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#4B5563" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1F2937",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#F1F5F9",
                }}
                cursor={{
                  stroke: brand,
                  strokeWidth: 1,
                  strokeDasharray: "4 2",
                }}
              />
              <Area
                type="monotone"
                dataKey="s"
                stroke={brand}
                strokeWidth={2.5}
                fill="url(#aGrad)"
                name="Encuestados"
                dot={{ r: 4, fill: brand, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </DarkCard>

        {/* Bar: proveedores */}
        <DarkCard
          title="Mercado ISP Actual"
          sub="Participación de encuestas reales"
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={provBars}
              margin={{ top: 8, right: 4, left: -28, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1F2937"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9.5, fill: "#4B5563" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9.5, fill: "#4B5563" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1F2937",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#F1F5F9",
                }}
                cursor={{ fill: `${brand}10` }}
              />
              <Bar dataKey="v" radius={[5, 5, 0, 0]} name="% Locales">
                {provBars.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0
                        ? brand
                        : `${brand}${["AA", "88", "66", "44", "33"][i - 1] ?? "22"}`
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DarkCard>

        {/* Donut: prospectos */}
        <DarkCard
          title="Estado del Censo"
          sub="Estatus general C.C. Hiper Jumbo"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={prospData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={2}
                  dataKey="v"
                  startAngle={90}
                  endAngle={-270}
                >
                  {prospData.map((d, i) => (
                    <Cell key={i} fill={d.c} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {prospData.map((d) => (
                <div
                  key={d.name}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: d.c,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#9CA3AF", flex: 1 }}>
                    {d.name}
                  </span>
                  <span
                    style={{ fontSize: 11, fontWeight: 700, color: "#F1F5F9" }}
                  >
                    {d.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DarkCard>
      </div>

      {/* Bottom row: top prospects */}
      <div style={{ marginTop: 16 }}>
        <DarkCard
          title="Top Prospectos A1 — Acción Inmediata"
          sub="Anclas del C.C. Hiper Jumbo · Alta facturación · Factibilidad confirmada"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginTop: 4,
            }}
          >
            {leads
              .filter((l) => l.score === "A1")
              .map((l) => (
                <div
                  key={l.id}
                  style={{
                    background: "#0D1526",
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: `1px solid #1A2540`,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `linear-gradient(135deg,${brand},${cyber})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}
                    >
                      {l.avatar}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: "#F1F5F9",
                        fontSize: 13,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.nombre}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: 11, marginTop: 1 }}>
                      {l.zona} · {l.prov}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      {badge(l.score)}
                      <span style={{ fontSize: 11, color: "#64748B" }}>
                        {l.pts} pts
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: green, fontSize: 14, fontWeight: 800 }}>
                      ${l.pago}
                    </p>
                    <p style={{ color: "#374151", fontSize: 10 }}>actual</p>
                  </div>
                </div>
              ))}
          </div>
        </DarkCard>
      </div>
    </div>
  )
}

function DarkCard({
  title,
  sub,
  children,
}: {
  title: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: `1px solid #1F2937`,
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <p style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 700 }}>
          {title}
        </p>
        {sub && (
          <p style={{ color: "#4B5563", fontSize: 11, marginTop: 2 }}>{sub}</p>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── CRM ─────────────────────────────────────────────────────────────────────
function CRM({ data }: { data?: typeof leads }) {
  const leadsData = data && data.length > 0 ? data : leads
  const [sel, setSel] = useState<typeof leads[0] | null>(null)
  const [q, setQ] = useState("")
  const [tab, setTab] = useState<"all" | "a" | "b" | "c">("all")

  const rows = leadsData.filter((l) => {
    const matchQ =
      l.nombre.toLowerCase().includes(q.toLowerCase()) ||
      l.id.toLowerCase().includes(q.toLowerCase())
    const matchT =
      tab === "all" ||
      (tab === "a" && (l.score === "A1" || l.score === "A2")) ||
      (tab === "b" && l.score === "B") ||
      (tab === "c" && (l.score === "C" || l.score === "D" || l.score === "E"))
    return matchQ && matchT
  })

  const tabs: { id: "all" | "a" | "b" | "c"; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: leadsData.length },
    {
      id: "a",
      label: "A1 / A2 — Prioritarios",
      count: leadsData.filter((l) => l.score === "A1" || l.score === "A2")
        .length,
    },
    {
      id: "b",
      label: "B — Alta Oportunidad",
      count: leadsData.filter((l) => l.score === "B").length,
    },
    {
      id: "c",
      label: "C / D — Seguimiento",
      count: leadsData.filter(
        (l) => l.score === "C" || l.score === "D" || l.score === "E",
      ).length,
    },
  ]

  return (
    <div
      className="animate-in"
      style={{ display: "flex", height: "100%", overflow: "hidden" }}
    >
      {/* Table panel */}
      <div
        style={{
          flex: 1,
          padding: "28px 24px",
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              color: "#475569",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Pipeline Comercial
          </p>
          <h1
            style={{
              color: "#F1F5F9",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.02em",
            }}
          >
            Prospectos & Scoring
          </h1>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4B5563",
                fontSize: 13,
              }}
            >
              🔍
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar local o nombre..."
              style={{
                width: "100%",
                background: "#111827",
                border: `1px solid #1F2937`,
                borderRadius: 10,
                padding: "9px 12px 9px 36px",
                color: "#F1F5F9",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "#111827",
              border: `1px solid #1F2937`,
              borderRadius: 10,
              padding: "4px",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: tab === t.id ? brand : "transparent",
                  color: tab === t.id ? "#fff" : "#6B7280",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}{" "}
                <span
                  style={{
                    opacity: 0.6,
                    fontSize: 10,
                    fontWeight: 400,
                    marginLeft: 2,
                  }}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <button
            style={{
              background: "transparent",
              border: `1px solid #1F2937`,
              color: "#6B7280",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ↓ Exportar
          </button>
        </div>

        {/* Table */}
        <div
          className="table-responsive"
          style={{
            background: "#111827",
            border: `1px solid #1F2937`,
            borderRadius: 16,
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid #1F2937` }}>
                {[
                  "Local",
                  "Nombre",
                  "Proveedor actual",
                  "Pago",
                  "Puntaje",
                  "Score",
                  "Plan SGF",
                  "Factibilidad",
                  "Acción",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#374151",
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  onClick={() => setSel(sel?.id === r.id ? null : r)}
                  style={{
                    borderBottom:
                      i < rows.length - 1 ? `1px solid #111827` : "none",
                    background: sel?.id === r.id ? `${brand}12` : "transparent",
                    cursor: "pointer",
                    transition: "background .1s",
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <code
                      style={{
                        fontSize: 11,
                        color: cyber,
                        fontWeight: 600,
                        background: "#0D1A36",
                        padding: "2px 8px",
                        borderRadius: 5,
                      }}
                    >
                      {r.id}
                    </code>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 9 }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: `${scoreHex[r.score]}22`,
                          border: `1.5px solid ${scoreHex[r.score]}44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: scoreHex[r.score],
                          }}
                        >
                          {r.avatar}
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            color: "#F1F5F9",
                            fontSize: 13,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.nombre}
                        </p>
                        <p
                          style={{
                            color: "#374151",
                            fontSize: 10,
                            marginTop: 1,
                          }}
                        >
                          {r.zona} · {r.cat}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#6B7280",
                      fontSize: 12,
                    }}
                  >
                    {r.prov}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        color:
                          r.pago > 80
                            ? green
                            : r.pago > 40
                              ? "#F1F5F9"
                              : "#6B7280",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      ${r.pago}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 4,
                          background: "#1F2937",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${r.pts}%`,
                            height: "100%",
                            background:
                              r.pts >= 80 ? green : r.pts >= 60 ? blue : amber,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: "#9CA3AF",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {r.pts}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{badge(r.score)}</td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "#6B7280",
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.plan}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{feasTag(r.feas)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 12, color: "#4B5563" }}>
                      {r.accion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#374151", fontSize: 11, marginTop: 12 }}>
          {rows.length} registros · haz click en una fila para ver el perfil
          completo
        </p>
      </div>

      {/* Drawer */}
      {sel && (
        <aside
          className="animate-in"
          style={{
            width: 340,
            borderLeft: `1px solid #1A2540`,
            background: "#0D1526",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Drawer header */}
          <div
            style={{
              padding: "24px 22px 20px",
              background: `linear-gradient(160deg,#0F2D6E,#0D1526)`,
              position: "relative",
            }}
          >
            <button
              onClick={() => setSel(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "#1E3A5F",
                border: "none",
                color: "#6B7280",
                borderRadius: 7,
                width: 28,
                height: 28,
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg,${scoreHex[sel.score]}33,${scoreHex[sel.score]}11)`,
                border: `2px solid ${scoreHex[sel.score]}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  color: scoreHex[sel.score],
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {sel.avatar}
              </span>
            </div>
            <h3
              style={{
                color: "#F1F5F9",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              {sel.nombre}
            </h3>
            <p style={{ color: "#4B5563", fontSize: 12 }}>
              {sel.zona} · {sel.cat}
            </p>
            <div style={{ display: "flex", gap: 7, marginTop: 12 }}>
              {badge(sel.score)}
              {feasTag(sel.feas)}
              <span
                style={{
                  fontSize: 11,
                  color: "#4B5563",
                  background: "#1E2D40",
                  padding: "3px 9px",
                  borderRadius: 99,
                }}
              >
                {sel.pts} pts
              </span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
            {/* Quick stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <StatMini label="Pago actual" val={`$${sel.pago}`} color={cyan} />
              <StatMini label="Plan sugerido" val={sel.plan} color={green} />
            </div>

            <DrawerSec title="Contacto Principal">
              <InfoLine label="Nombre" val="Ana Martínez" />
              <InfoLine label="WhatsApp" val="+58 412-555-0198" />
              <InfoLine label="Rol" val="Decisora Directa" />
              <InfoLine label="Canal" val="WhatsApp" />
            </DrawerSec>

            <DrawerSec title="Historial de Visitas">
              {[
                { d: "12 Ago 2026", r: "Completada", e: "Carlos R." },
                { d: "05 Ago 2026", r: "Encargado Ausente", e: "María L." },
              ].map((v) => (
                <div
                  key={v.d}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: `1px solid #1A2540`,
                  }}
                >
                  <span style={{ color: "#4B5563", fontSize: 11 }}>{v.d}</span>
                  <span
                    style={{
                      color: v.r === "Completada" ? green : amber,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {v.r}
                  </span>
                  <span style={{ color: "#374151", fontSize: 11 }}>{v.e}</span>
                </div>
              ))}
            </DrawerSec>

            <DrawerSec title="Actividad Reciente">
              {[
                {
                  d: "14 Ago",
                  t: "Propuesta enviada por WhatsApp",
                  dot: brand,
                },
                { d: "10 Ago", t: "Demo de velocidad realizada", dot: cyber },
                {
                  d: "06 Ago",
                  t: "Interés confirmado verbalmente",
                  dot: green,
                },
              ].map((a) => (
                <div
                  key={a.d}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: `1px solid #1A2540`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingTop: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: a.dot,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        background: "#1A2540",
                        marginTop: 4,
                      }}
                    />
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <p style={{ color: "#D1D5DB", fontSize: 12 }}>{a.t}</p>
                    <p style={{ color: "#374151", fontSize: 10, marginTop: 2 }}>
                      {a.d}
                    </p>
                  </div>
                </div>
              ))}
            </DrawerSec>

            <DrawerSec title="Archivos adjuntos">
              {[
                "Factura Inter Ago 2026.pdf",
                "Foto local entrada.jpg",
                "Propuesta SGF 300 Mbps.pdf",
              ].map((f) => (
                <div
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "#111827",
                    border: `1px solid #1F2937`,
                    marginBottom: 6,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {f.endsWith(".pdf") ? "📄" : "📷"}
                  </span>
                  <span
                    style={{
                      color: cyber,
                      fontSize: 12,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f}
                  </span>
                  <span style={{ color: "#374151", fontSize: 10 }}>↓</span>
                </div>
              ))}
            </DrawerSec>

            <button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(135deg,${brand},${cyber})`,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 16px ${brand}44`,
                marginTop: 4,
              }}
            >
              📅 Agendar Visita Técnica
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

const cyan = "#22D3EE"

function StatMini({
  label,
  val,
  color,
}: {
  label: string
  val: string
  color: string
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: `1px solid #1F2937`,
        borderRadius: 10,
        padding: "10px 12px",
      }}
    >
      <p style={{ color: "#374151", fontSize: 10, marginBottom: 4 }}>{label}</p>
      <p style={{ color: color, fontSize: 14, fontWeight: 700 }}>{val}</p>
    </div>
  )
}
function DrawerSec({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p
        style={{
          color: "#374151",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}
function InfoLine({ label, val }: { label: string; val: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: `1px solid #111827`,
      }}
    >
      <span style={{ color: "#4B5563", fontSize: 12 }}>{label}</span>
      <span style={{ color: "#D1D5DB", fontSize: 12, fontWeight: 500 }}>
        {val}
      </span>
    </div>
  )
}

// ─── MAP DATA — Real C.C. Hiper Jumbo architecture from blueprint layout ─────────────────────
type FloorId = "PB" | "PA" | "SOT" | "EXT"

const allMallUnits: MallUnit[] = generateAllMallUnits()

function MapView() {
  const [unitsState, setUnitsState] = useState<MallUnit[]>(() =>
    generateAllMallUnits(),
  )
  const [activeFloor, setActiveFloor] = useState<FloorId>("PB")
  const [selectedUnit, setSelectedUnit] = useState<MallUnit | null>(null)
  const [hovUnit, setHovUnit] = useState<MallUnit | null>(null)
  const [hovPos, setHovPos] = useState({ x: 0, y: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterScore, setFilterScore] = useState<string>("all")
  const [filterProv, setFilterProv] = useState<string>("all")

  const floors: {
    id: FloorId
    label: string
    sub: string
    badge: string
    color: string
  }[] = [
    {
      id: "PB",
      label: "Planta Baja",
      sub: "PB01 → PB75 · Hipermercado, Bancos & Pasillos",
      badge: `${unitsState.filter((u) => u.floor === "PB").length} Locales`,
      color: "#3B82F6",
    },
    {
      id: "PA",
      label: "Planta Alta",
      sub: "PA01 → PA70 · Casino, Cines Unidos & Feria (FC)",
      badge: `${unitsState.filter((u) => u.floor === "PA").length} Locales`,
      color: "#8B5CF6",
    },
    {
      id: "SOT",
      label: "Planta Sótano",
      sub: "SOT01 → SOT69 · Gym, Parking & Depósitos",
      badge: `${unitsState.filter((u) => u.floor === "SOT").length} Locales`,
      color: "#10B981",
    },
    {
      id: "EXT",
      label: "Exteriores & Luna Park",
      sub: "8,452.75 m² · Patio Servicio & Parking",
      badge: `${unitsState.filter((u) => u.floor === "EXT").length} Locales`,
      color: "#F59E0B",
    },
  ]

  // Filter units for the active floor
  const currentUnits = unitsState.filter((u) => {
    const matchFloor = u.floor === activeFloor
    const matchSearch =
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.prov.toLowerCase().includes(searchTerm.toLowerCase())
    const matchScore = filterScore === "all" || u.score === filterScore
    const matchProv =
      filterProv === "all" ||
      (filterProv === "Sin servicio"
        ? u.prov === "Sin servicio" ||
          u.prov === "Por Encuestar" ||
          u.prov === "—"
        : u.prov.includes(filterProv))
    return matchFloor && matchSearch && matchScore && matchProv
  })

  // Summary counts for current floor
  const totalCount = currentUnits.length
  const rentedCount = currentUnits.filter(
    (u) => u.estado === "alquilado",
  ).length
  const availableCount = currentUnits.filter(
    (u) => u.estado === "disponible",
  ).length

  const handleUpdateUnitField = (field: keyof MallUnit, val: any) => {
    if (!selectedUnit) return
    const updated = { ...selectedUnit, [field]: val }
    setSelectedUnit(updated)
    setUnitsState((prev) =>
      prev.map((u) => (u.id === selectedUnit.id ? updated : u)),
    )
  }

  return (
    <div
      className="animate-in"
      style={{
        padding: "24px 28px",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Header & Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                color: cyber,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              C.C. HIPER JUMBO MARACAY
            </span>
            <span style={{ color: "#334155" }}>•</span>
            <span style={{ color: "#94A3B8", fontSize: 12 }}>
              Plano Oficial de Ocupación Arquitectónica
            </span>
          </div>
          <h1
            style={{
              color: "#F8FAFC",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-.02em",
            }}
          >
            Distribución & Cobertura por Piso
          </h1>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", width: 220 }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 12,
                color: "#64748B",
              }}
            >
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar local, rubro..."
              style={{
                width: "100%",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                padding: "7px 12px 7px 30px",
                color: "#F8FAFC",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>

          {/* Score filter */}
          <select
            value={filterScore}
            onChange={(e) => setFilterScore(e.target.value)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 10,
              padding: "7px 12px",
              color: "#F8FAFC",
              fontSize: 12,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">Todos los Scores</option>
            <option value="A1">Score A1 (Prioritario)</option>
            <option value="A2">Score A2 (Alto)</option>
            <option value="B">Score B (Oportunidad)</option>
            <option value="C">Score C (Medio)</option>
            <option value="D">Score D (Bajo)</option>
            <option value="E">Disponible / Vacío</option>
          </select>

          {/* ISP filter */}
          <select
            value={filterProv}
            onChange={(e) => setFilterProv(e.target.value)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(0, 163, 255, 0.3)",
              borderRadius: 10,
              padding: "7px 12px",
              color: "#38BDF8",
              fontSize: 12,
              fontWeight: 600,
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">🌐 Todos los Proveedores</option>
            <option value="Inter">Inter (Fibra / Cable)</option>
            <option value="NetUno">NetUno</option>
            <option value="Fibex">Fibex Telecom</option>
            <option value="360NET">360NET</option>
            <option value="SGF">SGF Fibra Directa</option>
            <option value="Datos">Datos Móviles</option>
            <option value="Sin servicio">Sin Servicio / Por Encuestar</option>
          </select>
        </div>
      </div>

      {/* Floor Switcher Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {floors.map((f) => {
          const isAct = activeFloor === f.id
          return (
            <button
              key={f.id}
              onClick={() => {
                setActiveFloor(f.id)
                setSelectedUnit(null)
              }}
              style={{
                background: isAct
                  ? `linear-gradient(135deg, ${f.color}25, rgba(13, 21, 38, 0.9))`
                  : "rgba(15, 23, 42, 0.6)",
                border: `1.5px solid ${
                  isAct ? f.color : "rgba(255, 255, 255, 0.08)"
                }`,
                borderRadius: 14,
                padding: "12px 16px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: isAct ? `0 8px 24px -6px ${f.color}40` : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    color: isAct ? "#F8FAFC" : "#94A3B8",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {f.label}
                </p>
                <p
                  style={{
                    color: isAct ? f.color : "#64748B",
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  {f.sub}
                </p>
              </div>
              <span
                style={{
                  background: isAct ? f.color : "rgba(255, 255, 255, 0.05)",
                  color: isAct ? "#fff" : "#64748B",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 99,
                }}
              >
                {f.badge}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Interactive Map & Details Area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 18,
          flex: 1,
          minHeight: 520,
        }}
      >
        {/* SVG Blueprint View with Full Canvas Pan Scroll */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 18,
            padding: 20,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Legend Banner */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#10B981",
                    boxShadow: "0 0 8px #10B98160",
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}
                >
                  Alquilados (Verde / Azul)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#F59E0B",
                    boxShadow: "0 0 8px #F59E0B60",
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}
                >
                  Disponibles (Amarillo)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#EF4444",
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "#CBD5E1", fontWeight: 600 }}
                >
                  Sin Servicio / En Legal
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#38BDF8",
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
              }}
            >
              💡 Haz clic en un local para editar sus campos | Scroll / Arrastra
              para navegar
            </div>
          </div>

          {/* Interactive Scrollable Canvas 1100 x 850px */}
          <div
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "auto",
              background: "rgba(10, 15, 30, 0.6)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <svg
              width="1100"
              height="850"
              viewBox="0 0 1100 850"
              style={{
                display: "block",
                background:
                  "radial-gradient(circle at 50% 50%, rgba(15,23,42,0.8), rgba(10,15,30,0.95))",
              }}
            >
              <defs>
                <pattern
                  id="gridPattern"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="1"
                    fill="rgba(0, 163, 255, 0.15)"
                  />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect
                width="1100"
                height="850"
                fill="url(#gridPattern)"
                rx="12"
              />

              {/* Outer Architectural Envelope */}
              <rect
                x="25"
                y="25"
                width="1050"
                height="800"
                rx="20"
                fill="none"
                stroke="rgba(0, 163, 255, 0.25)"
                strokeWidth="2"
                strokeDasharray="8 6"
              />

              {/* Floor Specific Architectural Labels */}
              {activeFloor === "PB" && (
                <>
                  <text
                    x="550"
                    y="815"
                    textAnchor="middle"
                    style={{
                      fontSize: 13,
                      fill: "#3B82F6",
                      fontWeight: 800,
                      letterSpacing: ".15em",
                    }}
                  >
                    NIVEL PLANTA BAJA — ENTRADA PRINCIPAL, ANCLA HIPERMERCADO
                    (PB57) & PASILLOS
                  </text>
                </>
              )}

              {activeFloor === "PA" && (
                <>
                  <text
                    x="550"
                    y="815"
                    textAnchor="middle"
                    style={{
                      fontSize: 13,
                      fill: "#8B5CF6",
                      fontWeight: 800,
                      letterSpacing: ".15em",
                    }}
                  >
                    NIVEL PLANTA ALTA — CASINO PLATINUM (PA50), CINES UNIDOS
                    (PA41) & FERIA DE COMIDA (FC)
                  </text>
                </>
              )}

              {activeFloor === "SOT" && (
                <>
                  <text
                    x="550"
                    y="815"
                    textAnchor="middle"
                    style={{
                      fontSize: 13,
                      fill: "#10B981",
                      fontWeight: 800,
                      letterSpacing: ".15em",
                    }}
                  >
                    NIVEL SÓTANO — HYPER GYM (SOT36), ESTACIONAMIENTO &
                    SUBESTACIÓN
                  </text>
                </>
              )}

              {activeFloor === "EXT" && (
                <>
                  <text
                    x="550"
                    y="815"
                    textAnchor="middle"
                    style={{
                      fontSize: 13,
                      fill: "#F59E0B",
                      fontWeight: 800,
                      letterSpacing: ".15em",
                    }}
                  >
                    ÁREA EXTERIOR — LUNA PARK (8,452.75 m²), PATIO CARGA &
                    ACOMETIDA OPTICA
                  </text>
                </>
              )}

              {/* Units SVG rendering */}
              {currentUnits.map((unit) => {
                const isSelected = selectedUnit?.id === unit.id
                const isHovered = hovUnit?.id === unit.id
                const strokeColor =
                  unit.estado === "disponible"
                    ? "#F59E0B"
                    : unit.estado === "obra"
                      ? "#EF4444"
                      : scoreHex[unit.score] || "#3B82F6"
                const fillColor =
                  unit.estado === "disponible"
                    ? "rgba(245, 158, 11, 0.22)"
                    : unit.estado === "obra"
                      ? "rgba(239, 68, 68, 0.22)"
                      : `${strokeColor}28`

                return (
                  <g
                    key={unit.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedUnit(unit)}
                    onMouseEnter={(e) => {
                      setHovUnit(unit)
                      setHovPos({ x: e.clientX, y: e.clientY })
                    }}
                    onMouseLeave={() => setHovUnit(null)}
                  >
                    <rect
                      x={unit.x}
                      y={unit.y}
                      width={unit.w}
                      height={unit.h}
                      rx={8}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected || isHovered ? 3 : 1.5}
                      style={{
                        filter:
                          isHovered || isSelected
                            ? `drop-shadow(0 0 16px ${strokeColor}BB)`
                            : "none",
                        transition: "all 0.15s ease",
                      }}
                    />

                    {/* Unit ID Tag */}
                    <text
                      x={unit.x + unit.w / 2}
                      y={unit.y + (unit.h > 70 ? 22 : unit.h / 2 - 4)}
                      textAnchor="middle"
                      style={{
                        fontSize: unit.w > 120 ? 14 : 11,
                        fill: strokeColor,
                        fontWeight: 900,
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {unit.id}
                    </text>

                    {/* Unit ISP Provider Badge */}
                    <text
                      x={unit.x + unit.w / 2}
                      y={unit.y + (unit.h > 70 ? 42 : unit.h / 2 + 12)}
                      textAnchor="middle"
                      style={{
                        fontSize: unit.w > 100 ? 10 : 8.5,
                        fill: unit.prov.includes("Inter")
                          ? "#38BDF8"
                          : unit.prov.includes("Fibex")
                            ? "#34D399"
                            : unit.prov.includes("NetUno")
                              ? "#A78BFA"
                              : unit.prov.includes("360NET")
                                ? "#FBBF24"
                                : "#94A3B8",
                        fontWeight: 800,
                      }}
                    >
                      {unit.prov && unit.prov !== "—"
                        ? unit.prov.length > 12
                          ? unit.prov.slice(0, 10) + "…"
                          : unit.prov
                        : "Sin ISP"}
                    </text>

                    {/* Unit Name (for spacious modules) */}
                    {unit.h >= 65 && unit.w >= 70 && (
                      <text
                        x={unit.x + unit.w / 2}
                        y={unit.y + unit.h - 10}
                        textAnchor="middle"
                        style={{
                          fontSize: 9,
                          fill: "#CBD5E1",
                          fontWeight: 600,
                        }}
                      >
                        {unit.nombre.length > 15
                          ? unit.nombre.slice(0, 13) + "…"
                          : unit.nombre}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Hover Tooltip */}
            {hovUnit && !selectedUnit && (
              <div
                style={{
                  position: "fixed",
                  left: hovPos.x + 14,
                  top: hovPos.y - 80,
                  background: "rgba(15, 23, 42, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${scoreHex[hovUnit.score]}60`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 12,
                  pointerEvents: "none",
                  zIndex: 9999,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                  minWidth: 200,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      color: cyber,
                      fontFamily: "JetBrains Mono, monospace",
                      fontWeight: 700,
                    }}
                  >
                    {hovUnit.id}
                  </span>
                  {badge(hovUnit.score)}
                </div>
                <p style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 13 }}>
                  {hovUnit.nombre}
                </p>
                <p style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>
                  Rubro: {hovUnit.cat}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                    background: "rgba(255,255,255,0.05)",
                    padding: "4px 8px",
                    borderRadius: 6,
                  }}
                >
                  <span style={{ fontSize: 11 }}>🌐</span>
                  <span
                    style={{ color: "#38BDF8", fontSize: 11, fontWeight: 700 }}
                  >
                    ISP: {hovUnit.prov || "Sin Registrar"}
                  </span>
                </div>
                <p
                  style={{
                    color: hovUnit.pago > 0 ? green : "#64748B",
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  {hovUnit.pago > 0
                    ? `Pago actual: $${hovUnit.pago}/mes`
                    : "Sin Facturación Actual"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Unit Quick Edit Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {selectedUnit ? (
            <div
              className="glass-panel animate-in"
              style={{
                borderRadius: 16,
                padding: 20,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <span
                    style={{
                      color: cyber,
                      fontSize: 11,
                      fontFamily: "JetBrains Mono, monospace",
                      fontWeight: 700,
                    }}
                  >
                    LOCAL ID: {selectedUnit.id}
                  </span>
                  <h3
                    style={{
                      color: "#F8FAFC",
                      fontSize: 16,
                      fontWeight: 800,
                      marginTop: 2,
                    }}
                  >
                    Edición Rápida
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    color: "#94A3B8",
                    borderRadius: 6,
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {badge(selectedUnit.score)}
                <span
                  style={{
                    background:
                      selectedUnit.estado === "alquilado"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(245,158,11,0.15)",
                    color: selectedUnit.estado === "alquilado" ? green : amber,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 99,
                  }}
                >
                  {selectedUnit.estado.toUpperCase()}
                </span>
              </div>

              {/* Formulario de Edición Rápida en Vivo */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: "rgba(15,23,42,0.6)",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Nombre Comercial / Empresa
                  </label>
                  <input
                    type="text"
                    value={selectedUnit.nombre}
                    onChange={(e) =>
                      handleUpdateUnitField("nombre", e.target.value)
                    }
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Proveedor de Internet (ISP)
                  </label>
                  <select
                    value={selectedUnit.prov}
                    onChange={(e) =>
                      handleUpdateUnitField("prov", e.target.value)
                    }
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid rgba(0, 163, 255, 0.3)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      color: "#38BDF8",
                      fontSize: 12,
                      fontWeight: 700,
                      outline: "none",
                    }}
                  >
                    <option value="Inter">Inter (Fibra / Cable)</option>
                    <option value="NetUno">NetUno</option>
                    <option value="Fibex">Fibex Telecom</option>
                    <option value="360NET">360NET</option>
                    <option value="SGF Directo">SGF Fibra Directa</option>
                    <option value="Datos Móviles">Datos Móviles</option>
                    <option value="Sin servicio">Sin Servicio / Ninguno</option>
                    <option value="Por Encuestar">Por Encuestar</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Categoría / Rubro
                  </label>
                  <input
                    type="text"
                    value={selectedUnit.cat}
                    onChange={(e) =>
                      handleUpdateUnitField("cat", e.target.value)
                    }
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Facturación Mensual (USD)
                  </label>
                  <input
                    type="number"
                    value={selectedUnit.pago}
                    onChange={(e) =>
                      handleUpdateUnitField(
                        "pago",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      color: green,
                      fontWeight: 700,
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: 11,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Score de Oportunidad
                  </label>
                  <select
                    value={selectedUnit.score}
                    onChange={(e) =>
                      handleUpdateUnitField("score", e.target.value)
                    }
                    style={{
                      width: "100%",
                      background: "#0F172A",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      padding: "7px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  >
                    <option value="A1">A1 - Prioritario</option>
                    <option value="A2">A2 - Alto</option>
                    <option value="B">B - Oportunidad</option>
                    <option value="C">C - Medio</option>
                    <option value="D">D - Bajo</option>
                    <option value="E">E - Vacío / Disponible</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <button
                  onClick={() =>
                    alert(
                      `Local ${selectedUnit.id} actualizado correctamente en memoria.`,
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${brand}, ${cyber})`,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 4px 16px ${brand}40`,
                  }}
                >
                  💾 Guardar Cambios Rápido
                </button>
              </div>
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{
                borderRadius: 16,
                padding: 20,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 32, marginBottom: 10 }}>🗺️</span>
              <p style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 700 }}>
                Explora el Centro Comercial
              </p>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 12,
                  marginTop: 4,
                  maxWidth: 230,
                }}
              >
                Haz clic en cualquier local del plano panorámico para editar de
                inmediato su proveedor de internet, nombre, rubro o pago
                mensual.
              </p>
            </div>
          )}

          {/* Quick Stats Widget */}
          <div className="glass-card" style={{ borderRadius: 16, padding: 16 }}>
            <p
              style={{
                color: "#94A3B8",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Resumen Nivel {activeFloor}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <StatMini
                label="Locales Totales"
                val={`${totalCount}`}
                color={cyber}
              />
              <StatMini
                label="Ocupación"
                val={`${Math.round((rentedCount / (totalCount || 1)) * 100)}%`}
                color={green}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MInput({
  label,
  val,
  full,
}: {
  label: string
  val: string
  full?: boolean
}) {
  return (
    <div style={{ gridColumn: full ? "span 2" : undefined }}>
      <p
        style={{ color: muted, fontSize: 10, fontWeight: 600, marginBottom: 4 }}
      >
        {label}
      </p>
      <div
        style={{
          background: "#fff",
          border: `1.5px solid ${border}`,
          borderRadius: 10,
          padding: "9px 12px",
          fontSize: 13,
          color: ink,
        }}
      >
        {val}
      </div>
    </div>
  )
}

function ProgressItem({
  label,
  val,
  total,
  color,
}: {
  label: string
  val: number
  total: number
  color: string
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <span style={{ color: "#4B5563", fontSize: 10 }}>{label}</span>
        <span style={{ color: "#9CA3AF", fontSize: 10, fontWeight: 600 }}>
          {val}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "#1F2937",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(val / total) * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  )
}

// ─── RESPUESTAS DE ENCUESTAS (HISTORIAL SUPABASE) ───────────────────────────
function SurveysView({
  surveys,
  onRefresh,
  onNavigateToForm,
  onSelectSurvey,
  onEditLocal,
}: {
  surveys: SurveyResponse[]
  onRefresh: () => void
  onNavigateToForm?: () => void
  onSelectSurvey: (s: SurveyResponse) => void
  onEditLocal: (localId: string) => void
}) {
  const [q, setQ] = useState("")

  const filtered = surveys.filter((s) => {
    const query = q.toLowerCase()
    return (
      (s.local_id || "").toLowerCase().includes(query) ||
      (s.nombre_local || "").toLowerCase().includes(query) ||
      (s.contacto_nombre || "").toLowerCase().includes(query) ||
      (s.prov_actual || "").toLowerCase().includes(query)
    )
  })

  return (
    <div
      className="animate-in"
      style={{ padding: "28px 24px", overflowY: "auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <p
            style={{
              color: "#475569",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Base de Datos Supabase
          </p>
          <h1
            style={{
              color: "#F1F5F9",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.02em",
            }}
          >
            Historial de Encuestas Registradas
          </h1>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: "rgba(0, 163, 255, 0.1)",
            border: "1px solid rgba(0, 163, 255, 0.25)",
            color: cyber,
            borderRadius: 10,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🔄</span> Actualizar Datos
        </button>
      </div>

      {/* Bar Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#4B5563",
              fontSize: 13,
            }}
          >
            🔍
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por Local, Nombre o Contacto..."
            style={{
              width: "100%",
              background: "#111827",
              border: "1px solid #1F2937",
              borderRadius: 10,
              padding: "9px 12px 9px 36px",
              color: "#F1F5F9",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: 10,
            padding: "0 16px",
            color: "#94A3B8",
            fontSize: 12,
          }}
        >
          Total Registros en Supabase:{" "}
          <strong style={{ color: green }}>{surveys.length}</strong>
        </div>
      </div>

      {surveys.length === 0 ? (
        <div
          style={{
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: 16,
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <h3
            style={{
              color: "#F8FAFC",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Aún no hay encuestas registradas en Supabase
          </h3>
          <p
            style={{
              color: "#64748B",
              fontSize: 13,
              maxWidth: 460,
              margin: "0 auto 20px",
              lineHeight: 1.5,
            }}
          >
            El censo está en 0. Al llenar respuestas desde el{" "}
            <strong>Formulario Digital de Campo</strong>, se guardarán
            inmediatamente en la tabla <code>survey_responses</code> y
            aparecerán listadas aquí en tiempo real.
          </p>
          <button
            onClick={() => onNavigateToForm && onNavigateToForm()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: `linear-gradient(135deg, ${brand}, ${cyber})`,
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            📝 Llenar Nueva Encuesta
          </button>
        </div>
      ) : (
        <div
          className="table-responsive"
          style={{
            background: "#111827",
            border: "1px solid #1F2937",
            borderRadius: 16,
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #1F2937",
                  background: "#0D1526",
                }}
              >
                {[
                  "Fecha / Hora",
                  "Local ID",
                  "Local / Empresa",
                  "Zona",
                  "Resultado",
                  "Proveedor ISP",
                  "Redes Sociales",
                  "Sistema ERP / Fact.",
                  "Cobros Auto.",
                  "Interés Auto.",
                  "Contacto",
                  "Acción",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#475569",
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const isSuccess = s.visit_result === "Completada"
                const dateStr = s.created_at
                  ? new Date(s.created_at).toLocaleString("es-VE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "Reciente"
                return (
                  <tr
                    key={s.id || i}
                    onClick={() => onSelectSurvey(s)}
                    style={{
                      borderBottom: "1px solid #1F2937",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "background .1s",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#64748B",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dateStr}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <code
                        style={{
                          fontSize: 11,
                          color: cyber,
                          fontWeight: 700,
                          background: "#0D1A36",
                          padding: "2px 8px",
                          borderRadius: 5,
                        }}
                      >
                        {s.local_id}
                      </code>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#F8FAFC",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {s.nombre_local || "Local " + s.local_id}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#94A3B8",
                        fontSize: 12,
                      }}
                    >
                      {s.zona || "—"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: isSuccess ? "#ECFDF5" : "#FFFBEB",
                          color: isSuccess ? "#065F46" : "#92400E",
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {s.visit_result}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#CBD5E1",
                        fontSize: 12,
                      }}
                    >
                      {s.prov_actual || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#38BDF8",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {s.redes_sociales || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#F8FAFC",
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.sistema_facturacion || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#94A3B8",
                        fontSize: 11,
                      }}
                    >
                      {s.pagos_automatizados || "—"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: s.interes_automatizar?.includes("Sí")
                            ? "rgba(16,185,129,0.15)"
                            : s.interes_automatizar?.includes("Tal vez")
                              ? "rgba(245,158,11,0.15)"
                              : "rgba(255,255,255,0.05)",
                          color: s.interes_automatizar?.includes("Sí")
                            ? green
                            : s.interes_automatizar?.includes("Tal vez")
                              ? amber
                              : "#94A3B8",
                          padding: "3px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {s.interes_automatizar || "—"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        color: "#F1F5F9",
                        fontSize: 12,
                      }}
                    >
                      {s.contacto_nombre || "—"}
                    </td>
                    <td
                      style={{ padding: "12px 14px", display: "flex", gap: 6 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSurvey(s)
                        }}
                        style={{
                          background: "rgba(0, 163, 255, 0.12)",
                          border: "none",
                          color: cyber,
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Ver Ficha
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditLocal(s.local_id)
                        }}
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          color: green,
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                        title="Repetir o actualizar encuesta sobre este local"
                      >
                        🔄 Repetir
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
