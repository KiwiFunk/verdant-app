const Plant = require('../models/PlantModel');
const Group = require('../models/GroupModel');

const plantController = {
    // Create new plant object (POST Request)
    createPlant: async (req, res) => {
        try {
            const newPlant = new Plant(req.body);
            const savedPlant = await newPlant.save();
            
            // Add plant to group
            await Group.findByIdAndUpdate(
                req.body.group,
                { $push: { plants: savedPlant._id } }
            );
            
            // Return populated plant data
            const populatedPlant = await Plant.findById(savedPlant._id);
            res.status(201).json(populatedPlant);
        } catch (error) {
            console.error('Plant creation error:', error);
            res.status(400).json({ message: error.message });
        }
    },

    // Delete specified plant object (DELETE Request)
    deletePlant: async (req, res) => {
        try {
            await Plant.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Plant deleted successfully' });
        } catch (error) {
            console.error('Couldnt delete plant:', error);
            res.status(500).json({ message: error.message });
        }
    }

};

module.exports = plantController;