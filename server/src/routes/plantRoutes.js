const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.post('/', plantController.createPlant);
router.delete('/:id', plantController.deletePlant);
router.patch('/water/:id', plantController.updatePlant);         // Water the target plant
router.patch('/:id', plantController.updatePlant);               // Update the target plant

module.exports = router;