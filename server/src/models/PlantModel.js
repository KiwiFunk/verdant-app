const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    botanicalName: { type: String },
    notes: { type: String },
    waterFrequency: { type: Number, default: 7 }, // in days
    waterLevel: { type: Number, default: 0 },
    lastWatered: { type: Date },
    harvestMonths: [{ type: String }],
    baseColor: { type: String, default: '#2c5530' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    position: { type: Number }
});

// Calulate water percentage based on lastWatered and waterFrequency
PlantSchema.methods.calculateWaterLevel = function() {
    if (!this.lastWatered) return 0;

    const now = new Date();
    const lastWatered = new Date(this.lastWatered);
    // Date in JS uses ms by default. 1000ms = 1s, 60s = 1m, 60m = 1h
    const elapsedHours = (now - lastWatered) / (1000 * 60 * 60);
    const dailyRate = 100 / this.waterFrequency;
    //Daily rate divided by hours in a day gives us the hourly rate.
    const hourlyRate = dailyRate / 24;
    
    return Math.max(0, Math.round(100 - (elapsedHours * hourlyRate)));
};

module.exports = mongoose.model('Plant', PlantSchema);