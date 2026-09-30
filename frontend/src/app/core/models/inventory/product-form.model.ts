export interface ProductFormValue {
  code: string | null;
  name: string;
  category_id: string | null;
  unit_id: string;
  description: string | null;
  selling_price: number;
  is_active: boolean;
}
