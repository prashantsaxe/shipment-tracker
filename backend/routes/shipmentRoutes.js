const express = require('express');
const router = express.Router();
const {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipment,
    deleteShipment,
    getPackingInstructions,
    getDashboardStats,
    updateShipmentStatus
} = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/shipments
router.get('/', getShipments);

// @route   GET /api/shipments/stats
router.get('/stats', getDashboardStats);

// @route   POST /api/shipments
router.post('/', createShipment);

// @route   GET /api/shipments/:id
router.get('/:id', getShipmentById);

// @route   PUT /api/shipments/:id
router.put('/:id', updateShipment);

// @route   PATCH /api/shipments/:id/status
router.patch('/:id/status', updateShipmentStatus);

// @route   DELETE /api/shipments/:id
router.delete('/:id', deleteShipment);

// @route   POST /api/shipments/:id/packing-instructions
router.post('/:id/packing-instructions', getPackingInstructions);

module.exports = router;
