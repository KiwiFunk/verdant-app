import { useState } from 'react';
import axios from 'axios';
import './CreatePlantModal.css';

function CreatePlantModal({ groupId, isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        botanicalName: '',
        notes: '',
        waterLevel: 100,
        harvestMonths: [],
        baseColor: '#2c5530'
    });

    

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
                        <label>Base Color</label>
                        <input
                            type="color"
                            value={formData.baseColor}
                            onChange={(e) => setFormData({...formData, baseColor: e.target.value})}
                        />
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