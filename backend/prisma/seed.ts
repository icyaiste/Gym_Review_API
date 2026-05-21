// backend/prisma/seed.ts
import prisma from '../src/database/db'
import { gyms } from '../src/database/data'

async function main() {
  console.log('Seeding database...')

  for (const gym of gyms) {
    await prisma.gym.create({
      data: {
        id: gym.id,
        name: gym.name,
        city: gym.city,
        address: gym.address,
        reviews: {
          create: gym.reviews.map((review) => ({
            id: review.id,
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
          })),
        },
      },
    })
  }

  console.log('Done seeding!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })