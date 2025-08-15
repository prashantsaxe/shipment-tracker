import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import ShipmentList from '../components/ShipmentList'
import ShipmentModal from '../components/ShipmentModal'
import PackingInstructionsModal from '../components/PackingInstructionsModal'
import QuickStatusUpdate from '../components/QuickStatusUpdate'
import DashboardStats from '../components/DashboardStats'

const Dashboard = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [showPackingModal, setShowPackingModal] = useState(false)
  const [packingData, setPackingData] = useState(null)
  const [showQuickStatus, setShowQuickStatus] = useState(false)
  const [statusUpdateShipment, setStatusUpdateShipment] = useState(null)
  const [showStats, setShowStats] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    pageSize: 10
  })
  const [pagination, setPagination] = useState({
    pages: 1,
    totalCount: 0
  })

  useEffect(() => {
    fetchShipments()
  }, [filters])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      params.append('page', filters.page)
      params.append('pageSize', filters.pageSize)

      const response = await api.get(`/shipments?${params.toString()}`)
      setShipments(response.data.shipments)
      setPagination({
        pages: response.data.pages,
        totalCount: response.data.totalCount
      })
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShipment = () => {
    setEditingShipment(null)
    setShowModal(true)
  }

  const handleEditShipment = (shipment) => {
    setEditingShipment(shipment)
    setShowModal(true)
  }

  const handleDeleteShipment = async (shipmentId) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await api.delete(`/shipments/${shipmentId}`)
        fetchShipments()
      } catch (error) {
        console.error('Error deleting shipment:', error)
        alert('Failed to delete shipment')
      }
    }
  }

  const handleShipmentSaved = () => {
    setShowModal(false)
    fetchShipments()
  }

  const handleGetPackingInstructions = async (shipment) => {
    try {
      setPackingData({ loading: true, shipment })
      setShowPackingModal(true)
      
      const response = await api.post(`/shipments/${shipment._id}/packing-instructions`)
      setPackingData({
        loading: false,
        shipment,
        instructions: response.data.instructions
      })
    } catch (error) {
      console.error('Error getting packing instructions:', error)
      setPackingData({
        loading: false,
        shipment,
        error: 'Failed to generate packing instructions. Please try again.'
      })
    }
  }

  const handleQuickStatusUpdate = (shipment) => {
    setStatusUpdateShipment(shipment)
    setShowQuickStatus(true)
  }

  const handleStatusUpdated = () => {
    setShowQuickStatus(false)
    setStatusUpdateShipment(null)
    fetchShipments()
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage })
  }

  return (
    <div className="container">
      <div style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '2rem', fontWeight: 'bold' }}>
              Dashboard
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '1rem' }}>
              Manage and track your shipments efficiently
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowStats(!showStats)}
              style={{
                background: showStats ? '#4299e1' : 'transparent',
                color: showStats ? '#fff' : '#4299e1',
                border: '2px solid #4299e1',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            <button
              onClick={handleCreateShipment}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              + New Shipment
            </button>
          </div>
        </div>
      </div>

      {showStats && (
        <div style={{ marginBottom: '2rem' }}>
          <DashboardStats />
        </div>
      )}

      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem' }}>
          Filter Shipments
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
              Status Filter
            </label>
            <select
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s'
              }}
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
              Search
            </label>
            <input
              type="text"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s'
              }}
              placeholder="Search by description, origin, or destination..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>

          <button
            onClick={() => setFilters({ status: 'all', search: '', page: 1, pageSize: 10 })}
            style={{
              background: '#718096',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          background: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.1rem', color: '#718096' }}>Loading shipments...</div>
        </div>
      ) : (
        <>
          <div style={{
            background: '#fff',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <ShipmentList
              shipments={shipments}
              onEdit={handleEditShipment}
              onDelete={handleDeleteShipment}
              onGetPackingInstructions={handleGetPackingInstructions}
              onQuickStatusUpdate={handleQuickStatusUpdate}
            />
          </div>

          {pagination.pages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              marginTop: '2rem',
              padding: '1rem',
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <button
                style={{
                  background: filters.page === 1 ? '#e2e8f0' : '#4299e1',
                  color: filters.page === 1 ? '#a0aec0' : '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: filters.page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>
              
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 1rem',
                fontSize: '0.9rem',
                color: '#4a5568',
                fontWeight: '600'
              }}>
                Page {filters.page} of {pagination.pages}
              </span>
              
              <button
                style={{
                  background: filters.page === pagination.pages ? '#e2e8f0' : '#4299e1',
                  color: filters.page === pagination.pages ? '#a0aec0' : '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: filters.page === pagination.pages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
                disabled={filters.page === pagination.pages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          )}

          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: '#718096',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            Showing {shipments.length} of {pagination.totalCount} shipments
          </div>
        </>
      )}

      {showModal && (
        <ShipmentModal
          shipment={editingShipment}
          onClose={() => setShowModal(false)}
          onSaved={handleShipmentSaved}
        />
      )}

      {showPackingModal && (
        <PackingInstructionsModal
          data={packingData}
          onClose={() => setShowPackingModal(false)}
        />
      )}

      {showQuickStatus && statusUpdateShipment && (
        <QuickStatusUpdate
          shipment={statusUpdateShipment}
          onStatusUpdated={handleStatusUpdated}
          onClose={() => setShowQuickStatus(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
