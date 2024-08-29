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
import { RouterLink } from '@angular/router';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { OptionsComponent } from '../options/options.component';
import { InvoiceCardComponent } from '../invoice-card/invoice-card.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    InvoiceFormComponent,
    OptionsComponent,
    InvoiceCardComponent,
  ],
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
}
