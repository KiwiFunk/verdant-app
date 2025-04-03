import { useState } from 'react';
import axios from 'axios';
import './CreatePlantModal.css';

function CreatePlantModal({ groupId, groups, isOpen, onClose, plantID }) {
    // State to hold form data for new plant
    const [formData, setFormData] = useState({
        name: '',
        botanicalName: '',
        notes: '',
        waterFrequency: 7,           // Default to weekly watering
        harvestMonths: [],
        baseColor: '#2c5530',
        group: groupId || groups[0]?._id        // If null, init with first group ID
    });

    let isEditMode = false;         // Flag to check if in edit mode

    // If called as edit, pre-fill the form with plant data
    if (plantID) {
        // Fetch plant data to pre-fill the form
        setFormData({
            ...formData,
            name: plantID.name,
            botanicalName: plantID.botanicalName,
            notes: plantID.notes,
            waterFrequency: plantID.waterFrequency,
            harvestMonths: plantID.harvestMonths,
            baseColor: plantID.baseColor,
            group: plantID.group._id
        });
        isEditMode = true;             // Set edit mode flag
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/plants', {
                ...formData,                            // Spread the form data into the request body
                group: groupId || formData.group        // If no group is provided, use the one from formData
            });
            console.log('Plant created:', response.data);
            onClose(response.data);                     // Pass the new plant back to parent
        } catch (error) {
            console.error('Error creating plant:', error);
        }
    };

    if (!isOpen) return null;

    // Month selection logic
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const handleMonthChange = (e) => {
        const selectedMonths = Array.from(document.querySelectorAll('.month-checkbox:checked'))
            .map(checkbox => checkbox.value);
        setFormData(prev => ({
            ...prev,
            harvestMonths: selectedMonths
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    { isEditMode ? <h2>Add New Plant</h2> : <h2>header-main</h2> }
                    <button className="close-btn" onClick={() => onClose(null)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Plant Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Botanical Name (Optional)"
                            value={formData.botanicalName}
                            onChange={(e) => setFormData({...formData, botanicalName: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            placeholder="Notes (Optional)"
                            className="notes-textarea"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            rows="3"
                        />
                    </div>

                    {groupId === null && (
                    <div className="form-group">
                        <label>Plant Group</label>
                        <select
                            name="group"
                            id="group"
                            className="water-frequency-select"
                            value={formData.group}
                            onChange={(e) => setFormData({...formData, group: e.target.value})}
                            required
                        >
                            {/* Iterate over current groups and create an option for each */}
                            {groups.map(group => (
                                <option key={group._id} value={group._id}>
                                    {group.name}
                                </option>
                            ))}

                        </select>
                    </div>
                    )}

                    <div className="form-group">
                        <label>Watering Frequency</label>
                        <select
                            name="waterFrequency"
                            id="waterFrequency"
                            className="water-frequency-select"
                            value={formData.waterFrequency}
                            onChange={(e) => setFormData({ ...formData, waterFrequency: parseInt(e.target.value) })}
                            required
                        >
                            <option value="1">Daily (Debug)</option>
                            <option value="7">Weekly</option>
                            <option value="14">Fortnightly</option>
                            <option value="28">Monthly</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Harvest Months</label>
                        <div className="month-selector">
                            {months.map(month => (
                                <label key={month} className="month-toggle">
                                    <input
                                        type="checkbox"
                                        value={month}
                                        className="month-checkbox"
                                        onChange={handleMonthChange}
                                    />
                                    <span className="month-label">{month.toUpperCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group color-selector">
                        {Object.entries({
                            Red: "var(--red)",
                            Orange: "var(--orange)",
                            Yellow: "var(--yellow)",
                            Green: "var(--green)",
                            Blue: "var(--blue)",
                            Purple: "var(--purple)"
                        }).map(([color, hex]) => (
                            <label key={color} className="color-toggle">
                                <input
                                    type="radio"
                                    name="plant_color"
                                    value={hex}
                                    className="color-checkbox"
                                    checked={formData.baseColor === hex}
                                    onChange={(e) => setFormData({...formData, baseColor: e.target.value})}
                                />
                                <span 
                                    className="color-label" 
                                    style={{ backgroundColor: hex }}
                                >
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn cancel-btn" onClick={() => onClose(null)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn submit-btn">
                            Add Plant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePlantModal;