const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true },             // Plant Name
    scientificName: { type: String, required: false },  // Scientific Name
    group: { type: String, required: true },            // Group/Folder
    position: { type: Number, required: true },         // Position in Group/Row
});

module.exports = mongoose.model('Plant', PlantSchema);