import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { PurchaseService, PurchasePayload } from '../../services/purchase.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../config';

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
  private productsUpdatedListener: any;
  private purchaseSuccessListener: any;
  private routerSub: Subscription | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private purchaseService: PurchaseService,
    private cookieService: CookieService
  ) {}

  ngOnDestroy(): void {
    if (this.purchasesSub) {
      this.purchasesSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('products-updated', this.productsUpdatedListener);
      window.removeEventListener('purchase-success', this.purchaseSuccessListener);
    }
  }

  ngOnInit(): void {
    this.email = this.cookieService.get('email') || 'user@techflow.com';
    this.loadPurchases();

    // Listener para atualizações de produtos
    this.productsUpdatedListener = (e: any) => {
      try {
        const detail = e?.detail;
        if (detail) {
          const p: Purchase = {
            id: detail.id,
            name: detail.name,
            date: new Date(detail.created_at || Date.now()).toLocaleString()
          };
          if (!this.purchases.find(x => x.id === p.id)) {
            this.purchases.unshift(p);
            this.productsCount = this.purchases.length;
            this.cdr.detectChanges();
          }
        } else {
          this.loadPurchases();
        }
      } catch (err) {
        this.loadPurchases();
      }
    };

    // Listener para sucesso de compra
    this.purchaseSuccessListener = (ev: any) => {
      try {
        const msg = ev?.detail || 'Compra efetuada com sucesso!';
        this.successMessage = msg;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 4000);
      } catch (err) {
        console.error('Erro ao processar evento', err);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('products-updated', this.productsUpdatedListener);
      window.addEventListener('purchase-success', this.purchaseSuccessListener);
    }

    // Recarregar ao navegar para /user
    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.urlAfterRedirects.startsWith('/user')) {
          this.loadPurchases();
          this.successMessage = '';
          this.cdr.detectChanges();
        }
      }
    });

    // Subscrever ao serviço de compras (in-memory)
    this.purchasesSub = this.purchaseService.purchases$.subscribe((list: PurchasePayload[]) => {
      if (list && list.length > 0) {
        list.forEach(p => {
          const mapped: Purchase = { 
            id: p.id, 
            name: p.name, 
            date: p.date ? new Date(p.date).toLocaleString() : new Date().toLocaleString() 
          };
          if (!this.purchases.find(x => x.id === mapped.id)) {
            this.purchases.unshift(mapped);
          }
        });
        this.productsCount = this.purchases.length;
        this.cdr.detectChanges();
      }
    });
  }

  loadPurchases(): void {
    this.http.get<any[]>(`${environment.apiUrl}/products`)
      .subscribe({
        next: (data) => {
          const list = Array.isArray(data) ? data : [];
          this.purchases = list.map(p => ({
            id: p.id,
            name: p.name,
            date: p.created_at ? new Date(p.created_at).toLocaleString() : (p.date || new Date().toLocaleString())
          }));
          this.productsCount = this.purchases.length;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar compras:', err);
        }
      });
  }

  deletePurchase(id: number): void {
    if (!confirm('Deseja cancelar esta aquisição?')) return;

    this.http.delete(`${environment.apiUrl}/products/${id}`)
      .subscribe({
        next: () => {
          this.loadPurchases();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('products-updated'));
          }
        },
        error: (err) => {
          console.error('Erro ao eliminar:', err);
        }
      });
  }

  logout(): void {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
