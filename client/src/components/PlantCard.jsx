<div class="plant-card" style={`background-color: ${plant.base_color};`}>
    
    <div id="card-back" class="hidden">
        <SettingsCard plant={plant} />
    </div>
    
    <div id="card-front" class="card-data">

        <div class="details-pane">

            <div class="plant-info">
                <div class="upper-card">
                    <h3>{plant.name}</h3>
                    <h4>{plant.botanical_name}</h4>
                </div>
                <div class="lower-card">
                    {plant.notes &&(
                        <div class="notes">{plant.notes}</div>
                    )}                   
                    <div class="watering-info">
                        <i class="fas fa-clock"></i>
                        Last watered: {plant.last_watered ? 
                        new Date(plant.last_watered).toLocaleDateString() : 
                        "N/A"}
                    </div>
                    {/* If harvest_months is truthy and the length is greater than 0 */}
                    {plant.harvest_months && plant.harvest_months.length > 0 &&(
                        <div class="harvest-months">
                            <p><i class="fas fa-seedling"></i> Harvest Months:</p>
                            <div class="month-bars">
                                {plant.harvest_months.split(',').filter(month => month.length > 0).map((month) => (
                                    <span class="month-bar" title={month}>
                                        {month}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div class="card-controls">
                <button class="btn water-button" data-id={plant.id} aria-label="Water plant">
                    <i class="fas fa-tint"></i>
                    Water
                </button>
                <button class="btn edit-button" data-id={plant.id} aria-label="Edit plant">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </div>

        <div class="status-bars">
            <div class="water-indicator-wrapper">
                <div class="water-indicator">
                    <div 
                        class="water-level" 
                        data-id={plant.id} 
                        style={`height: ${plant.water_level}%;
                               background-color: ${
                                   plant.water_level > 50 ? '#27b0ff' :
                                   plant.water_level > 25 ? '#ffaa44' : '#ff4444'
                               }`}
                    ></div>
                </div>
                <span class="water-level-text">{plant.water_level}%</span>
            </div>
        </div>
    </div>
</div>