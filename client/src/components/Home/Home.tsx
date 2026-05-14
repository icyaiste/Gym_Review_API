import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

type Gym = {
  id: string
  name: string
  city?: string
  address?: string
  image?: string
  reviews?: Review[]
}

const Home = () => {
  const navigate = useNavigate()

  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const getAverageRating = (gym: Gym) => {
    const ratings = gym.reviews?.map((review) => review.rating).filter((rating): rating is number => typeof rating === 'number') ?? []
    if (ratings.length === 0) return null

    const total = ratings.reduce((sum, rating) => sum + rating, 0)
    return total / ratings.length
  }

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await axios.get(`${backendUrl}/gyms`)
        setGyms(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGyms()
  }, [backendUrl])

  if (loading) return <p>Loading gyms...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1> Gym Reviews</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {gyms.map((gym) => {
          const averageRating = getAverageRating(gym)
          const reviewCount = gym.reviews?.length ?? 0

          return (
          <div
            key={gym.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {gym.image ? (
              <img
                src={gym.image}
                alt={gym.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f2f2f2' }} />
            )}
            <div style={{ padding: '16px' }}>
              <h3>{gym.name}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {gym.city || gym.address || 'Location unavailable'}
              </p>
              <p style={{ fontSize: '14px' }}>{gym.address || 'No address listed'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <span style={{ fontWeight: 'bold' }}>Gym</span>
                <span>
                  {averageRating ? averageRating.toFixed(1) : 'N/A'} ({reviewCount} reviews)
                </span>
              </div>
              <button onClick={() => navigate(`/gym/${gym.id}`)}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                View Details
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
