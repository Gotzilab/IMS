import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase';
import { PaymentMethod } from '../models/finances/payment-method.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private readonly supabase = inject(SupabaseService);

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data, error } = await this.supabase.client
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? []) as PaymentMethod[];
  }
}
