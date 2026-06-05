import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../config';

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  user?: {
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css']
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];

  loading = false;
  error = '';

  private API_URL = `${environment.apiUrl}/admin/products`;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // 🔥 resolve render bug
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // 🔥 escuta updates vindos de outras páginas (ex: user dashboard)
    window.addEventListener('products-updated', () => {
      this.loadProducts();
    });
  }

  // 📦 carregar produtos
  loadProducts(): void {

    this.loading = true;
    this.error = '';

    this.http.get<any>(this.API_URL)
      .subscribe({
        next: (res) => {

          console.log('API RESPONSE:', res); // 🔍 debug

          /**
           * 🔥 SUPORTE A VÁRIOS FORMATOS DE API
           * Laravel pode devolver:
           * - array direto
           * - { data: [...] }
           */
          if (Array.isArray(res)) {
            this.products = res;
          } else if (res?.data && Array.isArray(res.data)) {
            this.products = res.data;
          } else {
            this.products = [];
          }

          this.loading = false;

          // 🔥 força render (resolve teu bug)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar produtos';
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // 🗑 eliminar produto
  deleteProduct(id: number): void {

    const confirmDelete = confirm('Tens certeza que queres eliminar este produto?');
    if (!confirmDelete) return;

    this.http.delete(`${this.API_URL.replace('/admin', '')}/${id}`)
      .subscribe({
        next: () => {

          // 🔥 update imediato na UI
          this.products = this.products.filter(p => p.id !== id);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao eliminar produto';
        }
      });
  }

  // ⚡ performance (IMPORTANTE para grid)
  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
}