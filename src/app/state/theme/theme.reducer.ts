import { createReducer, on } from '@ngrx/store';
import { setTheme } from './theme.actions';
import { initialThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(setTheme, (state, { mode }) => ({ ...state, mode: mode }))
);
