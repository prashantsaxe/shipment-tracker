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
    // More realistic speed calculations (km per day)
    const speed_factor = this.shipping_method === 'EXPRESS' ? 800 : 500; // Express: 800km/day, Standard: 500km/day
    const handling_days = this.shipping_method === 'EXPRESS' ? 0.5 : 1; // Express processes faster
    
    // Calculate delivery days (more realistic)
    this.estimated_delivery_days = Math.max(1, Math.ceil((this.distance_km / speed_factor) + handling_days));
    
    // Realistic cost calculation (Indian market rates)
    let base_rate_per_kg = 8; // ₹8 per kg as base rate
    let distance_rate = 0.15; // ₹0.15 per km per kg
    
    // Weight-based pricing (minimum 0.5kg for calculation)
    let chargeable_weight = Math.max(0.5, this.weight_kg);
    
    // Method multipliers
    let method_multiplier = this.shipping_method === 'EXPRESS' ? 1.8 : 1;
    
    // Priority multipliers
    let priority_multiplier = 1;
    switch(this.priority) {
        case 'HIGH': priority_multiplier = 1.2; break;
        case 'URGENT': priority_multiplier = 1.5; break;
        case 'LOW': priority_multiplier = 0.9; break;
        default: priority_multiplier = 1;
    }
    
    // Distance-based pricing tiers (more economical for longer distances)
    let distance_multiplier = 1;
    if (this.distance_km > 1000) distance_multiplier = 0.8;
    else if (this.distance_km > 500) distance_multiplier = 0.9;
    
    // Additional charges
    let fragile_fee = this.is_fragile ? (chargeable_weight * 5) : 0; // ₹5 per kg for fragile
    let fuel_surcharge = (base_rate_per_kg + (this.distance_km * distance_rate)) * 0.1; // 10% fuel surcharge
    
    // Final calculation
    let base_cost = (base_rate_per_kg * chargeable_weight) + (this.distance_km * distance_rate * chargeable_weight);
    let total_cost = base_cost * method_multiplier * priority_multiplier * distance_multiplier + fragile_fee + fuel_surcharge;
    
    this.estimated_cost = Math.round(total_cost * 100) / 100;
    
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
