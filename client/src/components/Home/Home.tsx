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

type NewGymForm = {
  name: string
  city: string
  address: string
}

const Home = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [formData, setFormData] = useState<NewGymForm>({ name: '', city: '', address: '' })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [formError, setFormError] = useState<string | null>(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const getAverageRating = (gym: Gym) => {
    const ratings = gym.reviews?.map((review) => review.rating).filter((rating): rating is number => typeof rating === 'number') ?? []
    if (ratings.length === 0) return null

    const total = ratings.reduce((sum, rating) => sum + rating, 0)
    return total / ratings.length
  }

useEffect(() => {
  axios.get(`${backendUrl}/me`, { withCredentials: true })
    .then(res => setIsAuthenticated(res.data.isAuthenticated))
    .catch(() => setIsAuthenticated(false))
}, [backendUrl])

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

  const handleAddGym = async () => {
    if (!formData.name.trim()) {
      setFormError('Gym name is required.')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      const response = await axios.post(`${backendUrl}/gyms`, formData,
       { withCredentials: true })
      setGyms((prev) => [...prev, response.data])
      setShowModal(false)
      setFormData({ name: '', city: '', address: '' })
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({ name: '', city: '', address: '' })
    setFormError(null)
  }


  if (loading) return <p>Loading gyms...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Gym Reviews</h1>
        {isAuthenticated && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '15px',
          }}
        >
          + Add Gym
        </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '32px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Add New Gym</h2>

            {formError && (
              <p style={{ color: '#dc3545', marginBottom: '16px', fontSize: '14px' }}>{formError}</p>
            )}

            {(['name', 'city', 'address'] as const).map((field) => (
              <div key={field} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, textTransform: 'capitalize' }}>
                  {field}{field === 'name' && ' *'}
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={field === 'name' ? 'e.g. Gold\'s Gym' : field === 'city' ? 'e.g. Stockholm' : 'e.g. Main St 1'}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleAddGym}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: submitting ? '#94d3a2' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                }}
              >
                {submitting ? 'Adding...' : 'Add Gym'}
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'white',
                  color: '#333',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '15px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <img src={gym.image} alt={gym.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#f2f2f2' }} />
              )}
              <div style={{ padding: '16px' }}>
                <h3>{gym.name}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{gym.city || gym.address || 'Location unavailable'}</p>
                <p style={{ fontSize: '14px' }}>{gym.address || 'No address listed'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontWeight: 'bold' }}>Gym</span>
                  <span>{averageRating ? averageRating.toFixed(1) : 'N/A'} ({reviewCount} reviews)</span>
                </div>
                <button
                  onClick={() => navigate(`/gym/${gym.id}`)}
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
