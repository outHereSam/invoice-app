import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { invoiceReducer } from './state/invoices/invoices.reducer';
import { InvoiceEffects } from './state/invoices/invoices.effects';
import { ThemeEffects } from './state/theme/theme.effects';
import { themeReducer } from './state/theme/theme.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideEffects(InvoiceEffects, ThemeEffects),
    provideState({
      name: 'invoices',
      reducer: invoiceReducer,
    }),
    provideState({
      name: 'theme',
      reducer: themeReducer,
    }),
    provideHttpClient(),
  ],
};
