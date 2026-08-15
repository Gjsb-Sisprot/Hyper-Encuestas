import React, { useState, useEffect } from 'react'
import App from './App'
import SurveyForm from './SurveyForm'
import AdminLogin from './components/AdminLogin'
import { supabase } from './lib/supabase'

export default function Root() {
  const initialPath = window.location.pathname
  const [viewMode, setViewMode] = useState<'survey' | 'admin'>(
    initialPath === '/admin' ? 'admin' : 'survey'
  )
  const [adminUser, setAdminUser] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.email) {
          setAdminUser(session.user.email)
        }
      } catch (e) {
        console.warn('Error verificando sesión de Supabase:', e)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setAdminUser(session.user.email)
      } else {
        setAdminUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAdminUser(null)
    setViewMode('survey')
  }

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#060913', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00A3FF', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse" style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Cargando Sistema SGF Hyper Encuestas...</p>
        </div>
      </div>
    )
  }

  // Vista de Administración
  if (viewMode === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(email) => setAdminUser(email)}
          onCancelPublic={() => setViewMode('survey')}
        />
      )
    }

    return (
      <App
        userEmail={adminUser}
        onLogout={handleLogout}
        onOpenSurvey={() => setViewMode('survey')}
      />
    )
  }

  // Vista Pública de Encuestas (Default)
  return (
    <SurveyForm
      onOpenAdmin={() => setViewMode('admin')}
    />
  )
}
