const Shipment = require('../models/shipmentModel');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
    try {
        const { 
            description, 
            status, 
            is_fragile, 
            origin, 
            destination, 
            distance_km, 
            shipping_method,
            weight_kg,
            priority,
            notes
        } = req.body;

        if (!description || !origin || !destination || !distance_km) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const shipment = new Shipment({
            description,
            status,
            is_fragile: is_fragile || false,
            origin,
            destination,
            distance_km,
            shipping_method: shipping_method || 'STANDARD',
            weight_kg: weight_kg || 1,
            priority: priority || 'NORMAL',
            notes: notes || '',
            user: req.user._id
        });

        const createdShipment = await shipment.save();
        res.status(201).json(createdShipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating shipment' });
    }
};

// @desc    Get all shipments for user with pagination, filtering, and search
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.page) || 1;
        const status = req.query.status;
        const search = req.query.search;

        // Build query object
        let query = { user: req.user._id };

        // Add status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { description: { $regex: search, $options: 'i' } },
                { origin: { $regex: search, $options: 'i' } },
                { destination: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const shipments = await Shipment.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        // Get total count for pagination
        const count = await Shipment.countDocuments(query);

        res.json({
            shipments,
            page,
            pages: Math.ceil(count / pageSize),
            totalCount: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching shipments' });
    }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
const getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Check if user owns this shipment
        if (shipment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(shipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching shipment' });
    }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private
const updateShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Check if user owns this shipment
        if (shipment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { 
            description, 
            status, 
            is_fragile, 
            origin, 
            destination, 
            distance_km, 
            shipping_method,
            weight_kg,
            priority,
            notes
        } = req.body;

        shipment.description = description || shipment.description;
        shipment.status = status || shipment.status;
        shipment.is_fragile = is_fragile !== undefined ? is_fragile : shipment.is_fragile;
        shipment.origin = origin || shipment.origin;
        shipment.destination = destination || shipment.destination;
        shipment.distance_km = distance_km || shipment.distance_km;
        shipment.shipping_method = shipping_method || shipment.shipping_method;
        shipment.weight_kg = weight_kg || shipment.weight_kg;
        shipment.priority = priority || shipment.priority;
        shipment.notes = notes !== undefined ? notes : shipment.notes;

        const updatedShipment = await shipment.save();
        res.json(updatedShipment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating shipment' });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private
const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Check if user owns this shipment
        if (shipment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Shipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Shipment removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting shipment' });
    }
};

// @desc    Get AI-generated packing instructions
// @route   POST /api/shipments/:id/packing-instructions
// @access  Private
const getPackingInstructions = async (req, res) => {
    try {
        // Find the shipment by ID
        const shipment = await Shipment.findById(req.params.id);
        
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Check if user owns this shipment
        if (shipment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Setup Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a dynamic prompt
        const fragility = shipment.is_fragile ? 'fragile' : 'not fragile';
        const method = shipment.shipping_method.toLowerCase();
        const distance = shipment.distance_km;
        
        const prompt = `Provide clear, concise packing instructions for a shipment with this description: "${shipment.description}". 
        
        Additional details:
        - The item is ${fragility}
        - Shipping method: ${method}
        - Distance: ${distance} km
        - Origin: ${shipment.origin}
        - Destination: ${shipment.destination}
        
        Give the instructions as a well-formatted, bulleted list with specific, actionable advice. Include recommendations for packaging materials, handling precautions, and any special considerations based on the item's characteristics.`;

        // Call the API
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        res.json({ 
            instructions: text,
            shipment: {
                id: shipment._id,
                description: shipment.description,
                is_fragile: shipment.is_fragile,
                shipping_method: shipment.shipping_method
            }
        });
    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ 
            message: 'Error generating packing instructions',
            error: error.message 
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/shipments/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get basic counts
        const totalShipments = await Shipment.countDocuments({ user: userId });
        const pendingShipments = await Shipment.countDocuments({ user: userId, status: 'PENDING' });
        const inTransitShipments = await Shipment.countDocuments({ user: userId, status: 'IN_TRANSIT' });
        const deliveredShipments = await Shipment.countDocuments({ user: userId, status: 'DELIVERED' });
        
        // Get cost statistics
        const costStats = await Shipment.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalCost: { $sum: '$estimated_cost' },
                    avgCost: { $avg: '$estimated_cost' },
                    totalDistance: { $sum: '$distance_km' }
                }
            }
        ]);
        
        // Get recent shipments
        const recentShipments = await Shipment.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('description status tracking_number estimated_delivery_days createdAt');
        
        // Get priority breakdown
        const priorityStats = await Shipment.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);
        
        // Get monthly shipment trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyTrends = await Shipment.aggregate([
            { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    totalCost: { $sum: '$estimated_cost' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        
        res.json({
            summary: {
                total: totalShipments,
                pending: pendingShipments,
                inTransit: inTransitShipments,
                delivered: deliveredShipments,
                cancelled: totalShipments - pendingShipments - inTransitShipments - deliveredShipments
            },
            financial: {
                totalCost: costStats[0]?.totalCost || 0,
                averageCost: costStats[0]?.avgCost || 0,
                totalDistance: costStats[0]?.totalDistance || 0
            },
            recentShipments,
            priorityBreakdown: priorityStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            monthlyTrends
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error fetching statistics' });
    }
};

// @desc    Quick status update
// @route   PATCH /api/shipments/:id/status
// @access  Private
const updateShipmentStatus = async (req, res) => {
    try {
        const { status, actual_delivery_date } = req.body;
        
        const shipment = await Shipment.findById(req.params.id);
        
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        
        if (shipment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        shipment.status = status;
        if (status === 'DELIVERED' && actual_delivery_date) {
            shipment.actual_delivery_date = new Date(actual_delivery_date);
        }
        
        await shipment.save();
        res.json(shipment);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

module.exports = {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipment,
    deleteShipment,
    getPackingInstructions,
    getDashboardStats,
    updateShipmentStatus
};
