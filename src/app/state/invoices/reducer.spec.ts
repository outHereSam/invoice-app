import { Invoice } from '../../interfaces/invoice';
import { invoiceReducer } from './invoices.reducer';
import * as InvoiceActions from './invoices.actions';
import { invoiceAdapter, initialInvoiceState } from './invoice.state';

describe('Invoice Reducer', () => {
  const createInvoice = (id: string, amount: number): Invoice => ({
    id,
    createdAt: new Date().toISOString(),
    paymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    description: 'Test invoice',
    paymentTerms: 30,
    clientName: 'Test Client',
    clientEmail: 'test@example.com',
    status: 'pending',
    senderAddress: {
      street: '123 Sender St',
      city: 'Sender City',
      postCode: 'S12 3AB',
      country: 'Sender Country',
    },
    clientAddress: {
      street: '456 Client St',
      city: 'Client City',
      postCode: 'C45 6DE',
      country: 'Client Country',
    },
    items: [
      {
        name: 'Test Item',
        quantity: 1,
        price: amount,
        total: amount,
      },
    ],
    total: amount,
  });

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = invoiceReducer(initialInvoiceState, action);

      expect(state).toBe(initialInvoiceState);
    });
  });

  describe('loadInvoices action', () => {
    it('should set loading to true and clear any errors', () => {
      const newState = invoiceReducer(
        initialInvoiceState,
        InvoiceActions.loadInvoices()
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('loadInvoicesSuccess action', () => {
    it('should set loading to false and update invoices', () => {
      const invoices = [createInvoice('1', 100), createInvoice('2', 200)];
      const newState = invoiceReducer(
        initialInvoiceState,
        InvoiceActions.loadInvoicesSuccess({ invoices })
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.ids.length).toBe(2);
      expect(newState.entities['1']).toEqual(invoices[0]);
      expect(newState.entities['2']).toEqual(invoices[1]);
    });
  });

  describe('loadInvoicesFailure action', () => {
    it('should set loading to false and set the error', () => {
      const error = 'Error loading invoices';
      const newState = invoiceReducer(
        initialInvoiceState,
        InvoiceActions.loadInvoicesFailure({ error })
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(error);
    });
  });

  describe('addInvoice action', () => {
    it('should add the invoice to the state', () => {
      const invoice = createInvoice('3', 300);
      const newState = invoiceReducer(
        initialInvoiceState,
        InvoiceActions.addInvoice({ invoice })
      );

      expect(newState.ids).toContain('3');
      expect(newState.entities['3']).toEqual(invoice);
    });
  });

  describe('updateInvoice action', () => {
    it('should update the invoice in the state', () => {
      const originalInvoice = createInvoice('1', 100);
      const initialState = invoiceAdapter.setAll(
        [originalInvoice],
        initialInvoiceState
      );

      const updatedInvoice: Invoice = {
        ...originalInvoice,
        total: 150,
        items: [{ name: 'Updated Item', quantity: 1, price: 150, total: 150 }],
      };

      const newState = invoiceReducer(
        initialState,
        InvoiceActions.updateInvoice({ invoice: updatedInvoice })
      );

      const updatedInvoiceInState = newState.entities['1'];
      expect(updatedInvoiceInState).toBeDefined();
      if (updatedInvoiceInState) {
        expect(updatedInvoiceInState.total).toBe(150);
        expect(updatedInvoiceInState.items[0].total).toBe(150);
      }
    });
  });

  describe('deleteInvoice action', () => {
    it('should remove the invoice from the state', () => {
      const invoice = createInvoice('1', 100);
      const initialState = invoiceAdapter.setAll(
        [invoice],
        initialInvoiceState
      );
      const newState = invoiceReducer(
        initialState,
        InvoiceActions.deleteInvoice({ id: '1' })
      );

      expect(newState.ids).not.toContain('1');
      expect(newState.entities['1']).toBeUndefined();
    });
  });

  describe('updateFilters action', () => {
    it('should update the filters in the state', () => {
      const filters = { paid: true, pending: false, draft: false };
      const newState = invoiceReducer(
        initialInvoiceState,
        InvoiceActions.updateFilters({ filters })
      );

      expect(newState.filters).toEqual(filters);
    });
  });
});
