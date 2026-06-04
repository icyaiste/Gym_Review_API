import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingBadge from '../RatingBadge/RatingBadge'

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
  if (loading) return (
  <div style={{ padding: '0' }}>
    <div className="hero" style={{ paddingLeft: 40, paddingRight: 40, marginTop: 24 }}>
      <h1 className="hero-title">
        <span className="lead">The gyms of sweden,</span>
        <span className="accent">rated by those who lift</span>
      </h1>
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      margin: '0 40px'
    }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            width: '100%', height: '200px',
            backgroundColor: '#eee',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ backgroundColor: '#eee', height: 20, width: '70%', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ backgroundColor: '#eee', height: 14, width: '50%', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ backgroundColor: '#eee', height: 14, width: '40%', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `}</style>
  </div>
)
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingLeft: 40, paddingRight: 40, marginTop: 24 }}>
        <div className="hero">
          <h1 className="hero-title">
            <span className="lead">The gyms of sweden,</span>
            <span className="accent">rated by those who lift</span>
          </h1>
        </div>
        {isAuthenticated && (
        <button
          onClick={() => setShowModal(true)}
          className="button primary"
        >
          + Add a gym
        </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            <button onClick={handleCloseModal} className="modal-close-btn">×</button>
            <div style={{ marginBottom: '32px' }}>
              <h2 className="modal-title">List a new gym</h2>
              <p className="modal-subtitle">Share a place worth training at.</p>
            </div>

            {formError && (
              <p style={{ color: '#dc3545', marginBottom: '16px', fontSize: '14px' }}>{formError}</p>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label className="modal-label">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Aurum Athletics"
                className="modal-input"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="modal-label">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Strandvägen 12, Stockholm"
                className="modal-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="modal-label">Image URL <span style={{ color: '#9a8f82', fontWeight: 400 }}>(optional)</span></label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="https://..."
                className="modal-input"
              />
            </div>
          
            <button
              onClick={handleAddGym}
              disabled={submitting}
              className="modal-button"
              style={{ opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Adding...' : 'Add gym'}
            </button>
          </div>
        </div>
      )}

      <div className="gym-grid">
        {gyms.map((gym) => {
          const averageRating = getAverageRating(gym)
          const reviewCount = gym.reviews?.length ?? 0
          return (
            <div key={gym.id} className="gym-card" style={{ border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
              {gym.image ? (
                <img src={gym.image} alt={gym.name} />
              ) : (
                <div style={{ width: '100%', height: '200px', backgroundColor: '#f2f2f2' }} />
              )}
              {averageRating !== null && (
                <RatingBadge rating={averageRating} count={reviewCount} />
              )}
              <div className="meta">
                <h3>{gym.name}</h3>
                <p className="location">{gym.city || gym.address || 'Location unavailable'}</p>
                <p className="address">{gym.address || 'No address listed'}</p>
                <div className="card-footer">
                  <div className="reviews-text">{reviewCount} review{reviewCount === 1 ? '' : 's'}</div>
                  <button onClick={() => navigate(`/gym/${gym.id}`)} className="details-button">Details</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
