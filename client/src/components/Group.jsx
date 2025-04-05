import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlantCard from './PlantCard';
import PlantCardCompact from './PlantCardCompact';
import { 
    useDraggable,
    DndContext, 
    useSensor, 
    useSensors, 
    PointerSensor 
} from '@dnd-kit/core';
import DroppableArea from './DropAreaWrapper';

function Group({ group, onAddPlant, onDataChange }) {

    //Sort plant objects by their position field
    const sortedPlants = [...group.plants].sort((a, b) => (a.position || 0) - (b.position || 0)); 

    // DnD Kit for drag-and-drop functionality
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: group._id
    });

    // Create sensor for DnD Kit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        })
    );
    
    // States to manage groups and handle their editing states
    const [editingId, setEditingId] = useState(null);   
    const [editingName, setEditingName] = useState('');
    const editInputRef = useRef(null);
    
    const API_URL = 'http://localhost:5000/api';

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

    // Handle plant drag within group
    const handlePlantDragEnd = async (event) => {
        const { active, over } = event;
    
        // Exit if no valid drop target or dropped on itself
        if (!over || active.id === over.id) return;
    
        try {
            const draggedId = active.id; // The plant being dragged
            const targetId = over.id;   // The plant it was dropped onto
    
            console.log(`Reordering plant ${draggedId} to position of ${targetId}`);
    
            // Find indices of dragged plant and target plant
            const draggedIndex = sortedPlants.findIndex(p => p._id === draggedId);
            const targetIndex = sortedPlants.findIndex(p => p._id === targetId);
    
            // Determine reordering direction
            const isDraggingUp = draggedIndex > targetIndex;
    
            // Calculate beforeId and afterId based on drag direction
            const beforeId = isDraggingUp
                ? targetIndex > 0 ? sortedPlants[targetIndex - 1]._id : null
                : targetId;
            const afterId = isDraggingUp
                ? targetId
                : targetIndex < sortedPlants.length - 1 ? sortedPlants[targetIndex + 1]._id : null;
    
            console.log('API call with:', { plantId: draggedId, beforeId, afterId });
    
            // Call the reordering API
            await axios.patch(`${API_URL}/plants/reorder`, { plantId: draggedId, beforeId, afterId });
    
            // Refresh the data to reflect the new order
            onDataChange();
        } catch (error) {
            console.error('Error reordering plant:', error.response?.data || error.message);
        }
    };

    return (
        <div className="group-card"
            ref={setNodeRef}                        // Set group card as draggable element
            style={{                                // Basic styling for drag state (Move to CSS later)
                opacity: isDragging ? 0.5 : 1, 
                position: 'relative' 
            }}
        >

            {/* Group header with name and controls */}
            <div className="group-header" {...attributes} {...listeners}>

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

                <div className="content-spacer"></div>

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
                    <DndContext sensors={sensors} onDragEnd={handlePlantDragEnd}>
                        <div className="plant-card-container">
                            {sortedPlants
                                .map(plant => (
                                    // Pass the plant as a prop to the PlantCard component
                                    <DroppableArea key={plant._id} id={plant._id}>
                                        {group.isCollapsed ? (
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
                                                onEditPlant={onAddPlant}
                                            />
                                        )}
                                    </DroppableArea>
                                ))}
                        </div>
                    </DndContext>
                ) : (
                    <div className="empty-group">
                        <i className="bi bi-flower1"></i>
                        <p>No plants yet</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Group;