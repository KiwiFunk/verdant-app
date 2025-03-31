import { useState, useEffect } from 'react'
import axios from 'axios'
import Groups from './components/Groups'
import './App.css'

function App() {
  return (
    <div id="app-container">
      <Groups onAddPlant={handleOpenModal} />
    </div>
  )
}

export default App