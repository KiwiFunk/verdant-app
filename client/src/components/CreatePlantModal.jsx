import { useState } from 'react';
import axios from 'axios';
import './CreatePlantModal.css';

function CreatePlantModal({ groupId, isOpen, onClose }) {
    // State to hold form data for new plant
    const [formData, setFormData] = useState({
        name: '',
        botanicalName: '',
        notes: '',
        harvestMonths: [],
        baseColor: '#2c5530'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/plants', {
                ...formData,                // Spread the form data into the request body
                waterLevel: 0,              // Assume new plants have not been watered yet
                group: groupId              // Associate the new plant with the selected group
            });
            console.log('Plant created:', response.data);
            onClose(response.data);         // Pass the new plant back to parent
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
                    <h2>Add New Plant</h2>
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
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            rows="3"
                        />
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
                            Red: "#ff4444",
                            Orange: "#FF7635",
                            Yellow: "#ffdd44",
                            Green: "#7f9261",
                            Blue: "#44aaff",
                            Purple: "#aa44ff"
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