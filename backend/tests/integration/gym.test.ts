// tests/integration/gyms.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '../../app'
import { Server } from 'http'

const PORT = 3001
let server: Server

beforeAll(() => {
  server = app.listen(PORT)
})

afterAll(() => {
  server.close()
})

describe('GET /gyms', () => {
  it('returns 200 and an array of gyms', async () => {
    const res = await fetch(`http://localhost:${PORT}/gyms`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })
})

describe('GET /gyms/:id', () => {
  it('returns 404 for an unknown id', async () => {
    const res = await fetch(`http://localhost:${PORT}/gyms/gym-999`)
    expect(res.status).toBe(404)
  })
})

describe('POST /gyms/:id/reviews', () => {
  it('returns 401 without a token', async () => {
    const res = await fetch(`http://localhost:${PORT}/gyms/gym-001/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Test User', rating: 5, comment: 'Great!' })
    })
    expect(res.status).toBe(401)
  })
})