import { useState, useEffect } from 'react'; // Removed unused useRef
import axios from 'axios';

function PlantCard({ plant }) {
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

    const deletePlant = async (plantId) => {
        try {
            await axios.delete(`${API_URL}/${plantId}`);    // Delete request
        } catch (error) {
            console.error('Error deleting plant:', error);  // Handle error
        }
    };

    // JSX return statement (wrapped in parentheses)
    return (
        <div className="plant-card">
            <h2>{name}</h2>
            <p>{botanicalName}</p>
            <button onClick={() => console.log('Edit functionality here')}>Edit</button>
            <button onClick={() => deletePlant(_id)}>Delete</button>
        </div>
    );
}


export default PlantCard;