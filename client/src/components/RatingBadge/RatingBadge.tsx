import React from 'react'

type Props = {
  rating: number | null
  count?: number
}

const Star: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" stroke="none"/>
  </svg>
)

const RatingBadge: React.FC<Props> = ({ rating, count }) => {
  if (rating === null || typeof rating !== 'number') return null
  return (
    <div className="rating-badge" role="status" aria-label={`Rating ${rating.toFixed(1)}`}>
      <strong style={{ fontSize: '14px', marginRight: 8 }}>{rating.toFixed(1)}</strong>
      <span className="single-star" aria-hidden><Star /></span>
      {typeof count === 'number' && <span className="rb-count">{count}</span>}
    </div>
  )
}

export default RatingBadge
