import { createAction, props } from '@ngrx/store';

export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ mode: string }>()
);
