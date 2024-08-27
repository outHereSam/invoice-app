import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as InvoiceActions from './invoices.actions';
import { DataService } from '../../services/data.service';

@Injectable()
export class InvoiceEffects {
  constructor(private actions$: Actions, private dataService: DataService) {}

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices),
      mergeMap(() =>
        this.dataService.getAllInvoices().pipe(
          map((invoices) => InvoiceActions.loadInvoicesSuccess({ invoices })),
          catchError((error) =>
            of(InvoiceActions.loadInvoicesFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
