import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { Gym, Review } from '../../types/gym'

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

  const [showEditForm, setShowEditForm] = useState<boolean>(false)
const [editData, setEditData] = useState<Pick<Gym, 'name' | 'city' | 'address' | 'image' | 'description'>>({
  name: '',
  city: '',
  address: '',
  image: '',
  description: '',
})
const [editSubmitting, setEditSubmitting] = useState<boolean>(false)
const [editError, setEditError] = useState<string | null>(null)


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
        await axios.get(`${backendUrl}/me`, { withCredentials: true })
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

  const handleEdit = async () => {
  if (!editData.name?.trim()) {
    setEditError('Gym name is required.')
    return
  }
  setEditSubmitting(true)
  setEditError(null)
  try {
    const response = await axios.patch(
      `${backendUrl}/gyms/${id}`,
      editData,
      { withCredentials: true }
    )
    setGym(response.data)
    setShowEditForm(false)
  } catch (err: any) {
    if (err.response?.status === 401) {
      setEditError('You must be logged in to edit this gym.')
    } else {
      setEditError('Something went wrong. Please try again.')
    }
  } finally {
    setEditSubmitting(false)
  }
}

  if (loading) return (
  <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          backgroundColor: '#eee',
          height: 64, width: 64,
          borderRadius: '50%',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: '#eee',
            height: 16, width: '60%',
            borderRadius: 4,
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ height: 8 }} />
          <div style={{
            backgroundColor: '#eee',
            height: 12, width: '40%',
            borderRadius: 4,
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </div>
      <div style={{
        backgroundColor: '#eee',
        height: 300, width: '100%',
        borderRadius: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
      <div style={{
        backgroundColor: '#eee',
        height: 100, width: '100%',
        borderRadius: 8,
        animation: 'pulse 1.5s ease-in-out infinite'
      }} />
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
  if (error) return <p style={{ padding: '20px' }}>Error: {error}</p>
  if (!gym) return <p style={{ padding: '20px' }}>Gym not found.</p>

  const averageRating = getAverageRating(gym)
  const reviewCount = gym.reviews?.length ?? 0

  return (
    <div style={{ padding: '80px', backgroundColor: 'var(--bg)' }}>
      <button
        onClick={() => navigate('/')}
        className="back-button"
      >
        ← Back to gyms
      </button>

      <div className="gym-page-container">
        {/* Left: Gym Info Card */}
        <div className="gym-info-column">
          <div className="gym-detail-card">
            {gym.image ? (
              <img
                src={gym.image}
                alt={gym.name}
                className="gym-detail-image"
              />
            ) : (
              <div className="gym-detail-image" style={{ backgroundColor: '#f2f2f2' }} />
            )}
            <div style={{ padding: '24px' }}>
              <h1 className="gym-detail-title">{gym.name}</h1>
              <p className="gym-detail-location">
                <span style={{ color: 'var(--accent)', marginRight: 8 }}>◉</span>
                {gym.city || 'Location unavailable'}
              </p>
              <p className="gym-detail-address">
                {gym.address || 'No address listed'}
              </p>
              {gym.description && (
                <p className="gym-detail-description">
                  {gym.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#9a8f82', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Average Rating</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>
                    {averageRating ? averageRating.toFixed(1) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#9a8f82', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Reviews</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-h)' }}>
                    {reviewCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reviews Column */}
        <div className="reviews-column">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="reviews-heading">Reviews</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
            {isLoggedIn && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="add-review-button"
              >
                + Add Review
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={() => {
                  setEditData({
                  name: gym.name,
                  city: gym.city ?? '',
                  address: gym.address ?? '',
                  image: gym.image ?? '',
                  description: gym.description ?? '',
            })
              setShowEditForm(true)
            }}
              className="add-review-button"
  >
    ✎ Edit gym
  </button>
)}
</div>
          </div>
          

          {submitSuccess && (
            <p className="success-message">Review submitted successfully!</p>
          )}

          {/* Review form */}
          {showForm && (
            <div
              onClick={() => { setShowForm(false); setSubmitError(null) }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}
            >
              <div onClick={(e) => e.stopPropagation()} className="modal-content" role="dialog" aria-modal="true" aria-label="Write a review">
                <button onClick={() => { setShowForm(false); setSubmitError(null) }} className="modal-close-btn">×</button>
                <h2 className="modal-title">Write a Review</h2>
                <p className="modal-subtitle" style={{ marginBottom: 18 }}>Share your experience at this gym.</p>

                <div style={{ marginBottom: '12px' }}>
                  <label className="form-label">Your name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label className="form-label">Rating (1–5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="form-input"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Review</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={5}
                    className="form-input"
                    placeholder="Share your experience..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {submitError && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '16px' }}>{submitError}</p>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="modal-button"
                    style={{ opacity: submitting ? 0.6 : 1 }}
                  >
                    {submitting ? 'Submitting...' : 'Post review'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setSubmitError(null) }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {showEditForm && (
  <div
    onClick={() => { setShowEditForm(false); setEditError(null) }}
    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="modal-content"
      role="dialog"
      aria-modal="true"
      aria-label="Edit gym"
    >
      <button
        onClick={() => { setShowEditForm(false); setEditError(null) }}
        className="modal-close-btn"
      >
        ×
      </button>
      <h2 className="modal-title">Edit Gym</h2>
      <p className="modal-subtitle" style={{ marginBottom: 18 }}>Update the gym's information.</p>

      {editError && (
        <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '16px' }}>{editError}</p>
      )}

      {(['name', 'city', 'address'] as const).map((field) => (
        <div key={field} style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ textTransform: 'capitalize' }}>{field}</label>
          <input
            type="text"
            value={editData[field]}
            onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
            className="form-input"
            placeholder={field}
          />
        </div>
      ))}

      <div style={{ marginBottom: '12px' }}>
        <label className="form-label">Image URL</label>
        <input
          type="text"
          value={editData.image ?? ''}
          onChange={(e) => setEditData({ ...editData, image: e.target.value })}
          className="form-input"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="form-label">Description</label>
        <textarea
          value={editData.description ?? ''}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          rows={4}
          className="form-input"
          placeholder="Describe the gym..."
          style={{ resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleEdit}
          disabled={editSubmitting}
          className="modal-button"
          style={{ opacity: editSubmitting ? 0.6 : 1 }}
        >
          {editSubmitting ? 'Saving...' : 'Save changes'}
        </button>
        <button
          onClick={() => { setShowEditForm(false); setEditError(null) }}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          {/* Reviews list */}
          <div className="reviews-list">
            {reviewCount === 0 ? (
              <p style={{ color: '#9a8f82', fontSize: '14px' }}>No reviews yet. Be the first to share your experience!</p>
            ) : (
              gym.reviews?.map((review, index) => (
                <div
                  key={review.id ?? index}
                  className="review-item"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: 14 }}>{review.author}</span>
                    <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700 }}>{'★'.repeat(review.rating)}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 8px 0' }}>{review.comment}</p>
                  <p style={{ fontSize: '12px', color: '#9a8f82', margin: 0 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gym