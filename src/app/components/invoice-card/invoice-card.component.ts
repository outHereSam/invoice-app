import { Component, Input } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-card',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.sass',
})
export class InvoiceCardComponent {
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
