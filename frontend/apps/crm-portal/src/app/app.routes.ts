import { Route } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () => import('./features/sign-in/sign-in.component').then(c => c.SignInComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(c => c.ProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory.component').then(c => c.InventoryComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/reviews/reviews.component').then(c => c.ReviewsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
