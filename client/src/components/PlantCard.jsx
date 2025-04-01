import { useState, useEffect } from 'react'; // Removed unused useRef
import axios from 'axios';

function PlantCard({ plant, onDataChange }) {

    // Destructure the plant object from the prop to get the data from the fields
    const {
        _id,                   // MongoDB ID for object
        name,                  // Common name of the plant
        botanicalName,         // Scientific name of the plant
        notes,
        waterLevel,
        lastWatered,
        harvestMonths,
        baseColor
    } = plant;

    // HTTP Request functions
    const API_URL = 'http://localhost:5000/api/plants';

    // Delete target plant object (DELETE)
    const deletePlant = async (plantId) => {
        try {
            await axios.delete(`${API_URL}/${plantId}`);    // Send DELETE request to server
            onDataChange();                                 // Refresh app data after deletion
        } catch (error) {
            console.error('Error deleting plant:', error);
        }
    };

    // Use PATCH request to water the plant (reset water level to 100, update last watered date)
    const handleWater = async () => {
        try {
            await axios.patch(`${API_URL}/${_id}`, {
                waterLevel: 100,
                lastWatered: new Date()
            });
            onDataChange();
        } catch (error) {
            console.error('Error watering plant:', error);
        }
    };

    // Take level int as input and return a color string based on the level
    const getWaterLevelColor = (level) => {
        if (level > 50) return '#27b0ff';
        if (level > 25) return '#ffaa44';
        return '#ff4444';
    };

    // Plant Card
    return (
        <div className="plant-card">
            <h2>{name}</h2>

            {/* Conditional fields to display */}
            {botanicalName && <p className="botanical-name">{botanicalName}</p>}
            {notes && <p className="notes">{notes}</p>}

            <button onClick={() => console.log('Edit functionality here')}>Edit</button>
            <button onClick={() => deletePlant(_id)}>Delete</button>
        </div>
    );
}


export default PlantCard;