import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import axios from 'axios'
import Header from '../../components/Header/Header'

vi.mock('axios')

afterEach(() => {
  cleanup()
})

describe('Header auth', () => {
  it('shows login when not authenticated', async () => {
    ;(axios.get as any).mockRejectedValueOnce(new Error('not auth'))
    render(<Header />)
    const btn = await screen.findByRole('button', { name: /login/i })
    expect(btn).toBeInTheDocument()
  })

  it('shows logout when authenticated', async () => {
    ;(axios.get as any).mockResolvedValueOnce({ data: {} })
    render(<Header />)
    const btn = await screen.findByRole('button', { name: /logout/i })
    expect(btn).toBeInTheDocument()
  })
})
