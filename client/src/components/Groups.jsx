import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlantCard from './PlantCard';
import PlantCardCompact from './PlantCardCompact';

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

    // update isCollapsed state of the group (PATCH)
    const toggleCollapse = async (groupId, currentState) => {
        try {
            await axios.patch(`${API_URL}/groups/${groupId}`, {
                isCollapsed: !currentState
            });
            onDataChange();
        } catch (error) {
            console.error('Error toggling group:', error);
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

    //Handle group settings menu toggle
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleSettingsMenu = (groupId, e) => {
        e.stopPropagation();                                                        // Prevent event bubbling
        setActiveMenu(activeMenu === groupId ? null : groupId);
    };
    
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);                       // If click outside menu, set activeMenu to null
        document.addEventListener('click', handleClickOutside);                     // Create event listener for clicks outside the menu
        return () => document.removeEventListener('click', handleClickOutside);     // Cleanup event listener
    }, []);

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
                    <div key={group._id} className="group-card">

                        {/* Group header with name and controls */}
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
                            {/* Group controls */}
                            <div id="group-controls">
                                <button className="toggle-view-btn" onClick={() => toggleCollapse(group._id, group.isCollapsed)}>
                                    <i className={`bi bi-${group.isCollapsed ? 'caret-down-fill' : 'caret-up-fill'}`}></i>
                                </button>

                                <span className="group-settings-menu" onClick={(e) => toggleSettingsMenu(group._id, e)}>
                                    <i className="bi bi-three-dots-vertical"></i>
                                </span>

                                {/* If activeMenu is equal to the group ID, show the dropdown */}
                                {activeMenu === group._id && (
                                    <div className="group-settings-dropdown">
                                        <span className="group-settings-item" onClick={() => onAddPlant(group._id)}>
                                            <i className="bi bi-plus-square"></i>
                                            <p>Add Plant</p>
                                        </span>
                                        <span className="group-settings-item" onClick={() => deleteGroup(group._id)}>
                                            <i className="bi bi-trash3"></i>
                                            <p>Delete Group</p>
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Group body */}
                        <div className="group-content">
                            {group.plants?.length ? (
                                <div className="plant-card-container">
                                    {/* Iterate through each of the groups Plant objects */}
                                    {group.plants.map(plant => (
                                        // Pass the plant as a prop to the PlantCard component
                                        group.isCollapsed ? (
                                            <PlantCardCompact
                                                key={plant._id}
                                                plant={plant}
                                                onDataChange={onDataChange}
                                            />
                                        ) : (
                                            <PlantCard
                                                key={plant._id}
                                                plant={plant}
                                                onDataChange={onDataChange}
                                            />
                                        )
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