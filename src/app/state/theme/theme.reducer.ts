import { createReducer, on } from '@ngrx/store';
import { setTheme, toggleTheme } from './theme.actions';
import { initialThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(toggleTheme, (state) => ({
    ...state,
    mode: state.mode === 'light' ? 'dark' : 'light',
  })),
  on(setTheme, (state, { mode }) => ({ ...state, mode }))
);
