import { useDroppable } from '@dnd-kit/core';

// Create a wrapper to define a droppable area using DnD Kit
function DroppableArea({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({
        id
    });

    return (
        <div 
            ref={setNodeRef} 
            style={{ 
                margin: isOver ? '14px' : '0px',
                background: isOver ? 'rgba(135, 151, 109, 0.1)' : 'transparent',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.2s'
            }}
        >
            {children}
        </div>
    );
}

export default DroppableArea;