import { createAction, props } from '@ngrx/store';
import { Invoice } from '../../interfaces/invoice';
import { Filters } from './invoice.state';

export const loadInvoices = createAction('[Invoice] Load Invoices');
export const loadInvoicesSuccess = createAction(
  '[Invoice] Load Invoices Success',
  props<{ invoices: Invoice[] }>()
);
export const loadInvoicesFailure = createAction(
  '[Invoice] Load Invoices Failure',
  props<{ error: string }>()
);
export const addInvoice = createAction(
  '[Invoice] Add Invoice',
  props<{ invoice: Invoice }>()
);
export const updateInvoice = createAction(
  '[Invoice] Update Invoice',
  props<{ invoice: Partial<Invoice> & { id: string } }>()
);
export const deleteInvoice = createAction(
  '[Invoice] Delete Invoice',
  props<{ id: string }>()
);
export const updateFilters = createAction(
  '[Invoice] Update Filters',
  props<{ filterType: string; filterValue: boolean }>()
);
