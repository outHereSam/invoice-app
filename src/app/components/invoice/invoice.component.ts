import { Component, Input } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.sass',
})
export class InvoiceComponent {
  @Input() invoice: Invoice = {
    id: '',
    createdAt: new Date().toISOString(),
    paymentDue: '',
    description: '',
    paymentTerms: 30,
    clientName: '',
    clientEmail: '',
    status: 'draft',
    senderAddress: {
      street: '',
      city: '',
      postCode: '',
      country: '',
    },
    clientAddress: {
      street: '',
      city: '',
      postCode: '',
      country: '',
    },
    items: [],
    total: 0,
  };
}
