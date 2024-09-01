import { Component, inject, Input } from '@angular/core';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { deleteInvoice } from '../../state/invoices/invoices.actions';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.sass',
})
export class ConfirmationModalComponent {
  confirmationModalService: ConfirmationModalService = inject(
    ConfirmationModalService
  );
  router = inject(Router);
  store = inject(Store);
  @Input() invoiceId: string | null = '';

  deleteInvoice() {
    if (this.invoiceId !== null) {
      this.store.dispatch(deleteInvoice({ id: this.invoiceId }));
      this.router.navigate(['']);
    } else {
      console.error('invoiceId is null');
    }

    this.confirmationModalService.closeModal();
    this.router.navigate(['']);
  }
}
