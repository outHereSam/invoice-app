import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UniqueIdService {
  private usedIds: Set<string> = new Set();

  generateUniqueId(): string {
    let id: string;
    do {
      const letters = Array.from({ length: 2 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join('');

      const digits = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 10)
      ).join('');

      id = `${letters}${digits}`;
    } while (this.usedIds.has(id));

    this.usedIds.add(id);
    return id;
  }
}
