import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import Gym from '../../components/Gym/Gym'

vi.mock('axios')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const mockedAxios = vi.mocked(axios)

const mockGym = {
  id: '1',
  name: 'Iron Gym',
  city: 'New York',
  address: '123 Main St',
  reviews: [
    { id: '1', author: 'John', rating: 5, comment: 'Great gym!', createdAt: '2024-01-01' },
    { id: '2', author: 'Jane', rating: 4, comment: 'Good equipment', createdAt: '2024-01-02' },
  ],
}

describe('Gym', () => {
  it('displays gym details when data loads successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockGym })
    render(
      <BrowserRouter>
        <Gym />
      </BrowserRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('Iron Gym')).toBeInTheDocument()
    })
  })

  it('shows an error message when gym data fetch fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'))
    render(
      <BrowserRouter>
        <Gym />
      </BrowserRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/error: network error/i)).toBeInTheDocument()
    })
  })

  
it('hides the Add a Review button when not logged in', async () => {
  mockedAxios.get.mockImplementation((url: string) => {
    if (url.includes('/profile')) return Promise.reject(new Error('Not authenticated'))
    return Promise.resolve({ data: mockGym })
  })
  render(<BrowserRouter><Gym /></BrowserRouter>)
  await waitFor(() => {
    expect(screen.getByText('Iron Gym')).toBeInTheDocument()
  })
  expect(screen.queryByText(/add a review/i)).not.toBeInTheDocument()
})
 
it('shows the gym name when data loads', async () => {
  mockedAxios.get.mockResolvedValue({ data: mockGym })
  render(<BrowserRouter><Gym /></BrowserRouter>)
  await waitFor(() => {
    expect(screen.getByText('Iron Gym')).toBeInTheDocument()
  })
})
 
it('shows the gym address when data loads', async () => {
  mockedAxios.get.mockResolvedValue({ data: mockGym })
  render(<BrowserRouter><Gym /></BrowserRouter>)
  await waitFor(() => {
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })
})



})
