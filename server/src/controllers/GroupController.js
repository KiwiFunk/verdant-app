const Group = require('../models/GroupModel');

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

    // Delete a group (DELETE Request)
    deleteGroup: async (req, res) => {
        try {
            await Group.findByIdAndDelete(req.params.id);
            res.json({ message: 'Group deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = groupController;