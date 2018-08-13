import { User } from './user.model';

export interface Entity {
  id: string;
  categoryId: number;
  userId: number;
  name: string;
  desc: string;
  rating: number;
  reviewCount: number;
  links: object[];
  image: string;
  address: string;
  phone: string;
  email: string;
  excellentRating?: number;
  greatRating?: number;
  averageRating?: number;
  poorRating?: number;
  badRating?: number;
  User?: User;
  category?: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
