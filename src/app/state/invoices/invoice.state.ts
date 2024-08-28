import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Invoice } from '../../interfaces/invoice';

export interface Filters {
  paid: boolean;
  pending: boolean;
  draft: boolean;
}

export interface InvoiceState extends EntityState<Invoice> {
  invoices: Invoice[];
  filters: Filters;
  error: string | null;
  loading: boolean;
}

export const invoiceAdapter: EntityAdapter<Invoice> =
  createEntityAdapter<Invoice>({
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
