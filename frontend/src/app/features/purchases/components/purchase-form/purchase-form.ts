import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreatePurchasePayload,
  PurchaseItemInput,
} from '../../../../core/models/inventory/purchase.model';
import { Product } from '../../../../core/models/inventory/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { SupplierService } from '../../../../core/services/supplier.service';
import { PaymentMethodService } from '../../../../core/services/payment-method.service';
import { PurchaseService } from '../../../../core/services/purchase.service';
import { Supplier } from '../../../../core/models/inventory/supplier.model';
import { PaymentMethod } from '../../../../core/models/finances/payment-method.model';

interface PurchaseRow extends PurchaseItemInput {
  product?: Product;
}

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseForm implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly supplierService = inject(SupplierService);
  private readonly paymentMethodService = inject(PaymentMethodService);

  private readonly purchaseService = inject(PurchaseService);

  products = signal<Product[]>([]);
  suppliers = signal<Supplier[]>([]);
  paymentMethods = signal<PaymentMethod[]>([]);

  items = signal<PurchaseRow[]>([]);

  selectedSupplierId = signal<string | null>(null);
  selectedPaymentMethodId = signal<string | null>(null);

  discount = signal<number>(0);
  note = signal<string>('');

  loading = signal(false);
  saving = signal(false);

  errorMessage = signal<string | null>(null);

  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);

    try {
      const [products, suppliers, paymentMethods] = await Promise.all([
        this.productService.getProducts(),
        this.supplierService.getSuppliers(),
        this.paymentMethodService.getPaymentMethods(),
      ]);

      this.products.set(products);
      this.suppliers.set(suppliers);
      this.paymentMethods.set(paymentMethods);
    } catch (error) {
      console.error(error);

      this.errorMessage.set('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      this.loading.set(false);
    }
  }

  addItem(): void {
    this.items.update((items) => [
      ...items,
      {
        product_id: '',
        quantity: 1,
        unit_price: 0,
        note: null,
      },
    ]);
  }

  removeItem(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }

  onProductChange(index: number, productId: string): void {
    const product = this.products().find((item) => item.id === productId);

    this.items.update((items) => {
      const updated = [...items];

      updated[index] = {
        ...updated[index],

        product_id: productId,

        product,
      };

      return updated;
    });
  }

  updateQuantity(index: number, quantity: number): void {
    this.items.update((items) => {
      const updated = [...items];

      updated[index] = {
        ...updated[index],
        quantity: Number(quantity) || 0,
      };

      return updated;
    });
  }

  updateUnitPrice(index: number, price: number): void {
    this.items.update((items) => {
      const updated = [...items];

      updated[index] = {
        ...updated[index],
        unit_price: Number(price) || 0,
      };

      return updated;
    });
  }

  getItemTotal(item: PurchaseRow): number {
    return Number(item.quantity || 0) * Number(item.unit_price || 0);
  }

  getSubtotal(): number {
    return this.items().reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  getTotal(): number {
    return Math.max(this.getSubtotal() - Number(this.discount() || 0), 0);
  }

  canSave(): boolean {
    if (this.items().length === 0) {
      return false;
    }

    return this.items().every(
      (item) => !!item.product_id && item.quantity > 0 && item.unit_price >= 0,
    );
  }

  async save(): Promise<void> {
    if (!this.canSave()) {
      this.errorMessage.set('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน');

      return;
    }

    this.saving.set(true);

    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const payload: CreatePurchasePayload = {
        supplier_id: this.selectedSupplierId(),

        payment_method_id: this.selectedPaymentMethodId(),

        discount: Number(this.discount() || 0),

        note: this.note().trim() || null,

        items: this.items().map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          note: item.note ?? null,
        })),
      };

      const result = await this.purchaseService.createPurchase(payload);

      console.log('Purchase created:', result);

      this.successMessage.set(`บันทึกรับซื้อสำเร็จ ${result.purchase_no}`);

      this.resetForm();
    } catch (error: any) {
      console.error(error);

      this.errorMessage.set(error?.message ?? 'ไม่สามารถบันทึกรายการรับซื้อได้');
    } finally {
      this.saving.set(false);
    }
  }

  resetForm(): void {
    this.selectedSupplierId.set(null);

    this.selectedPaymentMethodId.set(null);

    this.discount.set(0);

    this.note.set('');

    this.items.set([]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  updateDiscount(value: number): void {
    this.discount.set(Number(value) || 0);
  }
}
