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
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading statistics...
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Unable to load statistics
        </div>
      </div>
    )
  }

  const { summary, financial, recentShipments, priorityBreakdown } = stats

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>{summary.total}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Shipments</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffc107' }}>{summary.pending}</h3>
          <p style={{ margin: 0, color: '#666' }}>Pending</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#17a2b8' }}>{summary.inTransit}</h3>
          <p style={{ margin: 0, color: '#666' }}>In Transit</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#28a745' }}>{summary.delivered}</h3>
          <p style={{ margin: 0, color: '#666' }}>Delivered</p>
        </div>
      </div>

      {/* Financial Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>💰 Financial Overview</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Estimated Cost:</span>
              <strong>${financial.totalCost?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Cost:</span>
              <strong>${financial.averageCost?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Distance:</span>
              <strong>{financial.totalDistance?.toLocaleString() || 0} km</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>🎯 Priority Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🔴 Urgent:</span>
              <strong>{priorityBreakdown.URGENT || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🟠 High:</span>
              <strong>{priorityBreakdown.HIGH || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🟢 Normal:</span>
              <strong>{priorityBreakdown.NORMAL || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>🔵 Low:</span>
              <strong>{priorityBreakdown.LOW || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      {recentShipments && recentShipments.length > 0 && (
        <div className="card">
          <h4 style={{ marginBottom: '1rem' }}>📦 Recent Shipments</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentShipments.map((shipment) => (
              <div 
                key={shipment._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: '#f8f9fa',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <div>
                  <strong>{shipment.description}</strong>
                  {shipment.tracking_number && (
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      ({shipment.tracking_number})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className={`status-badge status-${shipment.status.toLowerCase()}`}>
                    {shipment.status.replace('_', ' ')}
                  </span>
                  <span style={{ color: '#666' }}>
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
