import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import Profile from '../../components/Profile/Profile'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('Profile', () => {
  it('shows the user name when logged in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { given_name: 'Ada', name: 'Ada Lovelace', email: 'ada@test.com' }
    })
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getByText(/hello ada/i)).toBeInTheDocument()
    })
  })

  it('shows not logged in when fetch fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Not authenticated'))
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument()
    })
  })

  it('shows the logout link', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { given_name: 'Ada', name: 'Ada Lovelace', email: 'ada@test.com' }
    })
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /log out/i })).toBeInTheDocument()
    })
  })

  it('displays user email when logged in', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { given_name: 'Ada', name: 'Ada Lovelace', email: 'ada@test.com' }
    })
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getAllByText('ada@test.com').length).toBeGreaterThan(0)
    })
  })

  it('handles user with full name but no given name', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { name: 'John Doe', email: 'john@test.com' }
    })
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getByText(/hello john doe/i)).toBeInTheDocument()
    })
  })
})