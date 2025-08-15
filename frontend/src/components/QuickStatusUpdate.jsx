import React, { useState } from 'react'
import api from '../utils/api'

const QuickStatusUpdate = ({ shipment, onStatusUpdated, onClose }) => {
  const [status, setStatus] = useState(shipment.status)
  const [actualDeliveryDate, setActualDeliveryDate] = useState(
    shipment.actual_delivery_date ? new Date(shipment.actual_delivery_date).toISOString().split('T')[0] : ''
  )
  const [trackingNotes, setTrackingNotes] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAutoUpdate = async (newStatus, reason) => {
    setLoading(true)
    setError('')

    try {
      const updateData = { 
        status: newStatus,
        auto_update_reason: reason,
        timestamp: new Date().toISOString()
      }
      
      if (newStatus === 'DELIVERED') {
        updateData.actual_delivery_date = new Date().toISOString().split('T')[0]
      }

      await api.patch(`/shipments/${shipment._id}/status`, updateData)
      onStatusUpdated()
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const handleManualUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updateData = { 
        status,
        manual_update: true,
        tracking_notes: trackingNotes,
        current_location: location
      }
      
      if (status === 'DELIVERED' && actualDeliveryDate) {
        updateData.actual_delivery_date = actualDeliveryDate
      }

      await api.patch(`/shipments/${shipment._id}/status`, updateData)
      onStatusUpdated()
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'PENDING': return '#ffc107'
      case 'IN_TRANSIT': return '#17a2b8'
      case 'DELIVERED': return '#28a745'
      case 'CANCELLED': return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>📍 Shipment Tracking Update</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{shipment.description}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
            {shipment.tracking_number && `🏷️ ${shipment.tracking_number} • `}
            📍 {shipment.origin} → {shipment.destination}
          </p>
        </div>

        {/* Simulated Automatic Updates Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h5 style={{ 
            margin: '0 0 1rem 0', 
            color: '#2d3748',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Simulated Auto-Tracking
          </h5>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '0.75rem' 
          }}>
            <button
              onClick={() => handleAutoUpdate('IN_TRANSIT', 'GPS: Vehicle departed warehouse')}
              disabled={loading || shipment.status === 'DELIVERED'}
              style={{
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🚚 In Transit<br/>
              <small style={{ fontSize: '0.7rem', opacity: 0.9 }}>GPS Update</small>
            </button>
            
            <button
              onClick={() => handleAutoUpdate('DELIVERED', 'Delivery confirmed via recipient signature')}
              disabled={loading || shipment.status === 'DELIVERED'}
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ✅ Delivered<br/>
              <small style={{ fontSize: '0.7rem', opacity: 0.9 }}>Auto-Confirm</small>
            </button>
            
            <button
              onClick={() => handleAutoUpdate('CANCELLED', 'Exception: Address unreachable')}
              disabled={loading || shipment.status === 'DELIVERED'}
              style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ❌ Exception<br/>
              <small style={{ fontSize: '0.7rem', opacity: 0.9 }}>Auto-Cancel</small>
            </button>
          </div>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6c757d', 
            margin: '0.75rem 0 0 0',
            fontStyle: 'italic'
          }}>
            💡 In real systems: Updates come from carrier APIs, GPS devices, warehouse scans, etc.
          </p>
        </div>

        <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #dee2e6' }} />

        {/* Manual Update Section */}
        <div>
          <h5 style={{ 
            margin: '0 0 1rem 0', 
            color: '#2d3748',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ✋ Manual Override
          </h5>
          
          {error && (
            <div style={{
              color: '#dc3545',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleManualUpdate}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                Status Override
              </label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ 
                  borderLeft: `4px solid ${getStatusColor(status)}`,
                  paddingLeft: '12px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="PENDING">📋 Pending</option>
                <option value="IN_TRANSIT">🚚 In Transit</option>
                <option value="DELIVERED">✅ Delivered</option>
                <option value="CANCELLED">❌ Cancelled</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                Current Location (Optional)
              </label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mumbai Distribution Center"
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                Tracking Notes
              </label>
              <textarea
                className="form-control"
                value={trackingNotes}
                onChange={(e) => setTrackingNotes(e.target.value)}
                placeholder="Reason for manual update (delivery attempt failed, customer request, etc.)"
                rows="2"
                style={{ fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>

            {status === 'DELIVERED' && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                  Delivery Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={actualDeliveryDate}
                  onChange={(e) => setActualDeliveryDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.9rem' }}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Manual Update'}
              </button>
            </div>
          </form>
          
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6c757d', 
            margin: '0.75rem 0 0 0',
            fontStyle: 'italic'
          }}>
            🔧 Manual updates: For exceptions, customer service, or when automated systems fail
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuickStatusUpdate
