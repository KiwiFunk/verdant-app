/**
 * Position utility functions for spatial positioning
 */

// The gap between positions for new items
export const POSITION_INCREMENT = 10000;

/**
    * Calculates a position for a new item to be added at the end
    * @param {Array} items - Array of items with position property
    * @returns {number} - Calculated position value
*/
export const getPositionForNewItem = (items = []) => {
  if (!items || items.length === 0) return POSITION_INCREMENT;
  
  // Get highest existing position
  let maxPosition = 0;
    for (let item of items) {
        if (typeof item.position === 'number') {
            maxPosition = Math.max(maxPosition, item.position);
        }
    }
  
  return maxPosition + POSITION_INCREMENT;
};

