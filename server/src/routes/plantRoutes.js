const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.post('/', plantController.createPlant);
router.delete('/:id', plantController.deletePlant);
router.patch('/water/:id', plantController.waterPlant);         // Water the target plant
router.get('/water-level/:id', plantController.getWaterLevel);  // Get the water level of a plant

module.exports = router;