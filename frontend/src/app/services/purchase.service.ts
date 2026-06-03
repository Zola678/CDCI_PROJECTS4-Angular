import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PurchasePayload {
  id: number;
  name: string;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  // mantém a lista actual em memória durante a sessão
  private purchasesSubject = new BehaviorSubject<PurchasePayload[]>([]);

  purchases$ = this.purchasesSubject.asObservable();

  push(p: PurchasePayload) {
    const current = this.purchasesSubject.getValue();
    // evita duplicados por id
    if (!current.find(x => x.id === p.id)) {
      this.purchasesSubject.next([p, ...current]);
    }
  }

  setAll(list: PurchasePayload[]) {
    this.purchasesSubject.next(list);
  }

  clear() {
    this.purchasesSubject.next([]);
  }
}
