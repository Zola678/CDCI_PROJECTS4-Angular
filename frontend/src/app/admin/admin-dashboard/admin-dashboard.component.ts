import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

interface Product {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  products?: Product[];
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

  loading = false;
  error = '';

  selectedUser: User | null = null;

  email = '';

  private API_URL = 'http://127.0.0.1:8000/api/admin/users';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔥 resolve problema de render
  ) {}

  ngOnInit(): void {
    this.loadUserSession();
    this.loadData();
  }

  // 🔐 sessão
  loadUserSession(): void {
    this.email = localStorage.getItem('email') || 'admin@techflow.com';
  }

  // 🔐 obter headers com token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  // 📡 carregar dados
  loadData(): void {
    this.loading = true;
    this.error = '';

    this.http.get<User[]>(this.API_URL, this.getHeaders())
      .subscribe({
        next: (res) => {

          // 🔥 garante array válido
          this.users = Array.isArray(res) ? res : [];

          // 📊 stats
          this.usersCount = this.users.length;

          this.productsCount = this.users.reduce((total, user) => {
            return total + (user.products?.length || 0);
          }, 0);

          this.loading = false;

          // 🔥 força render (resolve teu bug principal)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar dados';
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // 🗑 eliminar usuário
  deleteUser(userId: number): void {

    const confirmDelete = confirm('Tens certeza que queres eliminar este usuário?');
    if (!confirmDelete) return;

    this.http.delete(`${this.API_URL}/${userId}/force`, this.getHeaders())
      .subscribe({
        next: () => {

          // 🔥 remove localmente (UX rápida)
          this.users = this.users.filter(u => u.id !== userId);

          // 🔄 atualiza stats
          this.updateStats();

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Erro ao eliminar utilizador';
        }
      });
  }

  // 👁 ver usuário
  viewUser(user: User): void {
    this.selectedUser = user;
  }

  // ❌ fechar modal
  closeModal(): void {
    this.selectedUser = null;
  }

  // 📊 atualizar stats
  updateStats(): void {
    this.usersCount = this.users.length;

    this.productsCount = this.users.reduce((total, user) => {
      return total + (user.products?.length || 0);
    }, 0);
  }

  // ⚡ performance
  trackByUser(index: number, user: User): number {
    return user.id;
  }

  // 🚪 logout
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}