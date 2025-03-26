const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    waterTimer: { type: Number, required: true },
    group: { type: String, required: false },
});

module.exports = mongoose.model('Plant', PlantSchema);