import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Groups({ onAddPlant }) {
    const [groups, setGroups] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const editInputRef = useRef(null);
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${API_URL}/groups`);
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const createGroup = async () => {
        try {
            const response = await axios.post(`${API_URL}/groups`, { name: 'New Group' });
            setGroups(prev => [...prev, response.data]);
            setEditingId(response.data._id);
            setEditingName('New Group');
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const updateGroupName = async (groupId) => {
        if (!editingName.trim()) return;    // If the name is empty, do not proceed. Use trim() !whitespace.
        try {
            await axios.patch(`${API_URL}/groups/${groupId}`, { name: editingName });
            setGroups(prev => prev.map(group => 
                group._id === groupId ? { ...group, name: editingName } : group
            ));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            await axios.delete(`${API_URL}/groups/${groupId}`);
            setGroups(prev => prev.filter(group => group._id !== groupId));
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

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
                <h2>My Plant Groups</h2>
                <button className="add-group-btn" onClick={createGroup}>
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
                                <div className="plants-grid">
                                    {/* Iterate through each of the groups Plant objects */}
                                    {group.plants.map(plant => (
                                        // Pass the plant as a prop to the PlantCard component
                                        <PlantCard 
                                            key={plant._id}
                                            plant={plant}
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