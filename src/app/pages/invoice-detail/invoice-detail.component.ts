import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectInvoiceById } from '../../state/invoices/invoices.selectors';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.sass',
})
export class InvoiceDetailComponent {
  constructor(private store: Store<AppState>) {}
}
