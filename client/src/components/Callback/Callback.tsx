import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Callback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>Processing login...</p>
    </div>
  )
}

export default Callback
