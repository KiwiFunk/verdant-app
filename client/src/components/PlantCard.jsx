import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function PlantCard({ plant }) {
    // Destructure the plant object from the prop to get the data from the fields.
    const {
        name,
        botanicalName,
        notes,
        waterLevel,
        lastWatered,
        harvestMonths,
        baseColor
    } = plant;


    return (
        <div className="plant-card">
            <h2>{name}</h2>
            <p>{botanicalName}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    );

}

export default PlantCard;