import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mkluqieffbwelhkxbovk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbHVxaWVmZmJ3ZWxoa3hib3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MDI1NjMsImV4cCI6MjA4MzM3ODU2M30.Mb_H5skSS6QcUz5vKi23AG7PZDamjwUia7fLugtnu_8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Lead {
  id: string
  nombre: string
  zona: string
  cat: string
  prov: string
  pago: number
  pts: number
  score: string
  plan: string
  feas: string
  accion: string
  avatar: string
  created_at?: string
  updated_at?: string
}

export interface MapLocal {
  id: string
  x: number
  y: number
  w: number
  h: number
  nombre: string
  score: string
  vendedor: string
}

export interface SurveyResponse {
  id?: string
  local_id: string
  nombre_local?: string
  zona?: string
  vendedor?: string
  visit_result: string
  motivo_no_realizada?: string
  observaciones_visita?: string
  prov_actual?: string
  velocidad?: string
  pago_mensual?: string
  verificado_factura?: boolean
  satisfaccion?: number
  fallas?: string[]
  impacto?: string
  plan_sgf?: string
  contacto_nombre?: string
  contacto_tel?: string
  contacto_email?: string
  rol_decision?: string
  canal?: string
  created_at?: string
}

// ─── API SERVICES ─────────────────────────────────────────────────────────────

export async function fetchLeadsFromSupabase(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('pts', { ascending: false })

    if (error) {
      console.warn('Error al cargar leads desde Supabase, usando respaldo estático:', error.message)
      return null
    }
    return data && data.length > 0 ? (data as Lead[]) : null
  } catch (err) {
    console.warn('Excepción al conectar con Supabase:', err)
    return null
  }
}

export async function fetchMapLocalsFromSupabase(): Promise<MapLocal[] | null> {
  try {
    const { data, error } = await supabase
      .from('map_locals')
      .select('*')

    if (error) {
      console.warn('Error al cargar mapa desde Supabase, usando respaldo estático:', error.message)
      return null
    }
    return data && data.length > 0 ? (data as MapLocal[]) : null
  } catch (err) {
    console.warn('Excepción mapa Supabase:', err)
    return null
  }
}

export async function saveSurveyResponse(survey: SurveyResponse): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: surveyErr } = await supabase
      .from('survey_responses')
      .insert([survey])

    if (surveyErr) {
      console.error('Error insertando encuesta:', surveyErr)
      return { success: false, error: surveyErr.message }
    }

    // Si la visita fue completada, actualizar estatus del lead en la tabla leads
    if (survey.visit_result === 'Completada') {
      await supabase
        .from('leads')
        .update({
          prov: survey.prov_actual || 'Indefinido',
          pago: survey.pago_mensual ? parseFloat(survey.pago_mensual) || 0 : 0,
          accion: 'Encuesta realizada - ' + (survey.plan_sgf || 'Propuesta enviada'),
          updated_at: new Date().toISOString()
        })
        .eq('id', survey.local_id)
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error guardando encuesta en Supabase:', err)
    return { success: false, error: err?.message || 'Error de conexión' }
  }
}

export async function updateLeadInSupabase(id: string, updates: Partial<Lead>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    return !error
  } catch {
    return false
  }
}
