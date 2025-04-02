import { useState, useEffect } from 'react'; // Removed unused useRef
import axios from 'axios';
import './PlantCard.css';

function PlantCard({ plant, onDataChange }) {
    // Destructure the plant object from the prop to get the data from the fields
    const {
        _id,                   // MongoDB ID for object
        name,                  // Common name of the plant
        botanicalName,         // Scientific name of the plant
        notes,
        waterFrequency,        // Watering frequency in days
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
            await axios.patch(`${API_URL}/water/${_id}`, {
                lastWatered: new Date()
            });
            onDataChange();
        } catch (error) {
            console.error('Error watering plant:', error);
        }
    };

    //Calculate water level from current date, last watered date, and water frequency
    const calculateWaterLevel = () => {
        const now = new Date();
        const lastWateredDate = new Date(lastWatered);
        const timeDiff = now - lastWateredDate;                 // Difference in milliseconds

        const minsElapsed = Math.floor(timeDiff / (1000 * 60)); // Convert to mins (Date uses ms by default)
        const wateringInterval = waterFrequency * 24 * 60;      // Convert days to minutes

        const level = Math.max(0, 100 - Math.floor((minsElapsed / wateringInterval) * 100)); 
        return level || 0;                                      // Return 0 if NaN or negative
    };

    const waterLevel = calculateWaterLevel(); 

    // Take level int as input and return a color string based on the level
    const getWaterLevelColor = (level) => {
        if (level > 50) return 'var(--water-high)';
        if (level > 25) return 'var(--water-med)';
        return 'var(--water-low)';
    };

    // Plant Card
    return (
        <div className="plant-card" style={{ backgroundColor: baseColor }}>

            <div className='card-data'>

                <div className='details-pane'>

                    <div className='plant-info'>

                        <div className='upper-card'>
                            <h3>{name}</h3>
                            {botanicalName && <h4>{botanicalName}</h4>}
                        </div>

                        <div className='lower-card'>
                            {notes && <div className="notes">{notes}</div>}

                            <div className="watering-info">
                                <i className="bi bi-clock"></i>
                                Last watered: {lastWatered ? new Date(lastWatered).toLocaleDateString() : "N/A"}
                            </div>

                            {harvestMonths && harvestMonths.length > 0 && (
                                <div className="harvest-months">
                                    <p><i className="bi bi-flower3"></i> Harvest Months:</p>
                                    <div className="month-bars">
                                        {harvestMonths.map((month) => (
                                            <span key={month} className="month-bar" title={month}>
                                                {month}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                    <div className='card-controls'>
                        <button 
                            className="btn water-button" 
                            onClick={handleWater}
                            aria-label="Water plant"
                        >
                            <i className="bi bi-droplet-fill"></i>
                            Water
                        </button>
                            
                        <button 
                            className="btn delete-button"
                            onClick={() => deletePlant(_id)}
                            aria-label="Delete plant"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>

                </div>

                <div className="status-bars">
                    <div className="water-indicator-wrapper">
                        <div className="water-indicator">
                            <div 
                                className="water-level" 
                                style={{
                                    height: `${waterLevel}%`,
                                    backgroundColor: getWaterLevelColor(waterLevel)
                                }}
                            ></div>
                        </div>
                        <span className="water-level-text">{waterLevel}%</span>
                    </div>
                </div>

            </div>

        </div>
    );
}


export default PlantCard;