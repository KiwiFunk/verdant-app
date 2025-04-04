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

/**
 * Calculates a position between two items (for reordering)
 * @param {number|null} beforePosition - Position of item before
 * @param {number|null} afterPosition - Position of item after
 * @returns {number} - New position between the two
 */
export const getPositionBetween = (beforePosition, afterPosition) => {
    // If inserting at the beginning
    if (beforePosition == null) {
      return afterPosition != null ? afterPosition / 2 : POSITION_INCREMENT;
    }
    
    // If inserting at the end
    if (afterPosition == null) {
      return beforePosition + POSITION_INCREMENT;
    }
    
    // Insert between two positions
    return (beforePosition + afterPosition) / 2;
  };
