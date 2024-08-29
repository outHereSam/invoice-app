import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail.component';
import { AppPanelComponent } from './components/app-panel/app-panel.component';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.state';
import { loadInvoices } from './state/invoices/invoices.actions';
import { Observable } from 'rxjs';
import { ThemeState } from './state/theme/theme.state';
import { selectThemeMode } from './state/theme/theme.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    InvoiceDetailComponent,
    AppPanelComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'invoice-app';
  themeMode$: Observable<'light' | 'dark'>;

  constructor(private store: Store<AppState>) {
    this.themeMode$ = this.store.select(selectThemeMode);
    this.themeMode$.subscribe((themeMode) => {
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${themeMode}-mode`);
    });
  }

  ngOnInit() {
    this.store.dispatch(loadInvoices());
  }
}
