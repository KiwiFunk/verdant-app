import { useState, useEffect } from 'react'; // Removed unused useRef
import axios from 'axios';
import './PlantCard.css';
import { useDraggable } from '@dnd-kit/core';

function PlantCardCompact({ plant, onDataChange }) {
    // Destructure the plant object from the prop to get the data from the fields
    const {
        _id,                   // MongoDB ID for object
        name,                  // Common name of the plant
        botanicalName,         // Scientific name of the plant
        waterFrequency,        // Watering frequency in days
        lastWatered,
        baseColor
    } = plant;

    // Set plant item as draggable
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: _id,
        data: {
            type: 'plant',      
            plant
        }
    });

    //Calculate water level from current date, last watered date, and water frequency
    const calculateWaterLevel = () => {
        const now = new Date();
        const lastWateredDate = new Date(lastWatered);
        const timeDiff = now - lastWateredDate;                 // Difference in milliseconds

        const minsElapsed = Math.round(timeDiff / (1000 * 60)); // Convert to mins (Date uses ms by default)
        const wateringInterval = waterFrequency * 24 * 60;      // Convert days to minutes

        const level = Math.max(0, 100 - Math.round((minsElapsed / wateringInterval) * 100)); 
        return level || 0;                                      // Return 0 if NaN or negative
    };

    const [waterLevel, setWaterLevel] = useState(calculateWaterLevel());    // State to hold water level 

    // Set up an interval to update the water level every 15 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setWaterLevel(calculateWaterLevel());
        }, 15 * 60 * 1000); // 15 minutes in milliseconds

        return () => clearInterval(interval);       // Cleanup interval on unmount
    }, [lastWatered, waterFrequency]);              // Recalculate when these change

    // Plant Card
    return (
        <div 
            className="plant-card" 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{ 
                backgroundColor: baseColor, 
                opacity: isDragging ? 0.5 : 1,
            }}
        >

            <div className='card-data'>

                <div className='details-pane'>

    
                    <h4>{name}</h4>
                    {botanicalName && <h5 className='botanical-name'>{botanicalName}</h5>}
                    
                </div>

                <div className="status-bars">
                    <div className="water-indicator-wrapper">
                        <i className="bi bi-droplet-fill"></i><span className="water-level-text">{waterLevel}%</span>
                    </div>
                </div>

            </div>

        </div>
    );
}


export default PlantCardCompact;