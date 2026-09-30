import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  LucideAngularModule,
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  PackagePlus,
  SlidersHorizontal,
  History,
  ShoppingCart,
  Plus,
  ClipboardList,
  ShoppingBag,
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  Landmark,
  ChartColumn,
  BadgeDollarSign,
  Settings,
  Ruler,
  CreditCard,
  Users,
  ChevronDown,
  X,
} from 'lucide-angular';

import { MENU_ITEMS } from '../../../core/config/menu.config';
import { MenuItem } from '../../../core/models/menu/menu-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /**
   * Mobile sidebar เปิด/ปิด
   */
  @Input()
  open = false;

  /**
   * แจ้ง Layout ให้ปิด Sidebar
   */
  @Output()
  readonly close = new EventEmitter<void>();

  readonly menuItems = MENU_ITEMS;

  readonly expandedMenus = signal<string[]>([]);

  readonly icons = {
    'layout-dashboard': LayoutDashboard,
    package: Package,
    boxes: Boxes,
    tags: Tags,
    'package-plus': PackagePlus,
    'sliders-horizontal': SlidersHorizontal,
    history: History,
    'shopping-cart': ShoppingCart,
    plus: Plus,
    'clipboard-list': ClipboardList,
    'shopping-bag': ShoppingBag,
    wallet: Wallet,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    banknote: Banknote,
    landmark: Landmark,
    'chart-column': ChartColumn,
    'badge-dollar-sign': BadgeDollarSign,
    settings: Settings,
    ruler: Ruler,
    'credit-card': CreditCard,
    users: Users,
    'chevron-down': ChevronDown,
    x: X,
  };

  getIcon(name?: string) {
    if (!name) {
      return null;
    }

    return this.icons[name as keyof typeof this.icons];
  }

  toggleMenu(label: string): void {
    this.expandedMenus.update((current) => {
      if (current.includes(label)) {
        return current.filter((item) => item !== label);
      }

      return [...current, label];
    });
  }

  isExpanded(label: string): boolean {
    return this.expandedMenus().includes(label);
  }

  hasChildren(item: MenuItem): boolean {
    return !!item.children?.length;
  }

  closeSidebar(): void {
    this.close.emit();
  }
}
