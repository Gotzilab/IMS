export interface Product {
  id: string;
  code: string | null;
  name: string;
  category_id: string | null;
  unit_id: string;
  description: string | null;
  selling_price: number;
  stock_quantity: number;
  average_cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;

  category?: {
    id: string;
    name: string;
  };

  unit?: {
    id: string;
    code: string;
    name: string;
  };
}
