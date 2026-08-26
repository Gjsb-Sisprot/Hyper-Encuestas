import { useState, useEffect } from "react"
import {
  saveSurveyResponse,
  fetchLeadsFromSupabase,
  fetchSurveysFromSupabase,
  Lead,
} from "./lib/supabase"

const brand = "#0052FF"
const cyber = "#00A3FF"
const ink = "#0F172A"
const slate = "#334155"
const muted = "#94A3B8"
const border = "#E2E8F0"
const green = "#10B981"
const amber = "#F59E0B"
const red = "#EF4444"

type VisitStatus = "Completada" | "Encargado Ausente" | "Cerrado" | "Rechazo" | "Local Vacío"

interface SurveyFormProps {
  onOpenAdmin?: () => void
}

export default function SurveyForm({ onOpenAdmin }: SurveyFormProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dbLocals, setDbLocals] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [pisoFilter, setPisoFilter] = useState("TODOS")

  // Form State
  const [formData, setFormData] = useState({
    localId: "PB04",
    nombreLocal: "Mobile Shop Las Americas",
    zona: "Planta Baja",
    vendedor: "Carlos Ramírez",
    visitResult: "Completada" as VisitStatus,
    motivoNoRealizada: "",
    observacionesVisita: "",

    // Conectividad
    provActual: "Inter",
    velocidad: "50",
    pagoMensual: "45",
    satisfaccion: 3,
    fallas: ["Cortes frecuentes"],
    impacto: "Medio",

    // Redes Sociales & Presencia Digital
    redesSociales: "@mobileshop.ve",
    instagram: "@mobileshop.ve",
    facebook: "",
    tiktok: "",
    whatsappBusiness: "+58 412-555-0198",

    // Sistema de Facturación & ERP / Automatización de Pagos
    sistemaFacturacion: "Saint / Profit Plus",
    pagosAutomatizados: "Parcialmente (Puntos / Pago Móvil)",
    interesAutomatizar: "Sí, totalmente interesado",

    // Contacto
    contactoNombre: "Ana Martínez",
    contactoTel: "+58 412-555-0198",
    contactoEmail: "ana@mobileshop.ve",
    rolDecision: "Propietario / Dueño",
    horarioAtencion: "Lunes a Sábado 9:00 AM - 7:00 PM",
    mejorHorarioVisita: "Martes y Jueves 2:00 PM - 4:00 PM",
    notasCierre:
      "Interesado en prueba piloto de fibra. Evaluar enlace dedicado.",
    canal: "WhatsApp",
  })

  useEffect(() => {
    async function loadLocals() {
      const [leads, surveys] = await Promise.all([
        fetchLeadsFromSupabase(),
        fetchSurveysFromSupabase()
      ])

      if (leads && leads.length > 0) {
        // Identificar los local_ids de encuestas que fueron completadas con éxito
        const completedLocalIds = new Set(
          surveys
            .filter((s) => s.visit_result === "Completada")
            .map((s) => s.local_id)
        )

        // Filtrar locales para que desaparezcan de la lista pública si ya fueron encuestados exitosamente
        const pendingLocals = leads.filter((l) => !completedLocalIds.has(l.id))

        const listToUse = pendingLocals.length > 0 ? pendingLocals : leads
        setDbLocals(listToUse)

        if (listToUse[0]) {
          setFormData((prev) => ({
            ...prev,
            localId: listToUse[0].id,
            nombreLocal: listToUse[0].nombre,
            zona: listToUse[0].zona,
            provActual:
              listToUse[0].prov !== "Por Encuestar" ? listToUse[0].prov : "Inter",
            pagoMensual: listToUse[0].pago
              ? String(listToUse[0].pago)
              : prev.pagoMensual,
          }))
        }
      }
    }
    loadLocals()
  }, [])

  // Dynamic steps depending on visit result
  const isVisitSuccessful = formData.visitResult === "Completada"

  const steps = isVisitSuccessful
    ? [
        "1. Ubicación & Estado",
        "2. Conectividad & Redes",
        "3. Facturación & ERP",
        "4. Decisor & Cierre",
      ]
    : ["1. Ubicación & Estado", "2. Reporte de Incidencia & Cierre"]

  const validateStep = () => {
    const errs: Record<string, string> = {}
    if (step === 0) {
      if (!formData.localId) errs.localId = "Debes seleccionar un local"
      if (!formData.visitResult)
        errs.visitResult = "Indica el resultado de la visita"
    } else if (step === 1 && !isVisitSuccessful) {
      if (!formData.motivoNoRealizada)
        errs.motivoNoRealizada = "Especifica el motivo de la incidencia"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supabaseMessage, setSupabaseMessage] = useState("")

  const handleNext = async () => {
    if (!validateStep()) return

    if (step < steps.length - 1) {
      setStep((s) => s + 1)
    } else {
      setIsSubmitting(true)
      const res = await saveSurveyResponse({
        local_id: formData.localId,
        nombre_local: formData.nombreLocal,
        zona: formData.zona,
        vendedor: formData.vendedor,
        visit_result: formData.visitResult,
        motivo_no_realizada: formData.motivoNoRealizada,
        observaciones_visita: formData.observacionesVisita,
        prov_actual: formData.provActual,
        velocidad: formData.velocidad,
        pago_mensual: formData.pagoMensual,
        satisfaccion: formData.satisfaccion,
        fallas: formData.fallas,
        impacto: formData.impacto,
        redes_sociales: [
          formData.instagram ? `IG: ${formData.instagram}` : "",
          formData.facebook ? `FB: ${formData.facebook}` : "",
          formData.tiktok ? `TK: ${formData.tiktok}` : "",
          formData.whatsappBusiness ? `WA: ${formData.whatsappBusiness}` : "",
          formData.redesSociales ? formData.redesSociales : "",
        ]
          .filter(Boolean)
          .join(" | "),
        sistema_facturacion: formData.sistemaFacturacion,
        pagos_automatizados: formData.pagosAutomatizados,
        interes_automatizar: formData.interesAutomatizar,
        contacto_nombre: formData.contactoNombre,
        contacto_tel: formData.contactoTel,
        contacto_email: formData.contactoEmail,
        rol_decision: formData.rolDecision,
        horario_atencion: formData.horarioAtencion,
        mejor_horario_visita: formData.mejorHorarioVisita,
        notas_cierre: formData.notasCierre,
        canal: formData.canal,
      })

      setIsSubmitting(false)
      if (res.success) {
        setSupabaseMessage(
          "Sincronizado exitosamente en la base de datos Supabase",
        )
      } else {
        setSupabaseMessage(
          "Guardado localmente (Supabase: " +
            (res.error || "Modo offline") +
            ")",
        )
      }
      setSubmitted(true)
    }
  }

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const faultOpts = [
    "Cortes frecuentes de servicio",
    "Lentitud crítica en horas pico",
    "Soporte técnico deficiente / lento",
    "Velocidad real inferior a la contratada",
    "Facturación incorrecta / cobros indebidos",
  ]

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#060913",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}
      >
        <div
          className="glass-card animate-in"
          style={{
            maxWidth: 520,
            width: "100%",
            padding: 40,
            borderRadius: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: isVisitSuccessful ? `${green}20` : `${amber}20`,
              border: `2px solid ${isVisitSuccessful ? green : amber}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <span
              style={{ color: isVisitSuccessful ? green : amber, fontSize: 28 }}
            >
              {isVisitSuccessful ? "✓" : "⚠️"}
            </span>
          </div>

          <h2
            style={{
              color: "#F8FAFC",
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            {isVisitSuccessful
              ? "¡Encuesta Comercial Registrada!"
              : "¡Novedad de Visita Registrada!"}
          </h2>

          <p
            style={{
              color: "#94A3B8",
              fontSize: 14,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {isVisitSuccessful ? (
              <>
                Los datos del local{" "}
                <strong style={{ color: cyber }}>
                  {formData.nombreLocal} ({formData.localId})
                </strong>{" "}
                fueron sincronizados con el CRM SGF en tiempo real.
              </>
            ) : (
              <>
                Se ha generado una alerta para el local{" "}
                <strong style={{ color: amber }}>
                  {formData.nombreLocal} ({formData.localId})
                </strong>{" "}
                con estado: <strong>{formData.visitResult}</strong>.
              </>
            )}
          </p>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: 16,
              padding: 18,
              textAlign: "left",
              marginBottom: 24,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#64748B", fontSize: 12 }}>
                Estatus Registro
              </span>
              <span
                style={{
                  color: isVisitSuccessful ? green : amber,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {formData.visitResult.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#64748B", fontSize: 12 }}>
                Ubicación Piso
              </span>
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}>
                {formData.zona}
              </span>
            </div>

            {isVisitSuccessful ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "#64748B", fontSize: 12 }}>
                    ISP Reemplazado
                  </span>
                  <span
                    style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 600 }}
                  >
                    {formData.provActual}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#64748B", fontSize: 12 }}>
                    Plan Recomendado SGF
                  </span>
                  <span style={{ color: green, fontSize: 12, fontWeight: 700 }}>
                    {formData.provActual !== "Sin servicio"
                      ? "Fibra PYME SGF 300 Mbps"
                      : "Fibra Dedicada SGF"}
                  </span>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B", fontSize: 12 }}>
                  Acción Agendada
                </span>
                <span style={{ color: amber, fontSize: 12, fontWeight: 600 }}>
                  Re-visita Programada
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                setSubmitted(false)
                setStep(0)
              }}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: `linear-gradient(135deg, ${brand}, ${cyber})`,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ➕ Registrar Otro Local
            </button>
            <a
              href="/"
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              📊 Ir al Dashboard SGF
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060913",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 16px 40px",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* Brand Header */}
      <header
        style={{
          maxWidth: 640,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brand}, ${cyber})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${brand}60`,
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>
              S
            </span>
          </div>
          <div>
            <h1
              style={{
                color: "#F8FAFC",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-.01em",
              }}
            >
              HYPER ENCUESTAS SGF
            </h1>
            <p style={{ color: "#64748B", fontSize: 11 }}>
              Formulario Digital de Campo · Censo C.C. Hiper Jumbo
            </p>
          </div>
        </div>

        <button
          onClick={
            onOpenAdmin
              ? onOpenAdmin
              : () => {
                  window.location.href = "/admin"
                }
          }
          style={{
            background: "rgba(0, 163, 255, 0.1)",
            border: "1px solid rgba(0, 163, 255, 0.25)",
            borderRadius: 10,
            padding: "8px 14px",
            color: cyber,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🔐</span> Acceso Admin SGF
        </button>
      </header>

      {/* Main Container */}
      <div
        className="glass-panel animate-in"
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 20,
          padding: "24px 20px",
          position: "relative",
        }}
      >
        {/* Stepper Navigation */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                color: cyber,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: ".05em",
              }}
            >
              PASO {step + 1} DE {steps.length}
            </span>
            <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 700 }}>
              {steps[step]}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              height: 6,
              borderRadius: 3,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.08)",
            }}
          >
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background:
                    i <= step
                      ? `linear-gradient(90deg, ${brand}, ${cyber})`
                      : "transparent",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Ubicación & Resultado Visita */}
        {step === 0 && (
          <div
            className="animate-in"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <label
                  style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                >
                  Selecciona el Local Comercial (
                  {dbLocals.length > 0
                    ? dbLocals.length + " locales disponibles"
                    : "Cargando censo..."}
                  )
                </label>
              </div>

              {/* Filtros rápidos por Piso */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                {[
                  "TODOS",
                  "PLANTA BAJA",
                  "PLANTA ALTA",
                  "FERIA DE COMIDA",
                  "SOTANO",
                ].map((piso) => (
                  <button
                    key={piso}
                    type="button"
                    onClick={() => setPisoFilter(piso)}
                    style={{
                      background:
                        pisoFilter === piso
                          ? `linear-gradient(135deg, ${brand}, ${cyber})`
                          : "rgba(255, 255, 255, 0.06)",
                      border:
                        pisoFilter === piso
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      color: pisoFilter === piso ? "#fff" : "#94A3B8",
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {piso}
                  </button>
                ))}
              </div>

              {/* Buscador de Locales */}
              <div style={{ position: "relative", marginBottom: 10 }}>
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748B",
                    fontSize: 13,
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe ID o Nombre (ej: PB04, Casino, Express, PA50)..."
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(0, 163, 255, 0.25)",
                    borderRadius: 10,
                    padding: "10px 12px 10px 36px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Selector principal */}
              <select
                value={formData.localId}
                onChange={(e) => {
                  const val = e.target.value
                  const found = dbLocals.find((l) => l.id === val)
                  if (found) {
                    setFormData({
                      ...formData,
                      localId: found.id,
                      nombreLocal: found.nombre,
                      zona: found.zona,
                      provActual:
                        found.prov !== "Por Encuestar"
                          ? found.prov
                          : formData.provActual,
                      pagoMensual: found.pago
                        ? String(found.pago)
                        : formData.pagoMensual,
                    })
                  } else {
                    setFormData({ ...formData, localId: val })
                  }
                }}
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  color: "#F8FAFC",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                {dbLocals
                  .filter((l) => {
                    const matchPiso =
                      pisoFilter === "TODOS" ||
                      l.zona.toUpperCase().includes(pisoFilter.toUpperCase())
                    const q = searchQuery.toLowerCase()
                    const matchQuery =
                      !q ||
                      l.id.toLowerCase().includes(q) ||
                      l.nombre.toLowerCase().includes(q) ||
                      l.cat.toLowerCase().includes(q)
                    return matchPiso && matchQuery
                  })
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      [{l.id}] {l.nombre} — {l.zona} ({l.cat})
                    </option>
                  ))}
              </select>
            </div>

            {/* Resultado de la Visita */}
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                ¿Cuál fue el resultado de la visita?
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 10,
                }}
              >
                {[
                  {
                    val: "Completada",
                    icon: "✅",
                    label: "Visita Exitosa (Con Encuesta)",
                    color: green,
                  },
                  {
                    val: "Encargado Ausente",
                    icon: "👤",
                    label: "Encargado Ausente",
                    color: amber,
                  },
                  {
                    val: "Cerrado",
                    icon: "🔒",
                    label: "Local Cerrado Temporalmente",
                    color: amber,
                  },
                  {
                    val: "Rechazo",
                    icon: "🚫",
                    label: "Rechazo / No Interesado",
                    color: red,
                  },
                  {
                    val: "Local Vacío",
                    icon: "📭",
                    label: "Local Desocupado / En Alquiler",
                    color: "#64748B",
                  },
                ].map((item) => {
                  const isSel = formData.visitResult === item.val
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          visitResult: item.val as VisitStatus,
                        })
                      }
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: `1.5px solid ${
                          isSel ? item.color : "rgba(255, 255, 255, 0.08)"
                        }`,
                        background: isSel
                          ? `${item.color}20`
                          : "rgba(15, 23, 42, 0.6)",
                        color: isSel ? item.color : "#94A3B8",
                        fontSize: 12,
                        fontWeight: isSel ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 (Si la visita NO fue exitosa): Incidencia / Motivo */}
        {!isVisitSuccessful && step === 1 && (
          <div
            className="animate-in"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <p
                style={{
                  color: amber,
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                ⚠️ Visita marcada como: {formData.visitResult}
              </p>
              <p style={{ color: "#94A3B8", fontSize: 12 }}>
                La encuesta detallada de conectividad se omitirá. Completa el
                reporte de incidencia para el seguimiento comercial.
              </p>
            </div>

            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Motivo / Detalle de la Novedad *
              </label>
              <select
                value={formData.motivoNoRealizada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    motivoNoRealizada: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: `1px solid ${
                    errors.motivoNoRealizada ? red : "rgba(255, 255, 255, 0.12)"
                  }`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  color: "#F8FAFC",
                  fontSize: 13,
                  outline: "none",
                }}
              >
                <option value="">-- Selecciona el motivo principal --</option>
                <option value="dueno_ausente">
                  Dueño / Gerente no se encontraba en el sitio
                </option>
                <option value="horario_cierre">
                  Local cerrado en horario de visita
                </option>
                <option value="contrato_vigente">
                  Cliente satisfecho con contrato de permanencia activa
                </option>
                <option value="sin_interes">
                  No tienen interés en evaluar cambio de proveedor
                </option>
                <option value="desocupado">
                  Local en remodelación o desocupado
                </option>
              </select>
              {errors.motivoNoRealizada && (
                <p style={{ color: red, fontSize: 11, marginTop: 4 }}>
                  {errors.motivoNoRealizada}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Observaciones Adicionales para el Asesor
              </label>
              <textarea
                rows={3}
                value={formData.observacionesVisita}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observacionesVisita: e.target.value,
                  })
                }
                placeholder="Ejemplo: Regresar mañana después de las 3:00 PM cuando esté el dueño..."
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  color: "#F8FAFC",
                  fontSize: 13,
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 2 (Si la visita fue exitosa): Conectividad Actual & Redes Sociales */}
        {isVisitSuccessful && step === 1 && (
          <div
            className="animate-in"
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Proveedor Actual de Internet
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  "Inter",
                  "NetUno",
                  "Fibex",
                  "360NET",
                  "Datos Móviles",
                  "Sin Servicio",
                ].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, provActual: p })}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 99,
                      border: `1.5px solid ${
                        formData.provActual === p
                          ? cyber
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      background:
                        formData.provActual === p
                          ? `${cyber}20`
                          : "rgba(15, 23, 42, 0.6)",
                      color: formData.provActual === p ? cyber : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuántos Megas y Cuánto Paga */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  ⚡ ¿Cuántos Megas (Mbps) tiene contratados?
                </label>
                <input
                  type="number"
                  value={formData.velocidad}
                  onChange={(e) =>
                    setFormData({ ...formData, velocidad: e.target.value })
                  }
                  placeholder="Ej: 50, 100, 300"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  💵 ¿Cuánto paga al mes ($ USD)?
                </label>
                <input
                  type="number"
                  value={formData.pagoMensual}
                  onChange={(e) =>
                    setFormData({ ...formData, pagoMensual: e.target.value })
                  }
                  placeholder="Ej: 35, 50, 120"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: green,
                    fontWeight: 700,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Redes Sociales Múltiples */}
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                🌐 Redes Sociales y Presencia Digital del Negocio
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    📸 Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram: e.target.value })
                    }
                    placeholder="@usuario_ig"
                    style={{
                      width: "100%",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    📱 WhatsApp Business
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappBusiness}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappBusiness: e.target.value,
                      })
                    }
                    placeholder="+58 4XX-XXXXXXX"
                    style={{
                      width: "100%",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    📘 Facebook / FanPage
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) =>
                      setFormData({ ...formData, facebook: e.target.value })
                    }
                    placeholder="facebook.com/pagina"
                    style={{
                      width: "100%",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#64748B",
                      fontSize: 11,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    🎵 TikTok / Sitio Web
                  </label>
                  <input
                    type="text"
                    value={formData.tiktok}
                    onChange={(e) =>
                      setFormData({ ...formData, tiktok: e.target.value })
                    }
                    placeholder="@tiktok / web.com"
                    style={{
                      width: "100%",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: "#F8FAFC",
                      fontSize: 12,
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Fallas Frecuentes Reportadas por el Cliente
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {faultOpts.map((f) => {
                  const hasFault = formData.fallas.includes(f)
                  return (
                    <label
                      key={f}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          fallas: hasFault
                            ? formData.fallas.filter((x) => x !== f)
                            : [...formData.fallas, f],
                        })
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 10,
                        background: hasFault
                          ? "rgba(239, 68, 68, 0.12)"
                          : "rgba(15, 23, 42, 0.6)",
                        border: `1px solid ${
                          hasFault ? red : "rgba(255, 255, 255, 0.08)"
                        }`,
                        color: hasFault ? red : "#94A3B8",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <span>{hasFault ? "☑" : "☐"}</span> {f}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 (Visita exitosa): Sistema de Facturación / ERP & Automatización de Pagos */}
        {isVisitSuccessful && step === 2 && (
          <div
            className="animate-in"
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                💼 ¿Qué Sistema de Facturación / ERP utiliza el negocio?
              </label>
              <input
                type="text"
                value={formData.sistemaFacturacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sistemaFacturacion: e.target.value,
                  })
                }
                placeholder="Ejemplo: Saint, Profit Plus, A2, Valery, Sistema Propio, Ninguno..."
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#F8FAFC",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                💳 ¿Sus cobros y pagos actualmente están automatizados?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Sí, 100% automatizados (Pasarela / Conciliación automática)",
                  "Parcialmente (Puntos de Venta / Pago Móvil manual)",
                  "No, todo se procesa de forma manual",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, pagosAutomatizados: opt })
                    }
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${
                        formData.pagosAutomatizados === opt
                          ? cyber
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      background:
                        formData.pagosAutomatizados === opt
                          ? `${cyber}20`
                          : "rgba(15, 23, 42, 0.6)",
                      color:
                        formData.pagosAutomatizados === opt ? cyber : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                ⚡ ¿Les interesaría que sus cobros y pagos se automatizaran
                totalmente?
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {[
                  {
                    label: "Sí, Interesado",
                    val: "Sí, totalmente interesado",
                    color: green,
                  },
                  {
                    label: "Tal vez",
                    val: "Tal vez / Evaluar propuesta",
                    color: amber,
                  },
                  { label: "No por ahora", val: "No por ahora", color: red },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, interesAutomatizar: opt.val })
                    }
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${
                        formData.interesAutomatizar === opt.val
                          ? opt.color
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      background:
                        formData.interesAutomatizar === opt.val
                          ? `${opt.color}20`
                          : "rgba(15, 23, 42, 0.6)",
                      color:
                        formData.interesAutomatizar === opt.val
                          ? opt.color
                          : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 (Visita exitosa): Decisor, Horarios & Cierre Comercial */}
        {isVisitSuccessful && step === 3 && (
          <div
            className="animate-in"
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Decisor & Rol de Decisión */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  👤 Nombre del Decisor / Encargado
                </label>
                <input
                  value={formData.contactoNombre}
                  onChange={(e) =>
                    setFormData({ ...formData, contactoNombre: e.target.value })
                  }
                  placeholder="Ej: Ana Martínez (Gerente / Dueño)"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  👑 Rol en la Toma de Decisión
                </label>
                <select
                  value={formData.rolDecision}
                  onChange={(e) =>
                    setFormData({ ...formData, rolDecision: e.target.value })
                  }
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: cyber,
                    fontWeight: 700,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="Propietario / Dueño">
                    Propietario / Dueño Directo
                  </option>
                  <option value="Gerente General">
                    Gerente General / Administrador
                  </option>
                  <option value="Jefe de Sistemas / IT">
                    Jefe de Sistemas / IT
                  </option>
                  <option value="Encargado de Turno">
                    Encargado de Turno (Sin firma)
                  </option>
                  <option value="Socio Operativo">Socio Operativo</option>
                </select>
              </div>
            </div>

            {/* Teléfono & Email de Contacto Directo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  📱 Teléfono Directo / WhatsApp
                </label>
                <input
                  value={formData.contactoTel}
                  onChange={(e) =>
                    setFormData({ ...formData, contactoTel: e.target.value })
                  }
                  placeholder="+58 412-555-0198"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  ✉️ Correo Electrónico Corporativo
                </label>
                <input
                  type="email"
                  value={formData.contactoEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactoEmail: e.target.value })
                  }
                  placeholder="gerencia@empresa.com"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Horarios Operativos & Ventana Ideal de Visita */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  ⏰ Horario de Atención del Local
                </label>
                <input
                  type="text"
                  value={formData.horarioAtencion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      horarioAtencion: e.target.value,
                    })
                  }
                  placeholder="Ej: Lunes a Sábado 9:00 AM - 7:00 PM"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  📅 Mejor Momento / Día para Contactar o Visitar
                </label>
                <input
                  type="text"
                  value={formData.mejorHorarioVisita || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mejorHorarioVisita: e.target.value,
                    })
                  }
                  placeholder="Ej: Martes y Jueves 2:00 PM - 4:00 PM"
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: amber,
                    fontWeight: 600,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Canal Preferido de Contacto */}
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                🚀 Canal Preferido de Seguimiento Comercial
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                }}
              >
                {[
                  { label: "💬 WhatsApp Directo", val: "WhatsApp" },
                  { label: "📞 Llamada Telefónica", val: "Llamada" },
                  {
                    label: "🤝 Visita Presencial Asesor",
                    val: "Visita Presencial",
                  },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    onClick={() => setFormData({ ...formData, canal: c.val })}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${
                        formData.canal === c.val
                          ? green
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      background:
                        formData.canal === c.val
                          ? `${green}20`
                          : "rgba(15, 23, 42, 0.6)",
                      color: formData.canal === c.val ? green : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas Estratégicas para el Asesor Comercial */}
            <div>
              <label
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                📝 Notas Estratégicas de Cierre / Observaciones para el Asesor
              </label>
              <textarea
                rows={2}
                value={formData.notasCierre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notasCierre: e.target.value })
                }
                placeholder="Ejemplo: Requiere demostración de velocidad en horas pico. Se le vence contrato actual en 15 días..."
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#F8FAFC",
                  fontSize: 12,
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {step > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              style={{
                flex: 1,
                padding: 13,
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(15, 23, 42, 0.8)",
                color: "#F8FAFC",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Anterior
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            style={{
              flex: 2,
              padding: 13,
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg, ${
                step === steps.length - 1
                  ? isVisitSuccessful
                    ? green
                    : amber
                  : brand
              }, ${
                step === steps.length - 1
                  ? isVisitSuccessful
                    ? "#059669"
                    : "#D97706"
                  : cyber
              })`,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${brand}40`,
            }}
          >
            {step === steps.length - 1
              ? isVisitSuccessful
                ? "✅ Guardar Encuesta"
                : "⚠️ Guardar Incidencia"
              : "Siguiente Paso →"}
          </button>
        </div>
      </div>
    </div>
  )
}
