import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InvoiceDetailComponent } from './pages/invoice-detail/invoice-detail.component';
import { AppPanelComponent } from './components/app-panel/app-panel.component';

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
}
