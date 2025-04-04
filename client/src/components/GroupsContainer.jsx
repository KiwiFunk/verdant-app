import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Group from './Group';

function Groups({ groups, onAddPlant, onDataChange }) {
    
    // States to manage groups and handle their editing states
    const [editingId, setEditingId] = useState(null);   
    const [editingName, setEditingName] = useState('');
    const editInputRef = useRef(null);
    
    const API_URL = 'http://localhost:5000/api';


    //Send POST request to create a new group
    const createGroup = async () => {
        try {
            await axios.post(`${API_URL}/groups`, { name: 'New Group' });
            onDataChange();         // Call the function from props to refresh the data (fetchAppData)
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <div className="groups-container">
            <div className="groups-header">
                <button className="add-group-btn" onClick={createGroup}>
                    <i className="bi bi-folder-plus"></i>
                    <p>New Group</p>
                </button>

                <button className="add-group-btn" onClick={() => onAddPlant(null)}>
                    <i className="bi bi-plus-square"></i>
                    <p>Add Plant</p>
                </button>
            </div>

            <div className="groups-grid">
                {groups.map(group => (
                    <Group
                        key={group._id}
                        group={group}
                        onAddPlant={onAddPlant}
                        onDataChange={onDataChange}
                    />
                ))}
            </div>

        </div>
    );
}

export default Groups;