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

    // Water the target plant (PATCH Request)
    waterPlant: async (req, res) => {
        try {
            const { waterLevel, lastWatered } = req.body;
            const updatedPlant = await Plant.findByIdAndUpdate(
                req.params.id,
                { waterLevel, lastWatered },
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

    //Get the water level of a plant (GET Request)
    getWaterLevel: async (req, res) => {
        try {
            const plant = await Plant.findById(req.params.id);
            if (!plant) {
                return res.status(404).json({ message: 'Plant not found' });
            }
            const waterLevel = plant.calculateWaterLevel(); // Calculate water level using the method defined in the model
            res.json({ waterLevel });                       // Return the water level as a JSON response
        } catch (err) {
            res.status(500).json({ message: err.message });
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