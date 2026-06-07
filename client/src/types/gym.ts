type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

type Gym = {
  id: string
  name: string
  city: string
  address: string
  image?: string
  description: string
  reviews?: Review[]
}

export type { Gym, Review }