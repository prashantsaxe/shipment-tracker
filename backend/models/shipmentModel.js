const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please provide a shipment description'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        required: [true, 'Please provide a shipment status'],
        enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    is_fragile: {
        type: Boolean,
        default: false
    },
    origin: {
        type: String,
        required: [true, 'Please provide an origin location'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'Please provide a destination location'],
        trim: true
    },
    distance_km: {
        type: Number,
        required: [true, 'Please provide the distance in kilometers'],
        min: [1, 'Distance must be at least 1 km']
    },
    shipping_method: {
        type: String,
        required: [true, 'Please provide a shipping method'],
        enum: ['STANDARD', 'EXPRESS'],
        default: 'STANDARD'
    },
    estimated_delivery_days: {
        type: Number,
        default: 0
    },
    estimated_cost: {
        type: Number,
        default: 0
    },
    tracking_number: {
        type: String,
        unique: true,
        sparse: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
        default: 'NORMAL'
    },
    weight_kg: {
        type: Number,
        min: [0.1, 'Weight must be at least 0.1 kg'],
        default: 1
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    actual_delivery_date: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Calculate estimated delivery days and cost before saving
shipmentSchema.pre('save', function(next) {
    const speed_factor = this.shipping_method === 'EXPRESS' ? 100 : 50;
    const handling_days = 1;
    
    // Calculate delivery days
    this.estimated_delivery_days = Math.ceil((this.distance_km / speed_factor) + handling_days);
    
    // Calculate estimated cost based on distance, weight, method, and priority
    let base_rate = 0.5; // Base rate per km
    let weight_multiplier = Math.max(1, this.weight_kg * 0.1);
    let method_multiplier = this.shipping_method === 'EXPRESS' ? 1.5 : 1;
    let priority_multiplier = 1;
    
    switch(this.priority) {
        case 'HIGH': priority_multiplier = 1.3; break;
        case 'URGENT': priority_multiplier = 1.6; break;
        case 'LOW': priority_multiplier = 0.8; break;
        default: priority_multiplier = 1;
    }
    
    let fragile_fee = this.is_fragile ? 10 : 0;
    
    this.estimated_cost = Math.round(
        (this.distance_km * base_rate * weight_multiplier * method_multiplier * priority_multiplier + fragile_fee) * 100
    ) / 100;
    
    // Generate tracking number if not exists
    if (!this.tracking_number) {
        const prefix = this.shipping_method === 'EXPRESS' ? 'EXP' : 'STD';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        this.tracking_number = `${prefix}${timestamp}${random}`;
    }
    
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
