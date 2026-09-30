import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

export interface DashboardSummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockProducts: number;
  purchaseAmount: number;
  salesAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly supabase = inject(SupabaseService);

  async getSummary(): Promise<DashboardSummary> {
    const client = this.supabase.client;

    // สินค้าทั้งหมด
    const { count: totalProducts, error: productsError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (productsError) {
      throw productsError;
    }

    // ดึง stock + average cost
    const { data: products, error: stockError } = await client
      .from('products')
      .select('stock_quantity, average_cost')
      .eq('is_active', true);

    if (stockError) {
      throw stockError;
    }

    const totalStockValue =
      products?.reduce(
        (sum, product) =>
          sum + Number(product.stock_quantity ?? 0) * Number(product.average_cost ?? 0),
        0,
      ) ?? 0;

    // สินค้าใกล้หมด
    const lowStockProducts =
      products?.filter((product) => Number(product.stock_quantity ?? 0) <= 5).length ?? 0;

    // วันที่เริ่มต้นเดือน
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // ยอดรับซื้อเดือนนี้
    const { data: purchases, error: purchasesError } = await client
      .from('purchases')
      .select('total_amount')
      .gte('created_at', startOfMonth);

    if (purchasesError) {
      throw purchasesError;
    }

    const purchaseAmount =
      purchases?.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0) ?? 0;

    // ยอดขายเดือนนี้
    const { data: sales, error: salesError } = await client
      .from('sales')
      .select('total_amount')
      .gte('created_at', startOfMonth);

    if (salesError) {
      throw salesError;
    }

    const salesAmount = sales?.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0) ?? 0;

    return {
      totalProducts: totalProducts ?? 0,
      totalStockValue,
      lowStockProducts,
      purchaseAmount,
      salesAmount,
    };
  }
}
