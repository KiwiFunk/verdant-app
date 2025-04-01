const express = require('express');                                 // Import express for Router
const router = express.Router();                                    // Create a new Router
const cardController = require('../controllers/plantController');    // Import cardController

router.get('/', cardController.getAllCards);                        // Get all cards
router.post('/', cardController.createCard);                        // Create a new card
router.patch('/:id', cardController.updateCard);                    // Update a card by ID
router.delete('/:id', cardController.deleteCard);                   // Delete a card by ID

module.exports = router;                                            // Export the router for use in the app