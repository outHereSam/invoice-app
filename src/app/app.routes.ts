import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'invoice-detail/:id', component: InvoiceDetailComponent },
];
