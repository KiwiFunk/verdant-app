import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlantCard from './PlantCard';

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

    // PATCH request to update the group name
    const updateGroupName = async (groupId) => {
        if (!editingName.trim()) return;    // If name empty, break out of function
        try {
            await axios.patch(`${API_URL}/groups/${groupId}`, { name: editingName });
            onDataChange();                 // Refresh data from parent
            setEditingId(null);             // Reset editing state
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };


    // DELETE request to remove a group (Plants are also deleted server-side)
    const deleteGroup = async (groupId) => {
        try {
            await axios.delete(`${API_URL}/groups/${groupId}`);     // Delete group by ID
            onDataChange();                                         // Refresh groups     
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    // Functions to handle editing states in the group HTML body
    const handleDoubleClick = (group) => {
        setEditingId(group._id);
        setEditingName(group.name);
    };

    const handleKeyDown = (e, groupId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateGroupName(groupId);
        } else if (e.key === 'Escape') {
            setEditingId(null);
        }
    };

    return (
        <div className="groups-container">
            <div className="groups-header">
                <button className="add-group-btn" onClick={createGroup}>
                    New Group
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>

            <div className="groups-grid">
                {groups.map(group => (
                    <div key={group._id} className="group-card">
                        <div className="group-header">
                            {editingId === group._id ? (
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => updateGroupName(group._id)}
                                    onKeyDown={(e) => handleKeyDown(e, group._id)}
                                    className="group-name-input"
                                />
                            ) : (
                                <h3 onDoubleClick={() => handleDoubleClick(group)}>
                                    {group.name}
                                </h3>
                            )}
                            <div id="group-controls">
                                <button className="add-plant-btn" onClick={() => onAddPlant(group._id)}>
                                    <i className="bi bi-plus-square"></i>
                                </button>

                                <button className="delete-group-btn" onClick={() => deleteGroup(group._id)}>
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                        </div>

                        <div className="group-content">
                            {group.plants?.length ? (
                                <div className="plant-card-container">
                                    {/* Iterate through each of the groups Plant objects */}
                                    {group.plants.map(plant => (
                                        // Pass the plant as a prop to the PlantCard component
                                        <PlantCard 
                                            key={plant._id}
                                            plant={plant}
                                            onDataChange={onDataChange} // Pass the function to refresh data
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-group">
                                    <i className="bi bi-flower1"></i>
                                    <p>No plants yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Groups;