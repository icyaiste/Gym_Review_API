import { Navigate, Route, Routes } from 'react-router-dom'
import Main from './Layout/Main'
import Callback from './components/Callback/Callback'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Profile from './components/Profile/Profile'


function App() {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Navigate to="/" replace />} />
        <Route path="profile" element={<Profile />} />
        <Route path="callback" element={<Callback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
