import { useState, useEffect } from 'react';
import axios from 'axios';

function Groups() {

    const [groups, setGroups] = useState([]);               // State to hold the list of groups. [ array, func to update array ]
    const [newGroupName, setNewGroupName] = useState('');   // State to hold the new group name. [ string, func to update string ]
    const API_URL = 'http://localhost:5000/api';            // Base URL for the API.

    useEffect(() => {
        fetchGroups();                                        // Fetch groups when the component mounts.
    }, []);

    // Perform GET request to fetch all groups from the database.
    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${API_URL}/groups`);      // Store the response from the API.
            setGroups(response.data);                                   // Update the groups state with the response data.
        } catch (error) {
            console.error('Error fetching groups:', error);             // Log any errors to the console.
        }
    };

    return (
        <div>
            {/* Populate any existing groups */}
            {groups.length > 0 &&
                <div>
                    {groups.map(group => (
                        <div className="plant-group">
                            <h1>{group.name}</h1>
                        </div>
                    ))}
                </div>
            }
            {/* Display Create Group placeholder underneath any existing groups */}
            <div className="plant-group create-group">
                <h1>Create new group</h1>
            </div>
        </div>
    )
}

export default Groups;