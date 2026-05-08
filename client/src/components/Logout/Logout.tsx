import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()

  const handleReturnHome = () => {
    navigate('/')
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>You've been logged out</h1>
      <p>Your session has ended. See you next time!</p>
      <button onClick={handleReturnHome}>Return to Home</button>
    </div>
  )
}

export default Logout
