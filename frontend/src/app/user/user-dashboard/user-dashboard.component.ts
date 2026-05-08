import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent {

  email = localStorage.getItem('email') || 'User';

  products: any[] = [];
  purchases: any[] = [];

  limit = 10;

  constructor(private router: Router) {
    this.loadData();
  }

  loadData() {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
    this.purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  }

  @HostListener('window:products-updated')
  refresh() {
    this.loadData();
  }

  // 📊 métricas
  get servicesCount(): number {
    return 2; // mock (podes ligar à API depois)
  }

  get productsCount(): number {
    return this.products.length;
  }

  get used(): number {
    return this.purchases.length;
  }

  get progress(): number {
    return this.limit === 0 ? 0 : Math.min(100, (this.used / this.limit) * 100);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
