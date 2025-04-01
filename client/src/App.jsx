import { useState } from 'react'
import Groups from './components/Groups'
import './App.css'
import CreatePlantModal from './components/CreatePlantModal'

function App() {

  // Manage states for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

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

  return (
    <div id="app-container">
      <Groups 
        onAddPlant={handleOpenModal}
        shouldRefresh={shouldRefresh}
        onRefreshComplete={() => setShouldRefresh(false)}
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