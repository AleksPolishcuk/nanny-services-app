export type Review = {
  reviewer: string;
  rating: number;
  comment: string;
};

export type Nanny = {
  id: string; // pushId
  name: string;
  avatar_url: string;
  birthday: string;
  experience: string;
  reviews: Review[];
  education: string;
  kids_age: string;
  price_per_hour: number;
  location: string;
  about: string;
  characters: string[];
  rating: number;
  createdAt: number;
};

export type AppointmentValues = {
  address: string;
  phone: string;
  childAge: string;
  time: string;
  email: string;
  parentName: string;
  comment: string;
};
