import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import {
  loadTheme,
  setTheme,
  toggleTheme,
} from '../../state/theme/theme.actions';
import { selectThemeMode } from '../../state/theme/theme.selectors';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-app-panel',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './app-panel.component.html',
  styleUrl: './app-panel.component.sass',
})
export class AppPanelComponent {
  themeMode$: Observable<'light' | 'dark'>;
  constructor(private store: Store<AppState>) {
    this.themeMode$ = this.store.select(selectThemeMode);
  }

  ngOnInit() {
    this.store.dispatch(loadTheme());
  }

  onToggleTheme() {
    this.store.dispatch(toggleTheme());
  }
}
