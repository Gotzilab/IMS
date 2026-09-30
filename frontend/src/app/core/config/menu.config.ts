import { MenuItem } from '../models/menu/menu-item.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'layout-dashboard',
  },

  {
    label: 'สินค้าและสต็อก',
    icon: 'package',
    children: [
      {
        label: 'สินค้า',
        route: '/products',
        icon: 'boxes',
      },
      {
        label: 'หมวดหมู่สินค้า',
        route: '/products/categories',
        icon: 'tags',
      },
      {
        label: 'รับเข้าสินค้า',
        route: '/products/receive',
        icon: 'package-plus',
      },
      {
        label: 'ปรับสต็อก',
        route: '/products/adjustment',
        icon: 'sliders-horizontal',
      },
      {
        label: 'ประวัติสต็อก',
        route: '/products/stock-history',
        icon: 'history',
      },
    ],
  },

  {
    label: 'รับซื้อ',
    icon: 'shopping-cart',
    children: [
      {
        label: 'รับซื้อสินค้า',
        route: '/purchases/create',
        icon: 'plus',
      },
      {
        label: 'ประวัติการรับซื้อ',
        route: '/purchases',
        icon: 'clipboard-list',
      },
    ],
  },

  {
    label: 'ขายสินค้า',
    icon: 'shopping-bag',
    children: [
      {
        label: 'ขายสินค้า',
        route: '/sales/create',
        icon: 'plus',
      },
      {
        label: 'ประวัติการขาย',
        route: '/sales',
        icon: 'clipboard-list',
      },
    ],
  },

  {
    label: 'การเงิน',
    icon: 'wallet',
    children: [
      {
        label: 'รายรับ',
        route: '/finance/income',
        icon: 'trending-up',
      },
      {
        label: 'รายจ่าย',
        route: '/finance/expenses',
        icon: 'trending-down',
      },
      {
        label: 'เงินสด',
        route: '/finance/cash',
        icon: 'banknote',
      },
      {
        label: 'ธนาคาร',
        route: '/finance/bank',
        icon: 'landmark',
      },
    ],
  },

  {
    label: 'รายงาน',
    icon: 'chart-column',
    children: [
      {
        label: 'รายงานสต็อก',
        route: '/reports/stock',
        icon: 'boxes',
      },
      {
        label: 'รายงานรับซื้อ',
        route: '/reports/purchases',
        icon: 'shopping-cart',
      },
      {
        label: 'รายงานขาย',
        route: '/reports/sales',
        icon: 'shopping-bag',
      },
      {
        label: 'กำไร',
        route: '/reports/profit',
        icon: 'badge-dollar-sign',
      },
      {
        label: 'รายรับ-รายจ่าย',
        route: '/reports/finance',
        icon: 'chart-column',
      },
    ],
  },

  {
    label: 'ตั้งค่า',
    icon: 'settings',
    children: [
      {
        label: 'หมวดหมู่สินค้า',
        route: '/settings/categories',
        icon: 'tags',
      },
      {
        label: 'หน่วยสินค้า',
        route: '/settings/units',
        icon: 'ruler',
      },
      {
        label: 'วิธีชำระเงิน',
        route: '/settings/payment-methods',
        icon: 'credit-card',
      },
      {
        label: 'ผู้ใช้งาน',
        route: '/settings/users',
        icon: 'users',
      },
    ],
  },
];
