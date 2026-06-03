import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  apiDebug = '';

  selectedUser: User | null = null;

  private API_URL = 'http://localhost:8000/api/admin/users';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;
    this.error = '';

    this.http.get<User[]>(this.API_URL)
      .subscribe({
        next: (data) => {

          this.users = Array.isArray(data) ? data : [];
          // debug: guardar payload JSON e logar
          this.apiDebug = JSON.stringify(data, null, 2);
          console.debug('Admin users payload:', data);

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar utilizadores: ' + (err?.message || err?.statusText || 'desconhecido');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteUser(id: number): void {

    if (!confirm('Tens certeza que queres eliminar este utilizador?')) return;

    this.http.delete(`${this.API_URL}/${id}/force`)
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