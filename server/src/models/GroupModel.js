const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },                             // Group Name
    plants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plant' }],   // Array of plant IDs
    isCollapsed: { type: Boolean, default: false }                      // Collapse state
});

module.exports = mongoose.model('Group', GroupSchema);