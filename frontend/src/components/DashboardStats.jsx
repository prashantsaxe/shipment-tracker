import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const DashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/shipments/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#718096', fontSize: '1.1rem' }}>Loading statistics...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ color: '#718096', fontSize: '1.1rem' }}>Unable to load statistics</div>
      </div>
    )
  }

  const { summary, financial, recentShipments, priorityBreakdown } = stats

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {summary.total}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Total Shipments</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          color: '#8b4513',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(252, 182, 159, 0.4)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {summary.pending}
          </h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Pending</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: '#2d3748',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(168, 237, 234, 0.4)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {summary.inTransit}
          </h3>
          <p style={{ margin: 0, opacity: 0.8 }}>In Transit</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #96fbc4 0%, #f9f047 100%)',
          color: '#2d3748',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(150, 251, 196, 0.4)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {summary.delivered}
          </h3>
          <p style={{ margin: 0, opacity: 0.8 }}>Delivered</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.25rem' }}>
            💰 Financial Overview
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>Total Estimated Cost:</span>
              <strong style={{ color: '#2d3748' }}>${financial.totalCost?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>Average Cost:</span>
              <strong style={{ color: '#2d3748' }}>${financial.averageCost?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>Total Distance:</span>
              <strong style={{ color: '#2d3748' }}>{financial.totalDistance?.toLocaleString() || 0} km</strong>
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.25rem' }}>
            🎯 Priority Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>🔴 Urgent:</span>
              <strong style={{ color: '#e53e3e' }}>{priorityBreakdown.URGENT || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>🟠 High:</span>
              <strong style={{ color: '#dd6b20' }}>{priorityBreakdown.HIGH || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>🟢 Normal:</span>
              <strong style={{ color: '#38a169' }}>{priorityBreakdown.NORMAL || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ color: '#4a5568' }}>🔵 Low:</span>
              <strong style={{ color: '#3182ce' }}>{priorityBreakdown.LOW || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {recentShipments && recentShipments.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1.25rem' }}>
            📦 Recent Shipments
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentShipments.map((shipment) => (
              <div 
                key={shipment._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div>
                  <strong style={{ color: '#2d3748' }}>{shipment.description}</strong>
                  {shipment.tracking_number && (
                    <span style={{ color: '#718096', marginLeft: '0.5rem' }}>
                      ({shipment.tracking_number})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: shipment.status === 'DELIVERED' ? '#c6f6d5' : 
                               shipment.status === 'IN_TRANSIT' ? '#bee3f8' :
                               shipment.status === 'PENDING' ? '#fef5e7' : '#fed7d7',
                    color: shipment.status === 'DELIVERED' ? '#2f855a' : 
                           shipment.status === 'IN_TRANSIT' ? '#2b6cb0' :
                           shipment.status === 'PENDING' ? '#b7791f' : '#c53030'
                  }}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                  <span style={{ color: '#718096', fontSize: '0.8rem' }}>
                    {shipment.estimated_delivery_days} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardStats
