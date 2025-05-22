export interface Review {
  id: number;
  user: string;
  text: string;
  rating: number;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "JohnDoe",
    text: "Amazing quality and fast shipping!",
    rating: 5,
    date: "2023-10-15T14:30:00Z",
  },
  {
    id: 2,
    user: "JaneSmith",
    text: "Decent product, but packaging was damaged.",
    rating: 3,
    date: "2023-10-12T11:00:00Z",
  },
  {
    id: 3,
    user: "MikeJones",
    text: "Not worth the price. Found it cheaper elsewhere.",
    rating: 2,
    date: "2023-10-10T08:45:00Z",
  },
];

const getReviews = (): Promise<Review[]> => {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 500;

    setTimeout(() => {
      resolve(mockReviews);
    }, delay);
  });
};

export default getReviews;
