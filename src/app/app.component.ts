import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail.component';
import { AppPanelComponent } from './components/app-panel/app-panel.component';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { loadInvoices } from './state/invoices/invoices.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    InvoiceDetailComponent,
    AppPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'invoice-app';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(loadInvoices());
  }
}
