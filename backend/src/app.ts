import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authMiddleware } from '../auth/auth'
import { gyms as gymsSeedData } from './database/data'

dotenv.config()

type GymReview = {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

type Gym = {
  id: string
  name: string
  city: string
  address: string
  reviews: GymReview[]
}

function cloneGyms(): Gym[] {
  return gymsSeedData.map((gym) => ({
    ...gym,
    reviews: gym.reviews.map((review) => ({ ...review })),
  }))
}

function isAuthenticated(req: any): boolean {
  if (typeof req?.oidc?.isAuthenticated === 'function' && req.oidc.isAuthenticated()) {
    return true
  }

  if (process.env.NODE_ENV === 'test' && req.headers.authorization === 'Bearer test-token') {
    return true
  }

  return false
}

function requireAuth(req: any, res: any, next: any) {
  if (isAuthenticated(req)) {
    return next()
  }

  return res.status(401).json({ message: 'Unauthorized' })
}

function nextGymId(gyms: Gym[]): string {
  const nextNumber = gyms.length + 1
  return `gym-${String(nextNumber).padStart(3, '0')}`
}

export function createApp() {
  const app = express()
  const gymsData = cloneGyms()

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

  app.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
      res.json(req.oidc.user)
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  })

  app.get('/gyms/:id', (req, res) => {
    try {
      const gymId = req.params.id
      const gym = gymsData.find((entry) => entry.id === gymId)

      if (gym) {
        res.json(gym)
      } else {
        res.status(404).json({ message: 'Gym not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gym' })
    }
  })

  app.post('/gyms', requireAuth, (req, res) => {
    try {
      const { name, city, address } = req.body

      const newGym: Gym = {
        id: nextGymId(gymsData),
        name,
        city,
        address,
        reviews: [],
      }

      gymsData.push(newGym)
      res.status(201).json(newGym)
    } catch (error) {
      res.status(500).json({ message: 'Error creating gym' })
    }
  })

  app.post('/gyms/:id/reviews', requireAuth, (req, res) => {
    try {
      const gymId = req.params.id
      const { author, rating, comment } = req.body
      const gym = gymsData.find((entry) => entry.id === gymId)

      if (gym) {
        const newReview = {
          id: `r-${gymId.slice(4)}-${gym.reviews.length + 1}`,
          author,
          rating,
          comment,
          createdAt: new Date().toISOString().slice(0, 10),
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

  return app
}