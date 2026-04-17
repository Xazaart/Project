export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  book_count: number;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image: string | null;
  price: string;
  stock: number;
  is_published: boolean;
  category: number;
  category_name: string;
  added_by: number | null;
  added_by_username: string | null;
  average_rating: number;
  created_at: string;
}

export interface Review {
  id: number;
  book: number;
  book_title: string;
  user: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Favorite {
  id: number;
  user: number;
  book: number;
  book_title: string;
  book_author: string;
  book_price: string;
  book_cover: string | null;
  created_at: string;
}

export interface Transaction {
  id: number;
  user: number;
  username: string;
  book: number;
  book_title: string;
  quantity: number;
  total_price: string;
  status: string;
  created_at: string;
}
