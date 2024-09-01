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
import { ModalService } from '../../services/modal.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    InvoiceFormComponent,
    RouterLink,
    TitleCasePipe,
    InvoiceComponent,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.sass',
  providers: [ConfirmationService, MessageService],
})
export class InvoiceDetailComponent {
  invoice$: Observable<Invoice | undefined>;
  invoiceId: string | null = '';

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    protected modalService: ModalService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    protected confirmModalService: ConfirmationModalService
  ) {
    this.invoice$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.invoiceId = params.get('invoiceId');
        return this.store.select(selectInvoiceById(this.invoiceId || ''));
      })
    );
  }

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to delete invoice #${this.invoiceId}? This action cannot be undone.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  markAsPaid(id: string) {
    this.store.dispatch(updateInvoice({ invoice: { id: id, status: 'paid' } }));
  }

  markAsPending(id: string) {
    this.store.dispatch(
      updateInvoice({ invoice: { id: id, status: 'pending' } })
    );
  }
}
