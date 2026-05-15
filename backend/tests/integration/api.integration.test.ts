import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { AddressInfo } from 'node:net'
import { createApp } from '../../src/app'

describe('API integration', () => {
  let server: ReturnType<ReturnType<typeof createApp>['listen']>
  let baseUrl = ''

  beforeEach(() => {
    const app = createApp()
    server = app.listen(0)
    const address = server.address() as AddressInfo
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterEach(() => {
    server.close()
  })

  it('GET /gyms returns 200 and an array', async () => {
    const response = await fetch(`${baseUrl}/gyms`)

    expect(response.status).toBe(200)
    const gyms = await response.json()
    expect(Array.isArray(gyms)).toBe(true)
    expect(gyms.length).toBeGreaterThan(0)
  })

  it('GET /gyms/:id returns 404 for an unknown ID', async () => {
    const response = await fetch(`${baseUrl}/gyms/gym-999`)

    expect(response.status).toBe(404)
    const payload = await response.json()
    expect(payload).toEqual({ message: 'Gym not found' })
  })

  it('POST /gyms without a token returns 401', async () => {
    const response = await fetch(`${baseUrl}/gyms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Gym',
        city: 'Stockholm',
        address: 'Test Street 1',
      }),
    })

    expect(response.status).toBe(401)
  })

  it('POST /gyms with a valid token returns 201 and persists the gym', async () => {
    const createResponse = await fetch(`${baseUrl}/gyms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        name: 'Integration Gym',
        city: 'Malmö',
        address: 'Integration Street 10',
      }),
    })

    expect(createResponse.status).toBe(201)
    const createdGym = await createResponse.json()
    expect(createdGym.name).toBe('Integration Gym')

    const fetchResponse = await fetch(`${baseUrl}/gyms/${createdGym.id}`)
    expect(fetchResponse.status).toBe(200)
    const fetchedGym = await fetchResponse.json()
    expect(fetchedGym).toMatchObject({
      id: createdGym.id,
      name: 'Integration Gym',
      city: 'Malmö',
      address: 'Integration Street 10',
    })
  })

  it('POST /gyms/:id/reviews without a token returns 401', async () => {
    const response = await fetch(`${baseUrl}/gyms/gym-001/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author: 'Guest User',
        rating: 5,
        comment: 'Excellent workout space.',
      }),
    })

    expect(response.status).toBe(401)
  })

  it('POST /gyms/:id/reviews with a valid token returns 201 and updates the gym', async () => {
    const createReviewResponse = await fetch(`${baseUrl}/gyms/gym-002/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        author: 'Integration User',
        rating: 4,
        comment: 'Good equipment and clean floors.',
      }),
    })

    expect(createReviewResponse.status).toBe(201)
    const createdReview = await createReviewResponse.json()
    expect(createdReview).toMatchObject({
      author: 'Integration User',
      rating: 4,
      comment: 'Good equipment and clean floors.',
    })

    const gymResponse = await fetch(`${baseUrl}/gyms/gym-002`)
    expect(gymResponse.status).toBe(200)
    const gym = await gymResponse.json()
    expect(gym.reviews.some((review: { id: string }) => review.id === createdReview.id)).toBe(true)
  })
})