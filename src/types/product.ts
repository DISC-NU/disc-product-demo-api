export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
}

export interface ProductParams {
  id: string;
}

export interface CreateProductBody {
  name: string;
  price: number;
  description: string;
}

export interface UpdateProductBody {
  name?: string;
  price?: number;
  description?: string;
}
