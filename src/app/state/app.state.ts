import { InvoiceState } from './invoices/invoice.state';
import { ThemeState } from './theme/theme.state';

export interface AppState {
  invoice: InvoiceState;
  theme: ThemeState;
}
