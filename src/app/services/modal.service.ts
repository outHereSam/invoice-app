import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpened: boolean = false;

  constructor() {}

  openModal() {
    this.isOpened = true;
    document.body.classList.add('no-scroll');
  }

  closeModal() {
    this.isOpened = false;
    document.body.classList.remove('no-scroll');
  }
}
