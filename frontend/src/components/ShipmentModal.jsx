import React, { useState, useEffect } from 'react'
import api from '../utils/api'

const ShipmentModal = ({ shipment, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    description: '',
    status: 'PENDING',
    is_fragile: false,
    origin: '',
    destination: '',
    distance_km: '',
    shipping_method: 'STANDARD',
    priority: 'NORMAL',
    weight_kg: 1,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (shipment) {
      setFormData({
        description: shipment.description || '',
        status: shipment.status || 'PENDING',
        is_fragile: shipment.is_fragile || false,
        origin: shipment.origin || '',
        destination: shipment.destination || '',
        distance_km: shipment.distance_km || '',
        shipping_method: shipment.shipping_method || 'STANDARD',
        priority: shipment.priority || 'NORMAL',
        weight_kg: shipment.weight_kg || 1,
        notes: shipment.notes || ''
      })
    }
  }, [shipment])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        distance_km: parseFloat(formData.distance_km),
        weight_kg: parseFloat(formData.weight_kg)
      }

      if (shipment) {
        await api.put(`/shipments/${shipment._id}`, submitData)
      } else {
        await api.post('/shipments', submitData)
      }

      onSaved()
    } catch (error) {
      console.error('Error saving shipment:', error)
      setError(error.response?.data?.message || 'Failed to save shipment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>{shipment ? 'Edit Shipment' : 'Create New Shipment'}</h3>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="e.g., Electronics, Furniture, Documents..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Origin *</label>
              <input
                type="text"
                name="origin"
                className="form-control"
                value={formData.origin}
                onChange={handleChange}
                required
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination *</label>
              <input
                type="text"
                name="destination"
                className="form-control"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g., Los Angeles, CA"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Distance (km) *</label>
              <input
                type="number"
                name="distance_km"
                className="form-control"
                value={formData.distance_km}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 500"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <input
                type="number"
                name="weight_kg"
                className="form-control"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                min="0.1"
                step="0.1"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Shipping Method</label>
              <select
                name="shipping_method"
                className="form-control"
                value={formData.shipping_method}
                onChange={handleChange}
              >
                <option value="STANDARD">Standard</option>
                <option value="EXPRESS">Express</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_fragile"
                  checked={formData.is_fragile}
                  onChange={handleChange}
                />
                <span className="form-label" style={{ margin: 0 }}>Fragile Item</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes, special instructions, or comments..."
              rows="3"
              style={{ resize: 'vertical' }}
            />
          </div>

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
              {loading ? 'Saving...' : (shipment ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShipmentModal
