import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { Product } from '../models/inventory/product.model';
import { ProductFormValue } from '../models/inventory/product-form.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly supabase = inject(SupabaseService);

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select(
        `
        *,
        category:categories (
          id,
          name
        ),
        unit:units (
          id,
          code,
          name
        )
      `,
      )
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? []) as Product[];
  }

  async createProduct(value: ProductFormValue): Promise<Product> {
    const payload = {
      code: value.code?.trim() || null,
      name: value.name.trim(),
      category_id: value.category_id || null,
      unit_id: value.unit_id,
      description: value.description?.trim() || null,
      selling_price: Number(value.selling_price || 0),
      is_active: value.is_active,
    };

    const { data, error } = await this.supabase.client
      .from('products')
      .insert(payload)
      .select(
        `
        *,
        category:categories (
          id,
          name
        ),
        unit:units (
          id,
          code,
          name
        )
      `,
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }

  async updateProduct(id: string, value: ProductFormValue): Promise<Product> {
    const payload = {
      code: value.code?.trim() || null,
      name: value.name.trim(),
      category_id: value.category_id || null,
      unit_id: value.unit_id,
      description: value.description?.trim() || null,
      selling_price: Number(value.selling_price || 0),
      is_active: value.is_active,
    };

    const { data, error } = await this.supabase.client
      .from('products')
      .update(payload)
      .eq('id', id)
      .select(
        `
        *,
        category:categories (
          id,
          name
        ),
        unit:units (
          id,
          code,
          name
        )
      `,
      )
      .single();

    if (error) {
      throw error;
    }

    return data as Product;
  }
}
