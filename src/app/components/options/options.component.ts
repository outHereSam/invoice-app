import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { updateFilters } from '../../state/invoices/invoices.actions';
import {
  selectFilters,
  selectTotalInvoices,
} from '../../state/invoices/invoices.selectors';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './options.component.html',
  styleUrl: './options.component.sass',
})
export class OptionsComponent {
  count: number = 0;
  filters$: Observable<{ paid: boolean; pending: boolean; draft: boolean }>;
  constructor(private store: Store<AppState>) {
    this.store.select(selectTotalInvoices).subscribe((count) => {
      this.count = count;
    });
    this.filters$ = this.store.select(selectFilters);
  }
  updateFilter(filterType: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(updateFilters({ filterType, filterValue: checked }));
  }
}
