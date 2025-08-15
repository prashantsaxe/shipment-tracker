import React, { useState } from 'react'
import api from '../utils/api'

const QuickStatusUpdate = ({ shipment, onStatusUpdated, onClose }) => {
  const [status, setStatus] = useState(shipment.status)
  const [actualDeliveryDate, setActualDeliveryDate] = useState(
    shipment.actual_delivery_date ? new Date(shipment.actual_delivery_date).toISOString().split('T')[0] : ''
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updateData = { status }
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
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>⚡ Quick Status Update</h3>
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
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{shipment.description}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {shipment.tracking_number && `${shipment.tracking_number} • `}
            {shipment.origin} → {shipment.destination}
          </p>
        </div>

        {error && (
          <div style={{
            color: '#dc3545',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Update Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ 
                borderLeft: `4px solid ${getStatusColor(status)}`,
                paddingLeft: '12px'
              }}
            >
              <option value="PENDING">📋 Pending</option>
              <option value="IN_TRANSIT">🚚 In Transit</option>
              <option value="DELIVERED">✅ Delivered</option>
              <option value="CANCELLED">❌ Cancelled</option>
            </select>
          </div>

          {status === 'DELIVERED' && (
            <div className="form-group">
              <label className="form-label">Actual Delivery Date (Optional)</label>
              <input
                type="date"
                className="form-control"
                value={actualDeliveryDate}
                onChange={(e) => setActualDeliveryDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickStatusUpdate
