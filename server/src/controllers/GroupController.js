const Group = require('../models/GroupModel');
var Plant = require('../models/PlantModel');        //Get Plant model for garbage collection
const { 
    getPositionForNewItem, 
    getPositionBetween, 
    needsNormalization, 
    normalizePositions 
} = require('../utils/positionHelpers');

const groupController = {

    // Get all groups (GET Request)
    getAllGroups: async (req, res) => {
        try {
            // Sort by position when populating the groups ({Position: 1} indicates ascending order in MongoDB)
            const groups = await Group.find().populate('plants').sort({ position: 1 });
            res.json(groups);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a group (POST Request)
    createGroup: async (req, res) => {
        try {

            // Get all groups then calculate the position for the new group
            const allGroups = await Group.find({}, 'position');
            const position = getPositionForNewItem(allGroups);

            const newGroup = new Group({
                name: req.body.name,
                plants: [],
                position: position // Set the calculated position
            });
            const savedGroup = await newGroup.save();
            res.status(201).json(savedGroup);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update a group (PATCH Request)
    updateGroup: async (req, res) => {
        try {
            const updatedGroup = await Group.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(updatedGroup);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete a group (DELETE Request)
    deleteGroup: async (req, res) => {
        try {
            // Store the target group and delete related objects
            const targetGroup = await Group.findById(req.params.id);        
            if (!targetGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Delete all plants that belong to this group
            await Plant.deleteMany({ group: targetGroup._id });

            // Delete the group itself
            await targetGroup.deleteOne();

            res.json({ message: 'Group deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Reorder endpoint - Check if group needs normalization
    reorderGroup: async (req, res) => {
        try {
            const { groupId, beforeId, afterId } = req.body;
            
            // Find the positions of before and after groups
            const beforeGroup = beforeId ? await Group.findById(beforeId, 'position') : null;
            const afterGroup = afterId ? await Group.findById(afterId, 'position') : null;
            
            // Calculate new position using helper
            const beforePosition = beforeGroup ? beforeGroup.position : null;
            const afterPosition = afterGroup ? afterGroup.position : null;
            const newPosition = getPositionBetween(beforePosition, afterPosition);
            
            // Update the group position
            const updatedGroup = await Group.findByIdAndUpdate(
                groupId,
                { position: newPosition },
                { new: true }
            );
            
            if (!updatedGroup) {
                return res.status(404).json({ message: 'Group not found' });
            }
            
            // Check if normalization is needed after this operation
            const allGroups = await Group.find({}, 'position');
            if (needsNormalization(allGroups)) {
                await groupController.normalizeGroupPositions(req, res, true);
                return; // The response will be sent by normalizeGroupPositions
            }
            
            res.status(200).json(updatedGroup);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    
    // Normalize positions endpoint - Updated to use normalizePositions helper
    normalizeGroupPositions: async (req, res, isInternal = false) => {
        try {
            // Get all groups
            const groups = await Group.find({}, '_id position');
            
            // Use helper to normalize positions
            const normalizedGroups = normalizePositions(groups);
            
            // Create bulk update operations
            const updates = normalizedGroups.map(group => ({
                updateOne: {
                    filter: { _id: group._id },
                    update: { position: group.position }
                }
            }));
            
            // Apply updates in a single bulk operation
            await Group.bulkWrite(updates);
            
            // If called internally from another controller method, don't send response
            if (isInternal) {
                return;
            }
            
            res.status(200).json({ message: 'Group positions normalized successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = groupController;