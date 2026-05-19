import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
export class UserDashboardComponent implements OnInit {

  email = '';

  servicesCount = 0;
  productsCount = 0;

  purchases: Purchase[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.email = localStorage.getItem('email') || 'user@techflow.com';

    this.loadPurchases();

    // 🔥 escuta mudanças de produtos em outras páginas
    window.addEventListener('products-updated', () => {
      this.loadPurchases();
    });
  }

  // 🔐 Headers com Token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  loadPurchases(): void {

    this.http.get<Purchase[]>('http://127.0.0.1:8000/api/products', this.getHeaders())
      .subscribe({
        next: (data) => {
          this.purchases = Array.isArray(data) ? data : [];
          this.productsCount = this.purchases.length;
        },
        error: (err) => {
          console.error('Erro ao carregar compras:', err);
        }
      });
  }

  deletePurchase(id: number): void {

    if (!confirm('Deseja cancelar esta aquisição?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/products/${id}`, this.getHeaders())
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