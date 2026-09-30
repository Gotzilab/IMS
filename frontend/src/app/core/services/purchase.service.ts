import { Injectable, inject } from '@angular/core';

import { CreatePurchasePayload, CreatePurchaseResponse } from '../models/inventory/purchase.model';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly supabase = inject(SupabaseService);

  async createPurchase(payload: CreatePurchasePayload): Promise<CreatePurchaseResponse> {
    const { data, error } = await this.supabase.client.rpc('create_purchase', {
      p_supplier_id: payload.supplier_id ?? null,

      p_payment_method_id: payload.payment_method_id ?? null,

      p_discount: payload.discount ?? 0,

      p_note: payload.note ?? null,

      p_items: payload.items,
    });

    if (error) {
      throw error;
    }

    return data as CreatePurchaseResponse;
  }
}
