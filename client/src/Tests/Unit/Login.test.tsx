import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import Login from '../../components/Login/Login'

afterEach(() => {
  cleanup()
})

describe('Login', () => {
  it('renders a login button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders a logout button', () => {
    render(<Login />)
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })
})
