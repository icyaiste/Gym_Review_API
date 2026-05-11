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

app.get('/gyms/:id', (req, res) => {
  try {
    console.log('GET /gyms/:id hit, id:', req.params.id)
    console.log('Gyms data length:', gymsData.length)
    const gymId = req.params.id
    const gym = gymsData.find(gym => gym.id === gymId)
    if (gym) {
      res.json(gym)
    } else {
      res.status(404).json({ message: 'Gym not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gym' })
  }
})

app.post('/gyms/:id/reviews', (req, res) => {
  try {
  console.log('POST /gyms/:id/reviews hit, id:', req.params.id)
  console.log('Request body:', req.body)
    const gymId = req.params.id
    const { author, rating, comment } = req.body
    const gym = gymsData.find(gym => gym.id === gymId)

    if (gym) {
      const newReview = {
        id: `r-${gymId.slice(4)}-${gym.reviews.length + 1}`,
        author,
        rating,
        comment,
        createdAt: new Date().toISOString().slice(0, 10)
      }
      gym.reviews.push(newReview)
      res.status(201).json(newReview)
    } else {
      res.status(404).json({ message: 'Gym not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})