import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  products?: any[];
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  users: User[] = [];

  usersCount = 0;
  productsCount = 0;

  loading = true;
  selectedUser: User | null = null;

  email = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('email') || 'admin@techflow.com';
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.http.get<any>('http://127.0.0.1:8000/api/admin/users')
      .subscribe({
        next: (res) => {

          this.users = Array.isArray(res) ? res : [];

          this.usersCount = this.users.length;

          this.productsCount = this.users.reduce((acc, user) => {
            return acc + (user.products?.length || 0);
          }, 0);

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  deleteUser(userId: number): void {

    if (!confirm('Tens certeza que queres eliminar este usuário?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.usersCount = this.users.length;
        },
        error: (err) => console.error(err)
      });
  }

  viewUser(user: User): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = null;
  }

  trackByUser(index: number, user: User) {
    return user.id;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}