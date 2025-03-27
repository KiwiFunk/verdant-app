import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/groups`, { name: newGroupName });
      setNewGroupName('');
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(`${API_URL}/groups/${groupId}`);
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  return (
    <div className="app">
      <h1>Plant Groups</h1>
      
      <form onSubmit={createGroup}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button type="submit">Create Group</button>
      </form>

      {groups.length > 0 ? (
        <div className="groups">
          {groups.map(group => (
            <div key={group._id} className="group">
              <h2>{group.name}</h2>
              <button onClick={() => deleteGroup(group._id)}>Delete Group</button>
              {group.plants && group.plants.length > 0 ? (
                <div className="plants">
                  {group.plants.map(plant => (
                    <div key={plant._id} className="plant">
                      {plant.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No plants in this group</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You have no groups, create one to get started!</p>
      )}
    </div>
  )
}

export default App