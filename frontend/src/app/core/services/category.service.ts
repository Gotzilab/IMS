import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly supabase = inject(SupabaseService);

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase.client
      .from('categories')
      .select('id, name')
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? []) as Category[];
  }
}
