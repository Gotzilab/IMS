export interface Supplier {
  id: string;

  name: string;
  phone: string | null;
  address: string | null;
  tax_id: string | null;

  note: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}
