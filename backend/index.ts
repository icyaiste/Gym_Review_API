import express from 'express'
import cors from 'cors'
import { authMiddleware } from './auth/auth'
import { gyms as gymsData } from './src/database/data'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// CORS configuration - must be before auth middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(authMiddleware)

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/login', (req, res) => {
  // The auth middleware from express-openid-connect handles login
  // This route is automatically provided, but we ensure it's accessible
  res.oidc.login({
    returnTo: req.query.returnTo as string || process.env.AUTH0_REDIRECT_URI || 'http://localhost:5173/callback',
  })
})

app.get('/logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.AUTH0_POST_LOGOUT_REDIRECT || 'http://localhost:5173',
  })
})

app.get('/gyms', (req, res) => {
  try {
    res.json(gymsData)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gyms' })
  }
})

// Profile endpoint - requires authentication
app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user)
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})