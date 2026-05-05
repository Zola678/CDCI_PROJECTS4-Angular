import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css']
})
export class AdminProductsComponent implements OnInit {

  products: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/products')
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar produtos';
          this.loading = false;
        }
      });
  }

  deleteProduct(id: number): void {
    this.http.delete(`http://127.0.0.1:8000/api/products/${id}`)
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: () => {
          this.error = 'Erro ao eliminar produto';
        }
      });
  }
}
