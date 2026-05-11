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

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})