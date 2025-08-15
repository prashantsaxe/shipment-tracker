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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Your Shipments</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setShowStats(!showStats)}
            className="btn btn-secondary"
          >
            {showStats ? '📊 Hide Stats' : '📊 Show Stats'}
          </button>
          <button
            onClick={handleCreateShipment}
            className="btn btn-primary"
          >
            + New Shipment
          </button>
        </div>
      </div>

      {/* Dashboard Statistics */}
      {showStats && (
        <div style={{ marginBottom: '2rem' }}>
          <DashboardStats />
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Status Filter</label>
            <select
              className="form-control"
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
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by description, origin, or destination..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>

          <button
            onClick={() => setFilters({ status: 'all', search: '', page: 1, pageSize: 10 })}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading shipments...</div>
        </div>
      ) : (
        <>
          <ShipmentList
            shipments={shipments}
            onEdit={handleEditShipment}
            onDelete={handleDeleteShipment}
            onGetPackingInstructions={handleGetPackingInstructions}
            onQuickStatusUpdate={handleQuickStatusUpdate}
          />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button
                className="btn btn-secondary"
                disabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>
              
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
                Page {filters.page} of {pagination.pages}
              </span>
              
              <button
                className="btn btn-secondary"
                disabled={filters.page === pagination.pages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
            Showing {shipments.length} of {pagination.totalCount} shipments
          </div>
        </>
      )}

      {/* Modals */}
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
