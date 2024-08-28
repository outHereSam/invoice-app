import { createReducer, on } from '@ngrx/store';
import {
  loadInvoicesSuccess,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  updateFilters,
  loadInvoices,
  loadInvoicesFailure,
} from './invoices.actions';
import { initialInvoiceState, invoiceAdapter } from './invoice.state';

export const invoiceReducer = createReducer(
  initialInvoiceState,
  on(loadInvoices, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadInvoicesSuccess, (state, { invoices }) =>
    invoiceAdapter.setAll(invoices, { ...state, loading: false, error: null })
  ),
  on(loadInvoicesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addInvoice, (state, { invoice }) => invoiceAdapter.addOne(invoice, state)),
  on(updateInvoice, (state, { invoice }) =>
    invoiceAdapter.updateOne({ id: invoice.id, changes: invoice }, state)
  ),
  on(deleteInvoice, (state, { id }) => invoiceAdapter.removeOne(id, state)),
  on(updateFilters, (state, { filterType, filterValue }) => ({
    ...state,
    filters: { ...state.filters, [filterType]: filterValue },
  }))
);
