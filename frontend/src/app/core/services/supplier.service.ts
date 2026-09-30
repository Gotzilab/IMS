import { Injectable, inject } from '@angular/core';

import { Supplier } from '../models/inventory/supplier.model';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly supabase = inject(SupabaseService);

  async getSuppliers(): Promise<Supplier[]> {
    const { data, error } = await this.supabase.client
      .from('suppliers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? []) as Supplier[];
  }
}
