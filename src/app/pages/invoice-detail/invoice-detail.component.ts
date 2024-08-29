import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectInvoiceById } from '../../state/invoices/invoices.selectors';
import { Observable, switchMap } from 'rxjs';
import { Invoice } from '../../interfaces/invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {
  deleteInvoice,
  updateInvoice,
} from '../../state/invoices/invoices.actions';
import { InvoiceFormComponent } from '../../components/invoice-form/invoice-form.component';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { InvoiceComponent } from '../../components/invoice/invoice.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    InvoiceFormComponent,
    RouterLink,
    TitleCasePipe,
    InvoiceComponent,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.sass',
})
export class InvoiceDetailComponent {
  invoice$: Observable<Invoice | undefined>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.invoice$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const invoiceId = params.get('invoiceId');
        return this.store.select(selectInvoiceById(invoiceId || ''));
      })
    );
  }

  markAsPaid(id: string) {
    this.store.dispatch(updateInvoice({ invoice: { id: id, status: 'paid' } }));
  }

  markAsPending(id: string) {
    this.store.dispatch(
      updateInvoice({ invoice: { id: id, status: 'pending' } })
    );
  }

  deleteInvoice(id: string) {
    this.store.dispatch(deleteInvoice({ id }));
    this.router.navigate(['']);
  }
}
