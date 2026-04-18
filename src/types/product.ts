export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceFormatted: string;
  category: ProductCategory;
  description: string;
  size: string;
  notes: FragranceNotes;
  images: string[];
  modelPath?: string;
}

export type ProductCategory =
  | "Perfume"
  | "Eau de Toilette"
  | "Eau de Parfum"
  | "Body"
  | "Hair";

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}
