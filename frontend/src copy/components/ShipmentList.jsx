import React from 'react'

const ShipmentList = ({ shipments, onEdit, onDelete, onGetPackingInstructions, onQuickStatusUpdate }) => {
  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status.toLowerCase()}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (shipments.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#666', marginBottom: '1rem' }}>No shipments found</h3>
        <p style={{ color: '#999' }}>Create your first shipment to get started!</p>
      </div>
    )
  }

  return (
    <div>
      {shipments.map((shipment) => (
        <div key={shipment._id} className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>{shipment.description}</h4>
                {getStatusBadge(shipment.status)}
                {shipment.is_fragile && (
                  <span style={{ 
                    background: '#ffc107', 
                    color: '#000', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    FRAGILE
                  </span>
                )}
                {shipment.priority && shipment.priority !== 'NORMAL' && (
                  <span style={{ 
                    background: shipment.priority === 'URGENT' ? '#dc3545' : 
                               shipment.priority === 'HIGH' ? '#fd7e14' : '#6c757d', 
                    color: '#fff', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {shipment.priority}
                  </span>
                )}
              </div>
              
              {shipment.tracking_number && (
                <div style={{ fontSize: '14px', color: '#007bff', marginBottom: '0.5rem' }}>
                  <strong>Tracking:</strong> {shipment.tracking_number}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>From:</strong> {shipment.origin}
                </div>
                <div>
                  <strong>To:</strong> {shipment.destination}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Distance:</strong> {shipment.distance_km} km
                </div>
                <div>
                  <strong>Weight:</strong> {shipment.weight_kg || 1} kg
                </div>
                <div>
                  <strong>Method:</strong> {shipment.shipping_method}
                </div>
                <div>
                  <strong>Est. Cost:</strong> ${shipment.estimated_cost || '0.00'}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Est. Delivery:</strong> {shipment.estimated_delivery_days} days
                </div>
                {shipment.actual_delivery_date && (
                  <div>
                    <strong>Delivered:</strong> {formatDate(shipment.actual_delivery_date)}
                  </div>
                )}
              </div>
              
              {shipment.notes && (
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  fontStyle: 'italic',
                  marginBottom: '0.5rem',
                  padding: '0.5rem',
                  background: '#f8f9fa',
                  borderRadius: '4px'
                }}>
                  <strong>Notes:</strong> {shipment.notes}
                </div>
              )}
              
              <div style={{ fontSize: '14px', color: '#666' }}>
                Created: {formatDate(shipment.createdAt)}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => onGetPackingInstructions(shipment)}
                className="btn btn-success"
                style={{ fontSize: '12px' }}
              >
                🤖 AI Packing Tips
              </button>
              <button
                onClick={() => onQuickStatusUpdate(shipment)}
                className="btn"
                style={{ 
                  fontSize: '12px',
                  backgroundColor: '#17a2b8',
                  color: 'white'
                }}
              >
                ⚡ Update Status
              </button>
              <button
                onClick={() => onEdit(shipment)}
                className="btn btn-primary"
                style={{ fontSize: '12px' }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(shipment._id)}
                className="btn btn-danger"
                style={{ fontSize: '12px' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShipmentList
