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
  const [modalData, setModalData] = useState({
    isOpen: false,
    groupId: null,
    plantToEdit: null
});

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
  const handleOpenModal = (groupId = null, plantToEdit = null) => {
    setModalData({
      isOpen: true,
      groupId,
      plantToEdit
    });
  };

  const handleCloseModal = async (shouldRefresh = false) => {
    if (shouldRefresh) {
        await fetchAppData();
    }
    setModalData({
        isOpen: false,
        groupId: null,
        plantToEdit: null
    });
};

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
      {modalData.isOpen && (
        <CreatePlantModal
          groupId={modalData.groupId}
          plantToEdit={modalData.plantToEdit}
          groups={appData}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App