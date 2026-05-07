import {Gym} from './types';

export const gyms: Gym[] = [
  {
    id: "gym-001",
    name: "SATS Stockholm City",
    city: "Stockholm",
    address: "Sveavägen 63, 113 59 Stockholm",
    reviews: [
      {
        id: "r-001-1",
        author: "Erik Lindström",
        rating: 5,
        comment: "Best gym in Stockholm. Great equipment and friendly staff!",
        createdAt: "2024-11-10",
      },
      {
        id: "r-001-2",
        author: "Anna Björk",
        rating: 4,
        comment: "Love the yoga classes, but it gets crowded after work.",
        createdAt: "2024-12-03",
      },
    ],
  },
  {
    id: "gym-002",
    name: "Nordic Wellness Göteborg Hisingen",
    city: "Göteborg",
    address: "Vågmästareplatsen 1, 417 05 Göteborg",
    reviews: [
      {
        id: "r-002-1",
        author: "Lars Svensson",
        rating: 4,
        comment: "Great value for money, lots of machines available.",
        createdAt: "2025-01-15",
      },
      {
        id: "r-002-2",
        author: "Maria Karlsson",
        rating: 3,
        comment: "Decent gym but locker rooms need an upgrade.",
        createdAt: "2025-02-20",
      },
    ],
  },
  {
    id: "gym-003",
    name: "Friskis & Svettis Malmö",
    city: "Malmö",
    address: "Stortorget 4, 211 22 Malmö",
    reviews: [
      {
        id: "r-003-1",
        author: "Sofia Persson",
        rating: 5,
        comment: "Super fun group classes! Body shaming-free zone.",
        createdAt: "2024-10-08",
      },
    ],
  },
  {
    id: "gym-004",
    name: "Fitness 24 Seven Uppsala",
    city: "Uppsala",
    address: "Kungsgatan 59, 753 21 Uppsala",
    reviews: [
      {
        id: "r-004-1",
        author: "Johan Nilsson",
        rating: 3,
        comment: "Open 24/7 which is amazing, but some equipment is old.",
        createdAt: "2025-01-22",
      },
      {
        id: "r-004-2",
        author: "Lena Holm",
        rating: 4,
        comment: "Perfect for late-night training sessions!",
        createdAt: "2025-03-05",
      },
    ],
  },
  {
    id: "gym-005",
    name: "Delta Gym Stockholm",
    city: "Stockholm",
    address: "Vasaplan 4, 111 20 Stockholm",
    reviews: [
      {
        id: "r-005-1",
        author: "Marcus Åberg",
        rating: 5,
        comment: "The best strength training gym in Stockholm since 1992. Knowledgeable staff.",
        createdAt: "2024-09-14",
      },
    ],
  },
  {
    id: "gym-006",
    name: "Exhale Gym Göteborg",
    city: "Göteborg",
    address: "Första Långgatan 18, 413 28 Göteborg",
    reviews: [
      {
        id: "r-006-1",
        author: "Patrik Engström",
        rating: 5,
        comment: "Eleiko bars and dumbbells up to 100kg. A paradise for serious lifters.",
        createdAt: "2025-02-11",
      },
      {
        id: "r-006-2",
        author: "Cecilia Löf",
        rating: 4,
        comment: "Owner is super helpful and friendly. Great atmosphere.",
        createdAt: "2025-03-19",
      },
    ],
  },
  {
    id: "gym-007",
    name: "Nordic Wellness Linköping",
    city: "Linköping",
    address: "Repslagaregatan 14, 582 22 Linköping",
    reviews: [
      {
        id: "r-007-1",
        author: "Emma Strand",
        rating: 4,
        comment: "Modern facilities and great location near the city center.",
        createdAt: "2024-11-28",
      },
    ],
  },
  {
    id: "gym-008",
    name: "SATS Malmö City",
    city: "Malmö",
    address: "Södra Förstadsgatan 6, 211 43 Malmö",
    reviews: [
      {
        id: "r-008-1",
        author: "Viktor Gustafsson",
        rating: 4,
        comment: "Wide range of classes and modern equipment. Parking can be tricky.",
        createdAt: "2025-01-09",
      },
      {
        id: "r-008-2",
        author: "Hanna Lindqvist",
        rating: 5,
        comment: "Love the pool access included in the membership!",
        createdAt: "2025-02-14",
      },
    ],
  },
  {
    id: "gym-009",
    name: "Friskis & Svettis Västerås",
    city: "Västerås",
    address: "Kopparbergsvägen 10, 722 13 Västerås",
    reviews: [
      {
        id: "r-009-1",
        author: "Tobias Eriksson",
        rating: 4,
        comment: "Community feel, great for all ages. Affordable pricing.",
        createdAt: "2024-12-17",
      },
    ],
  },
  {
    id: "gym-010",
    name: "Fysiken Gym Göteborg",
    city: "Göteborg",
    address: "Drottninggatan 63, 411 07 Göteborg",
    reviews: [
      {
        id: "r-010-1",
        author: "Rebecka Magnusson",
        rating: 5,
        comment: "Physiotherapy and gym in one place — great for rehab training.",
        createdAt: "2025-03-01",
      },
      {
        id: "r-010-2",
        author: "Daniel Forsberg",
        rating: 4,
        comment: "The massage services are a great bonus after a tough workout.",
        createdAt: "2025-03-22",
      },
    ],
  },
  {
    id: "gym-011",
    name: "Grand Fitness Stockholm",
    city: "Stockholm",
    address: "Vasagatan 1, 111 20 Stockholm",
    reviews: [
      {
        id: "r-011-1",
        author: "Maja Sundberg",
        rating: 5,
        comment: "Premium experience with cold plunge pools and Hyrox training. Worth every krona.",
        createdAt: "2025-01-30",
      },
    ],
  },
  {
    id: "gym-012",
    name: "Fitness 24 Seven Örebro",
    city: "Örebro",
    address: "Drottninggatan 21, 703 62 Örebro",
    reviews: [
      {
        id: "r-012-1",
        author: "Niklas Wiklund",
        rating: 3,
        comment: "Budget-friendly and open all hours. Equipment could be newer.",
        createdAt: "2024-10-25",
      },
    ],
  },
  {
    id: "gym-013",
    name: "Nordic Wellness Helsingborg",
    city: "Helsingborg",
    address: "Kullagatan 16, 252 20 Helsingborg",
    reviews: [
      {
        id: "r-013-1",
        author: "Ida Johansson",
        rating: 4,
        comment: "Clean, well-maintained, and the staff are really welcoming.",
        createdAt: "2025-02-07",
      },
      {
        id: "r-013-2",
        author: "Simon Bergström",
        rating: 5,
        comment: "Great gym with a good sauna. My go-to in Helsingborg.",
        createdAt: "2025-03-11",
      },
    ],
  },
  {
    id: "gym-014",
    name: "STC Fitness Borås",
    city: "Borås",
    address: "Köpmansgatan 8, 503 38 Borås",
    reviews: [
      {
        id: "r-014-1",
        author: "Filippa Olsson",
        rating: 4,
        comment: "Solid gym, good selection of group classes throughout the week.",
        createdAt: "2024-11-04",
      },
    ],
  },
  {
    id: "gym-015",
    name: "Friskis & Svettis Umeå",
    city: "Umeå",
    address: "Rådhustorget 1, 903 26 Umeå",
    reviews: [
      {
        id: "r-015-1",
        author: "Oskar Hedlund",
        rating: 5,
        comment: "Perfect for students. Affordable and fun atmosphere.",
        createdAt: "2025-01-18",
      },
      {
        id: "r-015-2",
        author: "Elin Norström",
        rating: 4,
        comment: "Good variety of classes. Gets busy during semester starts.",
        createdAt: "2025-02-28",
      },
    ],
  },
  {
    id: "gym-016",
    name: "SATS Göteborg Nordstan",
    city: "Göteborg",
    address: "Nordstadstorget 1, 411 05 Göteborg",
    reviews: [
      {
        id: "r-016-1",
        author: "Caroline Ek",
        rating: 4,
        comment: "Convenient location in the shopping center. Running club is a bonus!",
        createdAt: "2024-12-21",
      },
    ],
  },
  {
    id: "gym-017",
    name: "Nordic Wellness Sundsvall",
    city: "Sundsvall",
    address: "Storgatan 34, 852 30 Sundsvall",
    reviews: [
      {
        id: "r-017-1",
        author: "Anton Lund",
        rating: 3,
        comment: "Okay gym, could use more free weights but classes are good.",
        createdAt: "2025-01-05",
      },
    ],
  },
  {
    id: "gym-018",
    name: "Fitness 24 Seven Lund",
    city: "Lund",
    address: "Bangatan 10, 222 29 Lund",
    reviews: [
      {
        id: "r-018-1",
        author: "Klara Isaksson",
        rating: 4,
        comment: "Great for students! Cheap and open 24/7 for late-night study breaks.",
        createdAt: "2025-02-02",
      },
      {
        id: "r-018-2",
        author: "Gustav Martinsson",
        rating: 3,
        comment: "Fairly basic but gets the job done. AC could be better in summer.",
        createdAt: "2025-03-15",
      },
    ],
  },
  {
    id: "gym-019",
    name: "Friskis & Svettis Gävle",
    city: "Gävle",
    address: "Norra Slottsgatan 9, 803 20 Gävle",
    reviews: [
      {
        id: "r-019-1",
        author: "Therese Holmgren",
        rating: 5,
        comment: "One of the best in Gävle. Classes for all levels, super inclusive.",
        createdAt: "2024-09-30",
      },
    ],
  },
  {
    id: "gym-020",
    name: "STC Fitness Jönköping",
    city: "Jönköping",
    address: "Hovslättsgatan 4, 554 54 Jönköping",
    reviews: [
      {
        id: "r-020-1",
        author: "Pontus Rydberg",
        rating: 4,
        comment: "Clean gym, helpful staff and a nice view from the cardio area.",
        createdAt: "2025-01-11",
      },
      {
        id: "r-020-2",
        author: "Sara Hägg",
        rating: 4,
        comment: "Love the spinning classes here, great instructors.",
        createdAt: "2025-02-25",
      },
    ],
  },
  {
    id: "gym-021",
    name: "Nordic Wellness Norrköping",
    city: "Norrköping",
    address: "Drottninggatan 24, 602 24 Norrköping",
    reviews: [
      {
        id: "r-021-1",
        author: "Felix Söderberg",
        rating: 4,
        comment: "Well-equipped and good price point for the quality.",
        createdAt: "2025-03-08",
      },
    ],
  },
];
