import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private router: Router) {
    this.load();
  }

  load() {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
  }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.price) return;

    const product = {
      id: Date.now(),
      ...this.newProduct
    };

    this.products.push(product);
    this.sync();

    this.newProduct = { name: '', description: '', price: 0 };
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
    this.sync();
  }

  buy(product: any) {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');

    purchases.push({
      name: product.name,
      date: new Date().toLocaleString()
    });

    localStorage.setItem('purchases', JSON.stringify(purchases));

    window.dispatchEvent(new Event('products-updated'));
  }

  sync() {
    localStorage.setItem('products', JSON.stringify(this.products));
    window.dispatchEvent(new Event('products-updated'));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
