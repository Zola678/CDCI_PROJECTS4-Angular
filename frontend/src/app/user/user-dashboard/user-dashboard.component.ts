import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.email = localStorage.getItem('email') || 'user@techflow.com';

    this.loadPurchases();

    // 🔥 escuta mudanças de produtos em outras páginas
    window.addEventListener('products-updated', () => {
      this.loadPurchases();
    });
  }

  loadPurchases(): void {

    const data = localStorage.getItem('purchases');

    this.purchases = data ? JSON.parse(data) : [];

    this.productsCount = this.purchases.length;
  }

  deletePurchase(id: number): void {

    this.purchases = this.purchases.filter(p => p.id !== id);

    localStorage.setItem('purchases', JSON.stringify(this.purchases));

    window.dispatchEvent(new Event('products-updated'));
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}