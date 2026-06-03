import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PurchaseService, PurchasePayload } from '../../services/purchase.service';
import { CookieService } from 'ngx-cookie-service';

interface Purchase {
  id: number;
  name: string;
  date: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  email = '';

  servicesCount = 0;
  productsCount = 0;

  purchases: Purchase[] = [];
  successMessage: string = '';
  private purchasesSub: Subscription | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private cookieService: CookieService
  ) {}

  ngOnDestroy(): void {
    try {
      if (this.purchasesSub) this.purchasesSub.unsubscribe();
    } catch (e) {}
  }

  ngOnInit(): void {

    this.email = this.cookieService.get('email') || 'user@techflow.com';

    this.loadPurchases();
...
  logout(): void {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
        if (detail) {
          // transformar detalhe num Purchase simples
          const p: Purchase = {
            id: detail.id,
            name: detail.name,
            date: new Date(detail.created_at || Date.now()).toLocaleString()
          };
          // evita duplicados
          if (!this.purchases.find(x => x.id === p.id)) {
            this.purchases.unshift(p);
            this.productsCount = this.purchases.length;
            // garantir que Angular detecte a alteração (evento externo)
            try { this.cdr.detectChanges(); } catch(e) {}
          }
        } else {
          this.loadPurchases();
        }
      } catch (err) {
        console.error('Erro a processar evento products-updated', err);
        this.loadPurchases();
      }
    });

    // mensagem de sucesso vinda de compra noutra página
    window.addEventListener('purchase-success', (ev: any) => {
      try {
        console.debug('user-dashboard received purchase-success event; detail=', ev?.detail);
        const msg = ev?.detail || 'Compra efetuada com sucesso!';
        this.successMessage = msg;
        // garantir render
        try { this.cdr.detectChanges(); } catch(e) {}
        setTimeout(() => {
          this.successMessage = '';
          try { this.cdr.detectChanges(); } catch(e) {}
        }, 4000);
      } catch (err) {
        console.error('Erro ao processar purchase-success no dashboard', err);
      }
    });
    // garantir reload das compras sempre que o utilizador navega para o painel
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || (ev as any).url || '';
        // usar startsWith para capturar '/user' e variações como '/user/' ou '/user?id=...'
        if (url.startsWith('/user')) {
          // recarregar compras ao entrar no painel (resolve clique duplo/route reuse)
          console.debug('NavigationEnd to /user detected, reloading purchases. url=', url);
          this.loadPurchases();
          // garantir que não mostramos mensagens antigas quando navegam para o painel
          this.successMessage = '';
          try { this.cdr.detectChanges(); } catch(e) {}
        }
      }
    });

    // subscrever ao PurchaseService (in-memory) para garantirmos render imediato dentro da SPA
    try {
      this.purchasesSub = this.purchaseService.purchases$.subscribe((list: PurchasePayload[]) => {
        if (list && list.length > 0) {
          // mapear para Purchase e mesclar sem duplicados (colocar no topo)
          list.forEach(p => {
            const mapped: Purchase = { id: p.id, name: p.name, date: p.date ? new Date(p.date).toLocaleString() : new Date().toLocaleString() };
            if (!this.purchases.find(x => x.id === mapped.id)) {
              this.purchases.unshift(mapped);
            }
          });
          this.productsCount = this.purchases.length;
          try { this.cdr.detectChanges(); } catch(e) {}
        }
      });
    } catch (e) {}
  }

  loadPurchases(): void {
    console.debug('loadPurchases() called');

    this.http.get<any[]>('http://localhost:8000/api/products')
      .subscribe({
        next: (data) => {
          console.debug('loadPurchases() response:', data);
          const list = Array.isArray(data) ? data : [];
          // mapear para a interface Purchase (id, name, date)
          this.purchases = list.map(p => ({
            id: p.id,
            name: p.name,
            date: p.created_at ? new Date(p.created_at).toLocaleString() : (p.date || new Date().toLocaleString())
          }));
          this.productsCount = this.purchases.length;
          try { this.cdr.detectChanges(); } catch(e) {}
        },
        error: (err) => {
          console.error('Erro ao carregar compras:', err);
        }
      });
  }

  deletePurchase(id: number): void {

    if (!confirm('Deseja cancelar esta aquisição?')) return;

    this.http.delete(`http://localhost:8000/api/products/${id}`)
      .subscribe({
        next: () => {
          this.loadPurchases();
          window.dispatchEvent(new Event('products-updated'));
        },
        error: (err) => {
          console.error('Erro ao eliminar:', err);
        }
      });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}