import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user-products.html',
  styleUrls: ['./user-products.css']
})
export class UserProductsComponent {

  products: any[] = [];

  newProduct = {
    name: '',
    description: '',
    price: 0
  };

  constructor() {
    this.load();

    // 🔥 sync automático quando houver mudanças
    window.addEventListener('products-updated', () => {
      this.load();
    });
  }

  // 📦 carregar produtos
  load(): void {
    const data = localStorage.getItem('products');
    this.products = data ? JSON.parse(data) : [];
  }

  // ➕ criar produto
  createProduct(): void {

    if (!this.newProduct.name || this.newProduct.price <= 0) return;

    const product = {
      id: Date.now(),
      name: this.newProduct.name,
      description: this.newProduct.description,
      price: this.newProduct.price
    };

    this.products.push(product);
    this.sync();

    this.newProduct = { name: '', description: '', price: 0 };
  }

  // 🗑 eliminar produto
  deleteProduct(id: number): void {

    this.products = this.products.filter(p => p.id !== id);
    this.sync();
  }

  // 🛒 comprar produto
  buy(product: any): void {

    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

    purchases.push({
      id: Date.now(),
      name: product.name,
      date: new Date().toLocaleString()
    });

    localStorage.setItem('purchases', JSON.stringify(purchases));

    // 🔥 padrão correto (UNIFICADO)
    window.dispatchEvent(new Event('products-updated'));
  }

  // 🔄 sincronizar storage
  sync(): void {

    localStorage.setItem('products', JSON.stringify(this.products));

    window.dispatchEvent(new Event('products-updated'));
  }

  // ⚡ performance
  trackById(index: number, item: any): number {
    return item.id;
  }
}