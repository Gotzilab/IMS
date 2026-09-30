export interface PurchaseItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
  note?: string | null;
}

export interface CreatePurchasePayload {
  supplier_id?: string | null;
  payment_method_id?: string | null;
  discount?: number;
  note?: string | null;
  items: PurchaseItemInput[];
}

export interface CreatePurchaseResponse {
  success: boolean;

  purchase_id: string;
  purchase_no: string;

  subtotal: number;
  discount: number;
  total_amount: number;

  payment_method: string | null;
}
