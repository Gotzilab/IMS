import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  LucideAngularModule,
  Search,
  Plus,
  Package,
  Boxes,
  AlertTriangle,
  Pencil,
  MoreVertical,
} from 'lucide-angular';

import { ProductService } from '../../../../core/services/product.service';
import { ProductFormModal } from '../../components/product-form-modal/product-form-modal';
import { Product } from '../../../../core/models/inventory/product.model';
import { ProductFormValue } from '../../../../core/models/inventory/product-form.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductFormModal],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly searchText = signal('');
  readonly selectedCategory = signal('');

  readonly productModalOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly savingProduct = signal(false);

  readonly icons = {
    search: Search,
    plus: Plus,
    package: Package,
    boxes: Boxes,
    alert: AlertTriangle,
    edit: Pencil,
    more: MoreVertical,
  };

  readonly Number = Number;

  readonly filteredProducts = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.code?.toLowerCase().includes(search);

      const matchesCategory = !category || product.category_id === category;

      return matchesSearch && matchesCategory;
    });
  });

  readonly categories = computed(() => {
    const map = new Map<string, string>();

    for (const product of this.products()) {
      if (product.category?.id && product.category?.name) {
        map.set(product.category.id, product.category.name);
      }
    }

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  });

  readonly totalProducts = computed(() => this.products().length);

  readonly stockedProducts = computed(
    () => this.products().filter((product) => Number(product.stock_quantity) > 0).length,
  );

  readonly lowStockProducts = computed(
    () =>
      this.products().filter(
        (product) => Number(product.stock_quantity) > 0 && Number(product.stock_quantity) <= 5,
      ).length,
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.productService.getProducts();

      this.products.set(data);
    } catch (error) {
      console.error('Load products error:', error);

      this.error.set('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(value: string): void {
    this.searchText.set(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }

  formatCurrency(value: number | null | undefined): string {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
  }

  getStockClass(quantity: number): string {
    if (quantity <= 0) {
      return 'text-red-600';
    }

    if (quantity <= 5) {
      return 'text-orange-600';
    }

    return 'text-emerald-600';
  }

  getStockLabel(quantity: number): string {
    if (quantity <= 0) {
      return 'หมด';
    }

    if (quantity <= 5) {
      return 'ใกล้หมด';
    }

    return 'ปกติ';
  }

  addProduct(): void {
    this.editingProduct.set(null);
    this.productModalOpen.set(true);
  }

  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productModalOpen.set(true);
  }

  closeProductModal(): void {
    if (this.savingProduct()) {
      return;
    }

    this.productModalOpen.set(false);
    this.editingProduct.set(null);
  }

  async saveProduct(value: ProductFormValue): Promise<void> {
    if (this.savingProduct()) {
      return;
    }

    this.savingProduct.set(true);
    this.error.set(null);

    try {
      const product = this.editingProduct();

      if (product) {
        await this.productService.updateProduct(product.id, value);
      } else {
        await this.productService.createProduct(value);
      }

      this.productModalOpen.set(false);
      this.editingProduct.set(null);

      await this.loadProducts();
    } catch (error) {
      console.error('Save product error:', error);

      this.error.set('ไม่สามารถบันทึกข้อมูลสินค้าได้');
    } finally {
      this.savingProduct.set(false);
    }
  }
}
