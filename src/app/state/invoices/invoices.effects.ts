import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { merge, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as InvoiceActions from './invoices.actions';
import { DataService } from '../../services/data.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Invoice } from '../../interfaces/invoice';
import { Store } from '@ngrx/store';
import { selectAllInvoices } from './invoices.selectors';

@Injectable()
export class InvoiceEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private localStorageService: LocalstorageService,
    private store: Store
  ) {}

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices),
      mergeMap(() => {
        const invoicesFromLocalStorage =
          this.localStorageService.getItemFromLocalStorage('invoices');

        if (invoicesFromLocalStorage) {
          return of(
            InvoiceActions.loadInvoicesSuccess({
              invoices: invoicesFromLocalStorage,
            })
          );
        } else {
          return this.dataService.getAllInvoices().pipe(
            map((invoices) => {
              this.localStorageService.setItemInLocalStorage(
                'invoices',
                invoices
              );
              return InvoiceActions.loadInvoicesSuccess({ invoices });
            }),
            catchError((error) =>
              of(InvoiceActions.loadInvoicesFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );

  addInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        InvoiceActions.addInvoice,
        InvoiceActions.updateInvoice,
        InvoiceActions.deleteInvoice
      ),
      mergeMap(() =>
        this.store.select(selectAllInvoices).pipe(
          map((invoices: Invoice[]) => {
            this.localStorageService.setItemInLocalStorage(
              'invoices',
              invoices
            );
            return InvoiceActions.addInvoiceSuccess(); // Return an Action
          })
        )
      )
    )
  );
}
