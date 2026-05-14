import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

type Review = {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

type Gym = {
  id: string
  name: string
  city?: string
  address?: string
  image?: string
  description?: string
  reviews?: Review[]
}

function Gym() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

  const [gym, setGym] = useState<Gym | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formData, setFormData] = useState<Pick<Review, 'author' | 'rating' | 'comment'>>({
    author: '',
    rating: 5,
    comment: '',
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)


  const getAverageRating = (gym: Gym) => {
    const ratings =
      gym.reviews
        ?.map((r) => r.rating)
        .filter((r): r is number => typeof r === 'number') ?? []
    if (ratings.length === 0) return null
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${backendUrl}/profile`, { withCredentials: true })
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [backendUrl])

  useEffect(() => {
    const fetchGym = async () => {
      try {
        const response = await axios.get(`${backendUrl}/gyms/${id}`)
        setGym(response.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGym()
  }, [id, backendUrl])

  const handleSubmit = async () => {
    if (!formData.author.trim() || !formData.comment.trim()) {
      setSubmitError('Please fill in all fields.')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const response = await axios.post(
        `${backendUrl}/gyms/${id}/reviews`,
        formData,
        { withCredentials: true }
      )
      setGym((prev) =>
        prev ? { ...prev, reviews: [...(prev.reviews ?? []), response.data] } : prev
      )
      setShowForm(false)
      setFormData({ author: '', rating: 5, comment: '' })
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setSubmitError('You must be logged in to post a review.')
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading gym...</p>
  if (error) return <p style={{ padding: '20px' }}>Error: {error}</p>
  if (!gym) return <p style={{ padding: '20px' }}>Gym not found.</p>

  const averageRating = getAverageRating(gym)
  const reviewCount = gym.reviews?.length ?? 0

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '16px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          color: '#007bff',
          border: '1px solid #007bff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Back to gyms
      </button>

      {/* Gym card */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '32px',
        }}
      >
        {gym.image ? (
          <img
            src={gym.image}
            alt={gym.name}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '300px', backgroundColor: '#f2f2f2' }} />
        )}
        <div style={{ padding: '16px' }}>
          <h2 style={{ marginBottom: '4px' }}>{gym.name}</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
            {gym.city || 'Location unavailable'}
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            {gym.address || 'No address listed'}
          </p>
          {gym.description && (
            <p style={{ fontSize: '14px', color: '#444', marginBottom: '8px' }}>
              {gym.description}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>Gym</span>
            <span>
              {averageRating ? averageRating.toFixed(1) : 'N/A'} ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Reviews header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Reviews</h3>
        {isLoggedIn && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add a Review
          </button>
        )}
      </div>
      
      {submitSuccess && (
        <p style={{ color: 'green', fontSize: '14px', marginBottom: '12px' }}>
          Review submitted successfully!
        </p>
      )}

      {/* Review form */}
      {showForm && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px',
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: '16px' }}>Write a Review</h4>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Your name
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Rating (1–5)
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical',
              }}
            />
          </div>

          {submitError && (
            <p style={{ color: 'red', fontSize: '14px', marginBottom: '12px' }}>{submitError}</p>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '8px 16px',
                backgroundColor: submitting ? '#aaa' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              onClick={() => { setShowForm(false); setSubmitError(null) }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviewCount === 0 ? (
        <p style={{ color: '#666', fontSize: '14px' }}>No reviews yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {gym.reviews?.map((review, index) => (
            <div
              key={review.id ?? index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{review.author}</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{review.rating} / 5</span>
              </div>
              <p style={{ fontSize: '14px', color: '#444', margin: 0 }}>{review.comment}</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', marginBottom: 0 }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Gym