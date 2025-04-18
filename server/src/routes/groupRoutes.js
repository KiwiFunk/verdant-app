const express = require('express');                                 // Import express for Router
const router = express.Router();                                    // Create a new Router          
const groupController = require('../controllers/groupController');  // Import groupController

// Position management routes
router.patch('/reorder', groupController.reorderGroup);
router.post('/normalize', groupController.normalizeGroupPositions);

router.get('/', groupController.getAllGroups);               
router.post('/', groupController.createGroup);
router.patch('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;