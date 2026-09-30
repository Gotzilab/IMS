import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

export interface Unit {
  id: string;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private readonly supabase = inject(SupabaseService);

  async getUnits(): Promise<Unit[]> {
    const { data, error } = await this.supabase.client
      .from('units')
      .select('id, code, name')
      .order('name');

    if (error) {
      throw error;
    }

    return (data ?? []) as Unit[];
  }
}
