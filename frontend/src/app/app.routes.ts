import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products/products').then((m) => m.Products),
      },

      {
        path: 'purchases',
        loadComponent: () =>
          import('./features/purchases/pages/purchases-list/purchases-list').then(
            (m) => m.PurchasesList,
          ),
      },

      {
        path: 'sales',
        loadComponent: () => import('./features/sales/pages/sales/sales').then((m) => m.Sales),
      },

      {
        path: 'finance',
        loadComponent: () =>
          import('./features/finance/pages/finance/finance').then((m) => m.Finance),
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/pages/reports/reports').then((m) => m.Reports),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
