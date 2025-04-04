const Plant = require('../models/PlantModel');
const Group = require('../models/GroupModel');

const plantController = {
    
    // Create new plant object (POST Request)
    createPlant: async (req, res) => {
        try {
            // Find highest position in the group for spatial positioning
            const groupPlants = await Plant.find({ group: req.body.group });
            let position = 10000;
            
            if (groupPlants.length > 0) {
                const maxPosition = Math.max(...groupPlants.map(p => p.position || 0));
                position = maxPosition + 10000;
            }
            
            const newPlant = new Plant({
                ...req.body,
                position: position
            });
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

    // Water the target plant (PATCH Request)
    waterPlant: async (req, res) => {
        try {
            const { lastWatered } = req.body;
            const updatedPlant = await Plant.findByIdAndUpdate(
                req.params.id,
                { lastWatered },
                { new: true }
            );
            
            if (!updatedPlant) {
                return res.status(404).json({ message: 'Plant not found' });
            }
            
            res.status(200).json(updatedPlant);
        } catch (error) {
            console.error('Error watering plant:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Update plant object (PATCH Request)
    updatePlant: async (req, res) => {
        try {
            const updatedPlant = await Plant.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            
            if (!updatedPlant) {
                return res.status(404).json({ message: 'Plant not found' });
            }
            
            res.status(200).json(updatedPlant);
        } catch (error) {
            console.error('Error updating plant:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Delete specified plant object (DELETE Request)
    deletePlant: async (req, res) => {
        try {
            // First find the plant to get its group ID
            const targetPlant = await Plant.findById(req.params.id);
            if (!targetPlant) {
                return res.status(404).json({ message: 'Plant not found' });
            }

            // Remove plant reference from its group using $pull
            await Group.findByIdAndUpdate(
                targetPlant.group,
                { $pull: { plants: targetPlant._id } }
            );

            // Delete the plant
            await Plant.findByIdAndDelete(req.params.id);
            
            res.status(200).json({ message: 'Plant deleted successfully' });
        } catch (error) {
            console.error('Could not delete plant:', error);
            res.status(500).json({ message: error.message });
        }
    }

};

module.exports = plantController;