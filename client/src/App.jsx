import { useState, useEffect } from 'react'
import axios from 'axios'
import Groups from './components/Groups'
import './App.css'

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
          onOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App