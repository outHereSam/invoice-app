import { Invoice } from '../interfaces/invoice';
import { InvoiceState } from './invoices/invoice.state';

export interface AppState {
  invoice: InvoiceState;
  theme: ThemeState;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}
