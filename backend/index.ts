import express from 'express'
import { gyms as gymsData } from './src/database/data'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.get('/gyms', (req, res) => {
  try {
    res.json(gymsData)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gyms' })
  }
});

app.get('/gyms/:id', (req, res) => {
  try {
    console.log('GET /gyms/:id hit, id:', req.params.id);
console.log('Gyms data length:', gymsData.length);
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
});

app.post('/gyms/:id/reviews', (req, res) => {
  try {
    console.log('POST /gyms/:id/reviews hit, id:', req.params.id);
console.log('Request body:', req.body);
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
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})