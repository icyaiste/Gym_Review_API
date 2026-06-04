import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Header from '../../components/Header/Header'

describe('Header', () => {
  it('displays brand title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    expect(screen.getByText(/iron rating/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3)
  })
})
