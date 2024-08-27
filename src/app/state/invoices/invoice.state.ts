import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Invoice } from '../../interfaces/invoice';

export interface InvoiceState extends EntityState<Invoice> {
  invoices: Invoice[];
  filters: {
    paid: boolean;
    pending: boolean;
    draft: boolean;
  };
  error: null;
  loading: false;
}

export const invoiceAdapter = createEntityAdapter<Invoice>({
  selectId: (invoice: Invoice) => invoice.id,
  sortComparer: false,
});

export const initialInvoiceState: InvoiceState = invoiceAdapter.getInitialState(
  {
    invoices: [],
    filters: {
      paid: false,
      pending: false,
      draft: false,
    },
    error: null,
    loading: false,
  }
);
