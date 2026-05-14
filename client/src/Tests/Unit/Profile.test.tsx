import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import Profile from '../../components/Profile/Profile'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

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
})