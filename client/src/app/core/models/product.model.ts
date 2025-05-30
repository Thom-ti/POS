export interface Product {
  _id: string;
  name: string;
  imageUrl?: string;
  price: number;
  stock: number;
  description?: string;
}