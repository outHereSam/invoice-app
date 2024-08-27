import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {
  loadInvoicesSuccess,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  updateFilters,
} from './invoices.actions';
import { initialInvoiceState, invoiceAdapter } from './invoice.state';

export const invoiceReducer = createReducer(
  initialInvoiceState,
  on(loadInvoicesSuccess, (state, { invoices }) =>
    invoiceAdapter.setAll(invoices, state)
  ),
  on(addInvoice, (state, { invoice }) => invoiceAdapter.addOne(invoice, state)),
  on(updateInvoice, (state, { invoice }) =>
    invoiceAdapter.updateOne({ id: invoice.id, changes: invoice }, state)
  ),
  on(deleteInvoice, (state, { id }) => invoiceAdapter.removeOne(id, state)),
  on(updateFilters, (state, { filters }) => ({ ...state, filters }))
);
