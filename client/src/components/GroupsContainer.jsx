import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    DndContext, 
    useSensor,
    useSensors,
    PointerSensor 
} from '@dnd-kit/core';

import Group from './Group';
import DroppableArea from './DropAreaWrapper';

function Groups({ groups, onAddPlant, onDataChange }) {
    
    const API_URL = 'http://localhost:5000/api';

    // Sort our groups by position (if available)
    const sortedGroups = [...groups].sort((a, b) => (a.position || 0) - (b.position || 0));

    // Set up DnD kit sensors.
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }           // Start drag after moving 8px
        })
    );

    //Send POST request to create a new group
    const createGroup = async () => {
        try {
            await axios.post(`${API_URL}/groups`, { name: 'New Group' });
            onDataChange();         // Call the function from props to refresh the data (fetchAppData)
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    
    // Handle the drag end event
    const handleDragEnd = async (event) => {
        const { active, over } = event;
    
        // Exit if no valid drop target or dropped on itself
        if (!over || active.id === over.id) return;
    
        try {
            const draggedId = active.id;
            const overId = over.id;
    
            console.log(`Moving group ${draggedId} to position of ${overId}`);
    
            // Find indices of dragged item and drop target
            const draggedIndex = sortedGroups.findIndex(g => g._id === draggedId);
            const targetIndex = sortedGroups.findIndex(g => g._id === overId);
    
            // Determine reordering direction
            const isDraggingUp = draggedIndex > targetIndex;
    
            // Calculate beforeId and afterId
            const beforeId = isDraggingUp
                ? targetIndex > 0 ? sortedGroups[targetIndex - 1]._id : null
                : overId;
            const afterId = isDraggingUp
                ? overId
                : targetIndex < sortedGroups.length - 1 ? sortedGroups[targetIndex + 1]._id : null;
    
            console.log('API call with:', { groupId: draggedId, beforeId, afterId });
    
            // Call the API to reorder
            await axios.patch(`${API_URL}/groups/reorder`, { groupId: draggedId, beforeId, afterId });
    
            // Refresh data to reflect the new order
            onDataChange();
        } catch (error) {
            console.error('Reorder error:', error.response?.data || error.message);
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

            {groups.length? (
                <DndContext 
                    sensors={sensors}
                    onDragEnd={(event) => {
                        // Check what type of element is being dragged
                        const { active } = event;
                        
                        // If data.current doesn't exist, assume it's a group (for backward compatibility)
                        const isDraggingGroup = !active.data?.current || 
                            active.data.current.type === 'group' ||
                            !active.data.current.type;
                            
                        if (isDraggingGroup) {
                            // Handle group drag with existing function
                            handleDragEnd(event);
                        } else {
                            // Handle plant drag with new function
                            handlePlantDragEnd(event);
                        }
                    }}
                >
                    <div className="groups-grid">
                        {sortedGroups
                            .map(group => (
                                <DroppableArea key={group._id} id={group._id}>
                                    <Group
                                        key={group._id}
                                        group={group}
                                        onAddPlant={onAddPlant}
                                        onDataChange={onDataChange}
                                    />
                                </DroppableArea>
                            ))}
                    </div>
                </DndContext>
            ) : (
                <div className="empty-group">
                    <i className="bi bi-folder2-open"></i>
                    <p>Create a new group to get started!</p>
                </div>
            )}

        </div>
    );
}

export default Groups;