import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { ThemeState } from './theme.state';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');
export const selectTheme = createSelector(
  selectThemeState,
  (state: ThemeState) => state.mode
);
