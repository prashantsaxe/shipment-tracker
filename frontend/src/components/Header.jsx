import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path) => location.pathname === path

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: '#fff', 
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          📦 Shipment Tracker
        </h1>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: isActive('/dashboard') ? 'rgba(255,255,255,0.3)' : 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            style={{
              background: isActive('/profile') ? 'rgba(255,255,255,0.3)' : 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            Profile
          </button>
          
          <div style={{ 
            color: '#fff', 
            padding: '0 1rem',
            borderLeft: '1px solid rgba(255,255,255,0.3)'
          }}>
            Welcome, {user?.name}!
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
