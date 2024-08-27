import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../../interfaces/invoice';
import { Store } from '@ngrx/store';
import {
  selectFilteredInvoices,
  selectInvoiceError,
  selectInvoiceLoading,
} from '../../state/invoices/invoices.selectors';
import { loadInvoices } from '../../state/invoices/invoices.actions';
import { AsyncPipe } from '@angular/common';
import { AppState } from '../../state/app.state';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.sass',
})
export class InvoiceListComponent {
  filteredInvoices$: Observable<Invoice[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    this.filteredInvoices$ = this.store.select(selectFilteredInvoices);
    this.loading$ = this.store.select(selectInvoiceLoading);
    this.error$ = this.store.select(selectInvoiceError);

    this.filteredInvoices$.subscribe((invoices) => console.log(invoices));
  }

  ngOnInit() {
    this.store.dispatch(loadInvoices());
  }
}
