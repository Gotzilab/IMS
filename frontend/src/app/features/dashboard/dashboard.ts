import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import {
  LucideAngularModule,
  Boxes,
  Package,
  AlertTriangle,
  ShoppingCart,
  ShoppingBag,
  Wallet,
} from 'lucide-angular';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly loading = signal(true);

  readonly error = signal<string | null>(null);

  readonly summary = signal<DashboardSummary>({
    totalProducts: 0,
    totalStockValue: 0,
    lowStockProducts: 0,
    purchaseAmount: 0,
    salesAmount: 0,
  });

  readonly icons = {
    boxes: Boxes,
    package: Package,
    alert: AlertTriangle,
    purchase: ShoppingCart,
    sale: ShoppingBag,
    wallet: Wallet,
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.dashboardService.getSummary();

      this.summary.set(result);
    } catch (error) {
      console.error(error);

      this.error.set('ไม่สามารถโหลดข้อมูล Dashboard ได้');
    } finally {
      this.loading.set(false);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
