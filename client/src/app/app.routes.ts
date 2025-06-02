import { Routes } from '@angular/router';
import { ProductListComponent } from './features/product/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/product/product-item/product-item.component').then(
            (m) => m.ProductItemComponent
          ),
      },
    ],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
];
