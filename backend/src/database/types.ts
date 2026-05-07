export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Gym {
  id: string;
  name: string;
  city: string;
  address: string;
  reviews: Review[];
}