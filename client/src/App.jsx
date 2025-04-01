import { useState, useEffect } from 'react'
import axios from 'axios'
import Groups from './components/Groups'
import CreatePlantModal from './components/CreatePlantModal'
import './App.css'

function App() {

  // States to handle app data and global loading/error states
  const [appData, setAppData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manage states for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  // Fetch all application data (Groups and their plants) ((GET))
  const fetchAppData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/groups');
      setAppData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Functions for handling modal state
  const handleOpenModal = (id) => {
    setGroupId(id);
    setIsModalOpen(true);
  }

  const handleCloseModal = (newPlant) => {
    if (newPlant) {
      setShouldRefresh(true); // Trigger groups refresh when plant is created
    }
    setGroupId(null);
    setIsModalOpen(false);
  }

  //UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchAppData();
  }
  , []);

  // Handle loading and error states
  // Show loading spinner or error message if applicable
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div id="app-container">
      <Groups 
        groups={appData}
        onAddPlant={handleOpenModal}
        onDataChange={fetchAppData}
      />

      {/* Handle Plant Creation Modal */}
      {isModalOpen && (
        <CreatePlantModal
          groupId={groupId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App