const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

// Position management
router.patch('/reorder', plantController.reorderPlant);
router.post('/normalize/:groupId', plantController.normalizePlantPositions);

router.post('/', plantController.createPlant);
router.delete('/:id', plantController.deletePlant);
router.patch('/water/:id', plantController.waterPlant);         // Water the target plant
router.patch('/:id', plantController.updatePlant);               // Update the target plant



module.exports = router;