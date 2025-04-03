import { useState, useEffect } from 'react'
import axios from 'axios'
import Groups from './components/Groups'
import Header from './components/Header'
import CreatePlantModal from './components/CreatePlantModal'
import LoadingOverlay from './components/LoadingOverlay'
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

  const handleCloseModal = async (newPlant) => {
    if (newPlant) {
      await fetchAppData(); // Trigger groups refresh when plant is created
    }
    setGroupId(null);
    setIsModalOpen(false);
  }

  //UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchAppData();
  }
  , []);

  // Handle loading and error states (Causes flickering, reimplement later with a delay)
  //if (loading) return <LoadingOverlay />; 

  // Replace with a proper error page/component
  if (error) return <div className="error">{error}</div>;

  return (
    <div id="app-container">

      <Header />
      <Groups 
        groups={appData}
        onAddPlant={handleOpenModal}
        onDataChange={fetchAppData}
      />

      {/* Handle Plant Creation Modal */}
      {isModalOpen && (
        <CreatePlantModal
          groupId={groupId}
          groups={appData}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App