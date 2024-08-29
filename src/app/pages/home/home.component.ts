import { Component } from '@angular/core';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectFilters } from '../../state/invoices/invoices.selectors';
import { updateFilters } from '../../state/invoices/invoices.actions';
import { OptionsComponent } from '../../components/options/options.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InvoiceListComponent, OptionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  filters$: Observable<{ paid: boolean; pending: boolean; draft: boolean }>;

  constructor(private store: Store<AppState>) {
    this.filters$ = this.store.select(selectFilters);
  }
}
