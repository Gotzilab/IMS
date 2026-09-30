import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X, Package, Save, LoaderCircle } from 'lucide-angular';

import { Category, CategoryService } from '../../../../core/services/category.service';

import { Unit, UnitService } from '../../../../core/services/unit.service';
import { Product } from '../../../../core/models/inventory/product.model';
import { ProductFormValue } from '../../../../core/models/inventory/product-form.model';

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './product-form-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormModal implements OnChanges {
  private readonly categoryService = inject(CategoryService);
  private readonly unitService = inject(UnitService);

  @Input() open = false;
  @Input() product: Product | null = null;

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly saveRequested = new EventEmitter<ProductFormValue>();

  readonly categories = signal<Category[]>([]);
  readonly units = signal<Unit[]>([]);

  readonly loadingOptions = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly icons = {
    close: X,
    package: Package,
    save: Save,
    loading: LoaderCircle,
  };

  readonly form = signal<ProductFormValue>(this.getEmptyForm());

  readonly submitted = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.submitted.set(false);
      this.error.set(null);

      this.form.set(this.product ? this.mapProductToForm(this.product) : this.getEmptyForm());

      this.loadOptions();
    }
  }

  private getEmptyForm(): ProductFormValue {
    return {
      code: null,
      name: '',
      category_id: null,
      unit_id: '',
      description: null,
      selling_price: 0,
      is_active: true,
    };
  }

  private mapProductToForm(product: Product): ProductFormValue {
    return {
      code: product.code,
      name: product.name ?? '',
      category_id: product.category_id,
      unit_id: product.unit_id ?? '',
      description: product.description,
      selling_price: Number(product.selling_price ?? 0),
      is_active: product.is_active,
    };
  }

  private async loadOptions(): Promise<void> {
    this.loadingOptions.set(true);

    try {
      const [categories, units] = await Promise.all([
        this.categoryService.getCategories(),
        this.unitService.getUnits(),
      ]);

      this.categories.set(categories);
      this.units.set(units);
    } catch (error) {
      console.error('Load product options error:', error);
      this.error.set('ไม่สามารถโหลดหมวดหมู่หรือหน่วยสินค้าได้');
    } finally {
      this.loadingOptions.set(false);
    }
  }

  updateField(field: keyof ProductFormValue, value: unknown): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  updateNumber(field: 'selling_price', value: string | number): void {
    const numberValue = Number(value);

    this.form.update((current) => ({
      ...current,
      [field]: Number.isFinite(numberValue) ? numberValue : 0,
    }));
  }

  isInvalid(field: keyof ProductFormValue): boolean {
    if (!this.submitted()) {
      return false;
    }

    const value = this.form()[field];

    if (field === 'name') {
      return !String(value ?? '').trim();
    }

    if (field === 'unit_id') {
      return !value;
    }

    return false;
  }

  get isEdit(): boolean {
    return !!this.product;
  }

  close(): void {
    if (this.saving()) {
      return;
    }

    this.closed.emit();
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    this.error.set(null);

    const value = this.form();

    if (!value.name.trim()) {
      this.error.set('กรุณาระบุชื่อสินค้า');
      return;
    }

    if (!value.unit_id) {
      this.error.set('กรุณาเลือกหน่วยสินค้า');
      return;
    }

    if (Number(value.selling_price) < 0) {
      this.error.set('ราคาขายต้องไม่ติดลบ');
      return;
    }
    this.saveRequested.emit({
      ...value,
      code: value.code?.trim() || null,
      name: value.name.trim(),
      description: value.description?.trim() || null,
      selling_price: Number(value.selling_price || 0),
    });
  }
}
