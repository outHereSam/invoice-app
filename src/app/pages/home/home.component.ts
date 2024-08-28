import { Component } from '@angular/core';
import { InvoiceListComponent } from '../../components/invoice-list/invoice-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InvoiceListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {}
