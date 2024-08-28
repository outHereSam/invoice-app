import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'invoice-detail/:id',
    loadComponent: () =>
      import('./pages/invoice-detail/invoice-detail.component').then(
        (m) => m.InvoiceDetailComponent
      ),
  },
  { path: '*', component: HomeComponent },
];
