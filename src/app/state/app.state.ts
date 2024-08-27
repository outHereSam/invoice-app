import { Invoice } from '../interfaces/invoice';

export interface AppState {
  invoices: Invoice[];
  filters: {
    paid: boolean;
    pending: boolean;
    draft: boolean;
  };
  error: null;
  loading: false;
}
