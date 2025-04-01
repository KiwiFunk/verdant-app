const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    botanicalName: { type: String },
    notes: { type: String },
    waterLevel: { type: Number, default: 100 },
    lastWatered: { type: Date },
    harvestMonths: [{ type: String }],
    baseColor: { type: String, default: '#2c5530' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    position: { type: Number }
});

//Middleware

// Handle relationship cleanup when a plant is deleted; remove plant from group that references it
PlantSchema.pre('deleteOne', { document: true, query: false }, async function() {
    const Plant = this.constructor;
    await mongoose.model('Group').updateMany(
        { plants: this._id },
        { $pull: { plants: this._id } }
    );
});

module.exports = mongoose.model('Plant', PlantSchema);