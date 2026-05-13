import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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

  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;
    this.error = '';

    this.http.get<Product[]>('http://127.0.0.1:8000/api/products')
      .subscribe({
        next: (data) => {
          this.products = Array.isArray(data) ? data : [];
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar produtos';
          this.loading = false;
        }
      });
  }

  deleteProduct(id: number): void {

    if (!confirm('Tens certeza que queres eliminar este produto?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/products/${id}`)
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao eliminar produto';
        }
      });
  }
}