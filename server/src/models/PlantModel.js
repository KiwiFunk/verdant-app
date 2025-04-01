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

module.exports = mongoose.model('Plant', PlantSchema);