import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  usersCount = 0;
  productsCount = 0;

  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {

    // 👤 USERS
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/users')
      .subscribe({
        next: (users) => {
          this.usersCount = users.length;
        },
        error: (err) => {
          console.error('Error loading users', err);
        }
      });

    // 📦 PRODUCTS
    this.http.get<any[]>('http://127.0.0.1:8000/api/admin/products')
      .subscribe({
        next: (products) => {
          this.productsCount = products.length;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products', err);
          this.loading = false;
        }
      });
  }
}
