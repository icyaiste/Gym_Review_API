import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { AddressInfo } from 'node:net'
import { app } from '../../app'

// Start server before each test and shut it down after
let server: ReturnType<typeof app.listen>
let baseUrl: string

beforeEach(async () => {
  await new Promise<void>((resolve) => {
    // Port 0 means "pick any free port automatically"
    server = app.listen(0, () => {
      const address = server.address() as AddressInfo
      baseUrl = `http://127.0.0.1:${address.port}`
      resolve()
    })
  })
})

afterEach(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()))
})

describe('Production-like behaviour', () => {
  it('GET / returns 200 OK', async () => {
    const response = await fetch(`${baseUrl}/`)
    expect(response.status).toBe(200)
  })


  it('GET /gyms responds without a CORS error for frontend origin', async () => {
    const response = await fetch(`${baseUrl}/gyms`, {
      headers: {
        // Simulating a request coming from the frontend
        Origin: 'http://localhost:5173',
      },
    })
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })
})