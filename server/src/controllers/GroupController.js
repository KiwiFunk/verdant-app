const Group = require('../models/GroupModel');
var Plant = require('../models/PlantModel');        //Get Plant model for garbage collection

const groupController = {
    // Get all groups (GET Request)
    getAllGroups: async (req, res) => {
        try {
            const groups = await Group.find().populate('plants');
            res.json(groups);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a group (POST Request)
    createGroup: async (req, res) => {
        try {
            const newGroup = new Group({
                name: req.body.name,
                plants: []
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
                { name: req.body.name },
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
    }
};

module.exports = groupController;