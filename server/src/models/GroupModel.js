const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },                            // Group Name
    plants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }]   // Array of plant IDs
});

module.exports = mongoose.model('Group', GroupSchema);