import { createSelector, createFeatureSelector } from '@ngrx/store';
import { InvoiceState, invoiceAdapter } from './invoice.state';

export const selectInvoiceState =
  createFeatureSelector<InvoiceState>('invoices');

// Selectors for invoice
export const {
  selectAll: selectAllInvoices,
  selectEntities: selectInvoiceEntities,
  selectIds: selectInvoiceIds,
  selectTotal: selectTotalInvoices,
} = invoiceAdapter.getSelectors(selectInvoiceState);

// Filter selector
export const selectFilters = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.filters
);

// Selected filtered invoices
export const selectFilteredInvoices = createSelector(
  selectAllInvoices,
  selectFilters,
  (invoices, filters) => {
    if (!filters.paid && !filters.pending && !filters.draft) {
      return invoices;
    }
    return invoices.filter(
      (invoice) =>
        (filters.paid && invoice.status === 'paid') ||
        (filters.pending && invoice.status === 'pending') ||
        (filters.draft && invoice.status === 'draft')
    );
  }
);

// Select a single invoice
export const selectInvoiceById = (id: string) =>
  createSelector(selectInvoiceEntities, (entities) => entities[id]);

// Select invoice loading
export const selectInvoiceLoading = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.loading
);

export const selectInvoiceError = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.error
);
