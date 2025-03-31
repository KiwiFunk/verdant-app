import { useState } from 'react'
import Groups from './components/Groups'
import './App.css'
import CreatePlantModal from './components/CreatePlantModal'

function App() {

  // Manage states for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupId, setGroupId] = useState(null);

  // Functions for handling modal state
  const handleOpenModal = (id) => {
    setGroupId(id);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setGroupId(null);
    setIsModalOpen(false);
  }

  return (
    <div id="app-container">
      <Groups onAddPlant={handleOpenModal} />

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