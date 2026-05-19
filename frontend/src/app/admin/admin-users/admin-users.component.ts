import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  products?: any[];
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {

  users: User[] = [];

  loading = true;
  error = '';

  selectedUser: User | null = null;

  private API_URL = 'http://127.0.0.1:8000/api/admin/users';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadUsers(): void {

    this.loading = true;
    this.error = '';

    this.http.get<User[]>(this.API_URL, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {

          this.users = Array.isArray(data) ? data : [];

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar utilizadores';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteUser(id: number): void {

    if (!confirm('Tens certeza que queres eliminar este utilizador?')) return;

    this.http.delete(`${this.API_URL}/${id}/force`, { headers: this.getHeaders() })
      .subscribe({
        next: () => {

          this.users = this.users.filter(u => u.id !== id);
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
          this.error = 'Erro ao eliminar utilizador';
          this.cdr.detectChanges();
        }
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
}