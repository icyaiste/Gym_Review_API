import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import Home from '../../components/Home/Home'

vi.mock('axios')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const mockedAxios = vi.mocked(axios)

const mockGyms = [
  {
    id: '1',
    name: 'Iron Gym',
    city: 'New York',
    address: '123 Main St',
    reviews: [
      { id: '1', author: 'John', rating: 5, comment: 'Great!', createdAt: '2024-01-01' },
    ],
  },
  {
    id: '2',
    name: 'Flex Fitness',
    city: 'Boston',
    address: '456 Oak Ave',
    reviews: [],
  },
]

describe('Home', () => {
  it('shows a list of gyms when data is passed in', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockGyms })
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('Iron Gym')).toBeInTheDocument()
      expect(screen.getByText('Flex Fitness')).toBeInTheDocument()
    })
  })

  it('shows an error message when gym list fails to load', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch'))
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument()
    })
  })

  it('shows gym city and address information', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockGyms })
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText('456 Oak Ave')).toBeInTheDocument()
    })
  })

  it('displays review count for each gym', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockGyms })
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
    await waitFor(() => {
      const reviewCounts = screen.getAllByText(/reviews/)
      expect(reviewCounts.length).toBeGreaterThan(0)
    })
  })
})
