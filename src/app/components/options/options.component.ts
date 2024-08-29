import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { updateFilters } from '../../state/invoices/invoices.actions';
import { selectTotalInvoices } from '../../state/invoices/invoices.selectors';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [],
  templateUrl: './options.component.html',
  styleUrl: './options.component.sass',
})
export class OptionsComponent {
  count: number = 0;
  constructor(private store: Store<AppState>) {
    this.store.select(selectTotalInvoices).subscribe((count) => {
      this.count = count;
    });
  }
  updateFilter(filterType: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.store.dispatch(updateFilters({ filterType, filterValue: checked }));
  }
}
