import React from 'react'

const Login = () => {
  const clientCallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:5173/callback'
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const handleLogin = () => {
    window.location.assign(`${backendUrl}/login?returnTo=${encodeURIComponent(clientCallbackUrl)}`)
  }

  const handleLogout = () => {
    window.location.assign(`${backendUrl}/logout`)
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Login
