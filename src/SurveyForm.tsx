import { useState } from 'react'
import { saveSurveyResponse } from './lib/supabase'

const brand = '#0052FF'
const cyber = '#00A3FF'
const ink = '#0F172A'
const slate = '#334155'
const muted = '#94A3B8'
const border = '#E2E8F0'
const green = '#10B981'
const amber = '#F59E0B'
const red = '#EF4444'

type VisitStatus = 'Completada' | 'Encargado Ausente' | 'Cerrado' | 'Rechazo' | 'Local Vacío'

interface SurveyFormProps {
  onOpenAdmin?: () => void
}

export default function SurveyForm({ onOpenAdmin }: SurveyFormProps) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State
  const [formData, setFormData] = useState({
    localId: 'PB-04',
    nombreLocal: 'Mobile Shop Las Americas',
    zona: 'Planta Baja',
    vendedor: 'Carlos Ramírez',
    visitResult: 'Completada' as VisitStatus,
    motivoNoRealizada: '',
    observacionesVisita: '',
    
    // Conectividad
    provActual: 'Inter',
    velocidad: '50',
    pagoMensual: '45',
    verificadoFactura: true,
    satisfaccion: 2,
    fallas: ['Cortes frecuentes', 'Lentitud en hora pico'],
    impacto: 'Alto',
    
    // Propuesta
    planSGF: 'PYME 300 Mbps ($44.83/mes)',

    // Contacto
    contactoNombre: 'Ana Martínez',
    contactoTel: '+58 412-555-0198',
    contactoEmail: 'ana@mobileshop.ve',
    rolDecision: 'Decisor Directo',
    canal: 'WhatsApp'
  })

  // Dynamic steps depending on visit result
  const isVisitSuccessful = formData.visitResult === 'Completada'

  const steps = isVisitSuccessful
    ? ['1. Ubicación & Estado', '2. Conectividad Actual', '3. Oferta SGF', '4. Decisor & Cierre']
    : ['1. Ubicación & Estado', '2. Reporte de Incidencia & Cierre']

  const validateStep = () => {
    const errs: Record<string, string> = {}
    if (step === 0) {
      if (!formData.localId) errs.localId = 'Debes seleccionar un local'
      if (!formData.visitResult) errs.visitResult = 'Indica el resultado de la visita'
    } else if (step === 1 && !isVisitSuccessful) {
      if (!formData.motivoNoRealizada) errs.motivoNoRealizada = 'Especifica el motivo de la incidencia'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supabaseMessage, setSupabaseMessage] = useState('')

  const handleNext = async () => {
    if (!validateStep()) return

    if (step < steps.length - 1) {
      setStep(s => s + 1)
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
        verificado_factura: formData.verificadoFactura,
        satisfaccion: formData.satisfaccion,
        fallas: formData.fallas,
        impacto: formData.impacto,
        plan_sgf: formData.planSGF,
        contacto_nombre: formData.contactoNombre,
        contacto_tel: formData.contactoTel,
        contacto_email: formData.contactoEmail,
        rol_decision: formData.rolDecision,
        canal: formData.canal
      })

      setIsSubmitting(false)
      if (res.success) {
        setSupabaseMessage('Sincronizado exitosamente en la base de datos Supabase')
      } else {
        setSupabaseMessage('Guardado localmente (Supabase: ' + (res.error || 'Modo offline') + ')')
      }
      setSubmitted(true)
    }
  }

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const faultOpts = [
    'Cortes frecuentes de servicio',
    'Lentitud crítica en horas pico',
    'Soporte técnico deficiente / lento',
    'Velocidad real inferior a la contratada',
    'Facturación incorrecta / cobros indebidos'
  ]

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#060913', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div className="glass-card animate-in" style={{ maxWidth: 520, width: '100%', padding: 40, borderRadius: 24, textAlign: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isVisitSuccessful ? `${green}20` : `${amber}20`,
            border: `2px solid ${isVisitSuccessful ? green : amber}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <span style={{ color: isVisitSuccessful ? green : amber, fontSize: 28 }}>
              {isVisitSuccessful ? '✓' : '⚠️'}
            </span>
          </div>

          <h2 style={{ color: '#F8FAFC', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {isVisitSuccessful ? '¡Encuesta Comercial Registrada!' : '¡Novedad de Visita Registrada!'}
          </h2>

          <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            {isVisitSuccessful ? (
              <>Los datos del local <strong style={{ color: cyber }}>{formData.nombreLocal} ({formData.localId})</strong> fueron sincronizados con el CRM SGF en tiempo real.</>
            ) : (
              <>Se ha generado una alerta para el local <strong style={{ color: amber }}>{formData.nombreLocal} ({formData.localId})</strong> con estado: <strong>{formData.visitResult}</strong>.</>
            )}
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 16, padding: 18, textAlign: 'left', marginBottom: 24, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748B', fontSize: 12 }}>Estatus Registro</span>
              <span style={{ color: isVisitSuccessful ? green : amber, fontSize: 12, fontWeight: 700 }}>
                {formData.visitResult.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#64748B', fontSize: 12 }}>Ubicación Piso</span>
              <span style={{ color: '#F8FAFC', fontSize: 12, fontWeight: 600 }}>{formData.zona}</span>
            </div>

            {isVisitSuccessful ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#64748B', fontSize: 12 }}>ISP Reemplazado</span>
                  <span style={{ color: '#F8FAFC', fontSize: 12, fontWeight: 600 }}>{formData.provActual}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontSize: 12 }}>Plan Recomendado SGF</span>
                  <span style={{ color: green, fontSize: 12, fontWeight: 700 }}>{formData.planSGF}</span>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontSize: 12 }}>Acción Agendada</span>
                <span style={{ color: amber, fontSize: 12, fontWeight: 600 }}>Re-visita Programada</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => { setSubmitted(false); setStep(0) }}
              style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${brand}, ${cyber})`, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
            >
              ➕ Registrar Otro Local
            </button>
            <a
              href="/"
              style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#F8FAFC', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
            >
              📊 Ir al Dashboard SGF
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060913', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Brand Header */}
      <header style={{ maxWidth: 640, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${brand}, ${cyber})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${brand}60` }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>S</span>
          </div>
          <div>
            <h1 style={{ color: '#F8FAFC', fontSize: 16, fontWeight: 800, letterSpacing: '-.01em' }}>SISPROT GLOBAL FIBER</h1>
            <p style={{ color: '#64748B', fontSize: 11 }}>Formulario Digital de Campo · Censo C.C. Hiper Jumbo 2026</p>
          </div>
        </div>

        <button
          onClick={onOpenAdmin ? onOpenAdmin : () => { window.location.href = '/admin' }}
          style={{
            background: 'rgba(0, 163, 255, 0.1)',
            border: '1px solid rgba(0, 163, 255, 0.25)',
            borderRadius: 10,
            padding: '8px 14px',
            color: cyber,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span>🔐</span> Acceso Admin SGF
        </button>
      </header>

      {/* Main Container */}
      <div className="glass-panel animate-in" style={{ maxWidth: 640, width: '100%', borderRadius: 24, padding: 32, position: 'relative' }}>
        
        {/* Stepper Navigation */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: cyber, fontSize: 12, fontWeight: 700, letterSpacing: '.05em' }}>
              PASO {step + 1} DE {steps.length}
            </span>
            <span style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 700 }}>
              {steps[step]}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, height: 6, borderRadius: 3, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.08)' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i <= step ? `linear-gradient(90deg, ${brand}, ${cyber})` : 'transparent',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Ubicación & Resultado Visita */}
        {step === 0 && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Selecciona el Local Comercial
              </label>
              <select
                value={formData.localId}
                onChange={e => {
                  const val = e.target.value
                  const names: Record<string, [string, string]> = {
                    'PB-04': ['Mobile Shop Las Americas', 'Planta Baja'],
                    'PA-50': ['Casino Platinum VIP', 'Planta Alta'],
                    'PA-04': ['Hyper Mercado Modelo', 'Planta Alta'],
                    'SOT-36': ['Hyper Gym Fitness', 'Sótano'],
                    'PA-07': ['TU PUNTO SHOP Electronic', 'Planta Alta'],
                    'PA-09': ['Farmacia Malanga', 'Planta Alta']
                  }
                  const [nombre, zona] = names[val] || ['Local Comercial', 'Planta Baja']
                  setFormData({ ...formData, localId: val, nombreLocal: nombre, zona })
                }}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#F8FAFC',
                  fontSize: 14,
                  outline: 'none'
                }}
              >
                <option value="PB-04">PB-04 — Mobile Shop Las Americas (Planta Baja)</option>
                <option value="PA-50">PA-50 — Casino Platinum VIP (Planta Alta)</option>
                <option value="PA-04">PA-04 — Hyper Mercado Modelo (Planta Alta)</option>
                <option value="SOT-36">SOT-36 — Hyper Gym Fitness (Sótano)</option>
                <option value="PA-07">PA-07 — TU PUNTO SHOP Electronic (Planta Alta)</option>
                <option value="PA-09">PA-09 — Farmacia Malanga (Planta Alta)</option>
              </select>
            </div>

            {/* Resultado de la Visita */}
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                ¿Cuál fue el resultado de la visita?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { val: 'Completada', icon: '✅', label: 'Visita Exitosa (Con Encuesta)', color: green },
                  { val: 'Encargado Ausente', icon: '👤', label: 'Encargado Ausente', color: amber },
                  { val: 'Cerrado', icon: '🔒', label: 'Local Cerrado Temporalmente', color: amber },
                  { val: 'Rechazo', icon: '🚫', label: 'Rechazo / No Interesado', color: red },
                  { val: 'Local Vacío', icon: '📭', label: 'Local Desocupado / En Alquiler', color: '#64748B' },
                ].map(item => {
                  const isSel = formData.visitResult === item.val
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setFormData({ ...formData, visitResult: item.val as VisitStatus })}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: `1.5px solid ${isSel ? item.color : 'rgba(255, 255, 255, 0.08)'}`,
                        background: isSel ? `${item.color}20` : 'rgba(15, 23, 42, 0.6)',
                        color: isSel ? item.color : '#94A3B8',
                        fontSize: 12,
                        fontWeight: isSel ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
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
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 14, padding: 16 }}>
              <p style={{ color: amber, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                ⚠️ Visita marcada como: {formData.visitResult}
              </p>
              <p style={{ color: '#94A3B8', fontSize: 12 }}>
                La encuesta detallada de conectividad se omitirá. Completa el reporte de incidencia para el seguimiento comercial.
              </p>
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Motivo / Detalle de la Novedad *
              </label>
              <select
                value={formData.motivoNoRealizada}
                onChange={e => setFormData({ ...formData, motivoNoRealizada: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${errors.motivoNoRealizada ? red : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#F8FAFC',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="">-- Selecciona el motivo principal --</option>
                <option value="dueno_ausente">Dueño / Gerente no se encontraba en el sitio</option>
                <option value="horario_cierre">Local cerrado en horario de visita</option>
                <option value="contrato_vigente">Cliente satisfecho con contrato de permanencia activa</option>
                <option value="sin_interes">No tienen interés en evaluar cambio de proveedor</option>
                <option value="desocupado">Local en remodelación o desocupado</option>
              </select>
              {errors.motivoNoRealizada && <p style={{ color: red, fontSize: 11, marginTop: 4 }}>{errors.motivoNoRealizada}</p>}
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Observaciones Adicionales para el Asesor
              </label>
              <textarea
                rows={3}
                value={formData.observacionesVisita}
                onChange={e => setFormData({ ...formData, observacionesVisita: e.target.value })}
                placeholder="Ejemplo: Regresar mañana después de las 3:00 PM cuando esté el dueño..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#F8FAFC',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 2 (Si la visita fue exitosa): Conectividad Actual */}
        {isVisitSuccessful && step === 1 && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Proveedor Actual de Internet
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Inter', 'NetUno', 'Fibex', '360NET', 'Datos Móviles', 'Sin Servicio'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, provActual: p })}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 99,
                      border: `1.5px solid ${formData.provActual === p ? cyber : 'rgba(255, 255, 255, 0.1)'}`,
                      background: formData.provActual === p ? `${cyber}20` : 'rgba(15, 23, 42, 0.6)',
                      color: formData.provActual === p ? cyber : '#94A3B8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Velocidad Declarada (Mbps)
                </label>
                <input
                  type="number"
                  value={formData.velocidad}
                  onChange={e => setFormData({ ...formData, velocidad: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#F8FAFC',
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Pago Mensual Estimado ($ USD)
                </label>
                <input
                  type="number"
                  value={formData.pagoMensual}
                  onChange={e => setFormData({ ...formData, pagoMensual: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#F8FAFC',
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Fallas Frecuentes Reportadas por el Cliente
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {faultOpts.map(f => {
                  const hasFault = formData.fallas.includes(f)
                  return (
                    <label
                      key={f}
                      onClick={() => setFormData({
                        ...formData,
                        fallas: hasFault ? formData.fallas.filter(x => x !== f) : [...formData.fallas, f]
                      })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: hasFault ? 'rgba(239, 68, 68, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        border: `1px solid ${hasFault ? red : 'rgba(255, 255, 255, 0.08)'}`,
                        color: hasFault ? red : '#94A3B8',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      <span>{hasFault ? '☑' : '☐'}</span> {f}
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 (Visita exitosa): Plan SGF */}
        {isVisitSuccessful && step === 2 && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 10 }}>
                Selecciona el Plan Sugerido para la Cotización
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { plan: 'PYME 100 Mbps ($32.67/mes)', desc: '100 Mbps ↓ / 50 Mbps ↑ · Ideal para cobro por punto de venta' },
                  { plan: 'PYME 300 Mbps ($44.83/mes)', desc: '300 Mbps ↓ / 150 Mbps ↑ · Plan Recomendado Anclas & Tiendas' },
                  { plan: 'Empresarial 600 Mbps ($77.96/mes)', desc: '600 Mbps ↓ / 300 Mbps ↑ · Alta demanda / Casino & Supermercado' },
                ].map(item => (
                  <button
                    key={item.plan}
                    type="button"
                    onClick={() => setFormData({ ...formData, planSGF: item.plan })}
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      border: `1.5px solid ${formData.planSGF === item.plan ? brand : 'rgba(255, 255, 255, 0.1)'}`,
                      background: formData.planSGF === item.plan ? `linear-gradient(135deg, ${brand}30, rgba(13,21,38,0.9))` : 'rgba(15, 23, 42, 0.6)',
                      color: '#F8FAFC',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 700, color: formData.planSGF === item.plan ? cyber : '#F8FAFC' }}>{item.plan}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 (Visita exitosa): Contacto & Cierre */}
        {isVisitSuccessful && step === 3 && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Nombre del Decisor / Encargado
                </label>
                <input
                  value={formData.contactoNombre}
                  onChange={e => setFormData({ ...formData, contactoNombre: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#F8FAFC',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Teléfono WhatsApp
                </label>
                <input
                  value={formData.contactoTel}
                  onChange={e => setFormData({ ...formData, contactoTel: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#F8FAFC',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Canal Preferido de Contacto
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {['WhatsApp', 'Llamada', 'Visita Presencial'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, canal: c })}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${formData.canal === c ? green : 'rgba(255, 255, 255, 0.1)'}`,
                      background: formData.canal === c ? `${green}20` : 'rgba(15, 23, 42, 0.6)',
                      color: formData.canal === c ? green : '#94A3B8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons Controls */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {step > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              style={{
                flex: 1,
                padding: 13,
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#F8FAFC',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
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
              border: 'none',
              background: `linear-gradient(135deg, ${step === steps.length - 1 ? (isVisitSuccessful ? green : amber) : brand}, ${step === steps.length - 1 ? (isVisitSuccessful ? '#059669' : '#D97706') : cyber})`,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${brand}40`
            }}
          >
            {step === steps.length - 1 ? (isVisitSuccessful ? '✅ Guardar Encuesta' : '⚠️ Guardar Incidencia') : 'Siguiente Paso →'}
          </button>
        </div>

      </div>
    </div>
  )
}
