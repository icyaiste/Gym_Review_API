import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Header = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
  const clientCallbackUrl = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:5173/callback'

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${backendUrl}/profile`, { withCredentials: true })
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [backendUrl])

  const handleLogin = () => {
    window.location.assign(`${backendUrl}/login?returnTo=${encodeURIComponent(clientCallbackUrl)}`)
  }

  const handleLogout = () => {
    window.location.assign(`${backendUrl}/logout`)
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand-link">
        <span className="brand-dot"></span>
        Iron rating
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        {isLoggedIn ? (
          <button className="nav-auth-button" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="nav-auth-button" onClick={handleLogin}>Login</button>
        )}
      </nav>
    </header>
  )
}

export default Header
