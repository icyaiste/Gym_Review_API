import express from 'express'
import cors from 'cors'
import { authMiddleware } from './auth/auth'
import dotenv from 'dotenv'
import openidConnect from 'express-openid-connect'
import prisma from './src/database/db'

dotenv.config()

const { requiresAuth } = openidConnect
const app = express()
const port = process.env.PORT || 3000

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

app.get('/gyms', async (req, res) => {
  try {
    const gyms = await prisma.gym.findMany({
      include: { reviews: true }
    })
    res.json(gyms)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gyms' })
  }
})

app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user)
})

app.get('/me', (req, res) => {
  res.json({ isAuthenticated: req.oidc.isAuthenticated() })
})

app.post('/gyms', requiresAuth(), async (req, res) => {
  try {
    const { name, city, address } = req.body
    const newGym = await prisma.gym.create({
      data: { name, city, address },
      include: { reviews: true }
    })
    res.status(201).json(newGym)
  } catch (error) {
    res.status(500).json({ message: 'Error adding gym' })
  }
})

app.get('/gyms/:id', async (req, res) => {
  try {
    const gym = await prisma.gym.findUnique({
      where: { id: req.params.id as string },
      include: { reviews: true }
    })
    if (gym) {
      res.json(gym)
    } else {
      res.status(404).json({ message: 'Gym not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gym' })
  }
})

app.post('/gyms/:id/reviews', requiresAuth(), async (req, res) => {
  try {
    const gymId = req.params.id as string
    const { author, rating, comment } = req.body

    const gym = await prisma.gym.findUnique({ where: { id: gymId } })
    if (!gym) {
      res.status(404).json({ message: 'Gym not found' })
      return
    }

    const newReview = await prisma.review.create({
      data: {
        author,
        rating,
        comment,
        createdAt: new Date().toISOString().slice(0, 10),
        gymId,
      }
    })
    res.status(201).json(newReview)
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' })
  }
})

export { app }