import React from 'react'

const ShipmentList = ({ shipments, onEdit, onDelete, onGetPackingInstructions, onQuickStatusUpdate }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      'PENDING': { bg: '#fef5e7', color: '#b7791f', border: '#f6e05e' },
      'IN_TRANSIT': { bg: '#bee3f8', color: '#2b6cb0', border: '#63b3ed' },
      'DELIVERED': { bg: '#c6f6d5', color: '#2f855a', border: '#68d391' },
      'CANCELLED': { bg: '#fed7d7', color: '#c53030', border: '#fc8181' }
    }
    
    const style = statusStyles[status] || statusStyles['PENDING']
    
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      'LOW': { bg: '#bee3f8', color: '#2b6cb0' },
      'NORMAL': { bg: '#c6f6d5', color: '#2f855a' },
      'HIGH': { bg: '#fef5e7', color: '#b7791f' },
      'URGENT': { bg: '#fed7d7', color: '#c53030' }
    }
    
    const style = priorityStyles[priority] || priorityStyles['NORMAL']
    
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {priority}
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
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '0.75rem',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}></div>
        <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>No shipments found</h3>
        <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>Create your first shipment to get started!</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {shipments.map((shipment) => (
        <div key={shipment._id} style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
          e.currentTarget.style.borderColor = '#cbd5e0'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'
          e.currentTarget.style.borderColor = '#e2e8f0'
        }}>
          
          {/* Compact Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '250px' }}>
              <h3 style={{ 
                margin: 0, 
                color: '#2d3748', 
                fontSize: '1.1rem',
                fontWeight: '600',
                lineHeight: '1.2'
              }}>
                {shipment.description}
              </h3>
              {getStatusBadge(shipment.status)}
              {shipment.is_fragile && (
                <span style={{ 
                  background: 'linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)', 
                  color: '#b7791f', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '0.375rem', 
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  border: '1px solid #f6e05e'
                }}>
                  FRAGILE
                </span>
              )}
              {shipment.priority && shipment.priority !== 'NORMAL' && (
                getPriorityBadge(shipment.priority)
              )}
            </div>
            
            {/* Compact Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem',
              flexShrink: 0
            }}>
              <button
                onClick={() => onGetPackingInstructions(shipment)}
                style={{
                  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(72, 187, 120, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 2px 6px rgba(72, 187, 120, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 1px 3px rgba(72, 187, 120, 0.3)'
                }}
              >
                AI Tips
              </button>
              <button
                onClick={() => onQuickStatusUpdate(shipment)}
                style={{
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(66, 153, 225, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 2px 6px rgba(66, 153, 225, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 1px 3px rgba(66, 153, 225, 0.3)'
                }}
              >
                Status
              </button>
              <button
                onClick={() => onEdit(shipment)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(102, 126, 234, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 1px 3px rgba(102, 126, 234, 0.3)'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(shipment._id)}
                style={{
                  background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(245, 101, 101, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 2px 6px rgba(245, 101, 101, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 1px 3px rgba(245, 101, 101, 0.3)'
                }}
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Tracking Info */}
          {shipment.tracking_number && (
            <div style={{ 
              fontSize: '0.85rem', 
              color: '#4299e1', 
              marginBottom: '1rem',
              padding: '0.5rem 0.75rem',
              background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
              borderRadius: '0.5rem',
              border: '1px solid #90cdf4',
              fontWeight: '500'
            }}>
              📍 <strong>Tracking:</strong> {shipment.tracking_number}
            </div>
          )}
          
          {/* Compact Info Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            {/* Route */}
            <div style={{
              background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#4a5568', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                🚚 Route
              </div>
              <div style={{ fontSize: '0.8rem', color: '#2d3748', fontWeight: '500', marginBottom: '0.25rem' }}>
                {shipment.origin} → {shipment.destination}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                {shipment.distance_km} km
              </div>
            </div>
            
            {/* Package */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #9ae6b4'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#2f855a', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                📦 Package
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1a365d', fontWeight: '500', marginBottom: '0.25rem' }}>
                {shipment.weight_kg || 1} kg • {shipment.shipping_method}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                Priority: {shipment.priority || 'Normal'}
              </div>
            </div>
            
            {/* Cost & Delivery */}
            <div style={{
              background: 'linear-gradient(135deg, #fffaf0 0%, #fef5e7 100%)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #f6e05e'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#b7791f', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                💰 Cost & Time
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1a365d', fontWeight: '500', marginBottom: '0.25rem' }}>
                ₹{shipment.estimated_cost || '0.00'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                {shipment.estimated_delivery_days} days
                {shipment.actual_delivery_date && (
                  <span> • Delivered {formatDate(shipment.actual_delivery_date)}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Notes */}
          {shipment.notes && (
            <div style={{ 
              background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #90cdf4',
              marginBottom: '0.75rem'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#2b6cb0', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                Notes
              </div>
              <p style={{ 
                margin: 0, 
                color: '#2d3748', 
                fontSize: '0.8rem',
                lineHeight: '1.4'
              }}>
                {shipment.notes}
              </p>
            </div>
          )}
          
          {/* Compact Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '0.5rem',
            borderTop: '1px solid #e2e8f0',
            fontSize: '0.75rem',
            color: '#718096'
          }}>
            <span>Created: {formatDate(shipment.createdAt)}</span>
            {shipment.updatedAt && shipment.updatedAt !== shipment.createdAt && (
              <span>Updated: {formatDate(shipment.updatedAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShipmentList
