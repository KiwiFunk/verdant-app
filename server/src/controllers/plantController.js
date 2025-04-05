const Plant = require('../models/PlantModel');
const Group = require('../models/GroupModel');
const { 
    getPositionForNewItem, 
    getPositionBetween, 
    needsNormalization, 
    normalizePositions 
} = require('../utils/positionHelpers')

const plantController = {

    // Create new plant object (POST Request)
    createPlant: async (req, res) => {
        try {
            // Find plants in the same group to calculate position
            const groupPlants = await Plant.find({ group: req.body.group }, 'position');
            const position = getPositionForNewItem(groupPlants);
            
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
    },

    // Reorder plants endpoint
    reorderPlant: async (req, res) => {
        try {
            const { plantId, beforeId, afterId, groupId } = req.body;
            
            // Find the positions of before and after plants
            const beforePlant = beforeId ? await Plant.findById(beforeId, 'position') : null;
            const afterPlant = afterId ? await Plant.findById(afterId, 'position') : null;
            
            // Calculate new position using helper
            const beforePosition = beforePlant ? beforePlant.position : null;
            const afterPosition = afterPlant ? afterPlant.position : null;
            const newPosition = getPositionBetween(beforePosition, afterPosition);
            
            // Find the current plant to get its original groupId
            const currentPlant = await Plant.findById(plantId);
            if (!currentPlant) {
                return res.status(404).json({ message: 'Plant not found' });
            }
            
            // Check if group is changing
            const originalGroupId = currentPlant.group.toString();
            const targetGroupId = groupId || originalGroupId;
            
            // Update the plant position and potentially group
            const updatedPlant = await Plant.findByIdAndUpdate(
                plantId,
                { 
                    position: newPosition,
                    ...(groupId && { group: groupId })
                },
                { new: true }
            );
            
            // If the group changed, update group references
            if (groupId && originalGroupId !== targetGroupId) {
                // Remove from old group
                await Group.findByIdAndUpdate(
                    originalGroupId,
                    { $pull: { plants: plantId } }
                );
                
                // Add to new group
                await Group.findByIdAndUpdate(
                    targetGroupId,
                    { $push: { plants: plantId } }
                );
            }
            
            // Check if normalization is needed after this operation
            const plantsInGroup = await Plant.find({ group: targetGroupId }, 'position');
            if (needsNormalization(plantsInGroup)) {
                await plantController.normalizePlantPositions(req, res, targetGroupId, true);
                return; // The response will be sent by normalizePlantPositions
            }
            
            res.status(200).json(updatedPlant);
        } catch (error) {
            console.error('Error reordering plant:', error);
            res.status(400).json({ message: error.message });
        }
    },
    
    // Normalize plant positions endpoint
    normalizePlantPositions: async (req, res, groupIdParam = null, isInternal = false) => {
        try {
            // Get groupId either from params, function argument, or request body
            const groupId = groupIdParam || req.params.groupId;
            
            // Get all plants in the group
            const plants = await Plant.find({ group: groupId }, '_id position');
            
            // Use helper to normalize positions
            const normalizedPlants = normalizePositions(plants);
            
            // Create bulk update operations
            const updates = normalizedPlants.map(plant => ({
                updateOne: {
                    filter: { _id: plant._id },
                    update: { position: plant.position }
                }
            }));
            
            // Apply updates in a single bulk operation
            if (updates.length > 0) {
                await Plant.bulkWrite(updates);
            }
            
            // If called internally from another controller method, don't send response
            if (isInternal) {
                return;
            }
            
            res.status(200).json({ message: 'Plant positions normalized successfully' });
        } catch (error) {
            console.error('Error normalizing plant positions:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = plantController;