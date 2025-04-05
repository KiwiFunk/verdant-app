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

    //Temp event handler for dragend
    const handleDragEnd = (event) => {
        console.log('Drag ended:', event);
        // We'll implement real logic later
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
                <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                    <div className="groups-grid">
                        {[...groups]
                            .sort((a, b) => (a.position || 0) - (b.position || 0))
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