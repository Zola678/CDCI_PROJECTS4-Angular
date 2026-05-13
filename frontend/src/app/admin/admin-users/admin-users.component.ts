import { Component, OnInit } from '@angular/core';
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

  selectedUser: User | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading = true;
    this.error = '';

    this.http.get<User[]>('http://127.0.0.1:8000/api/users')
      .subscribe({
        next: (data) => {

          this.users = Array.isArray(data) ? data : [];

          this.loading = false;
        },

        error: (err) => {
          console.error(err);
          this.error = 'Erro ao carregar utilizadores';
          this.loading = false;
        }
      });
  }

  deleteUser(id: number): void {

    if (!confirm('Tens certeza que queres eliminar este utilizador?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/users/${id}`)
      .subscribe({
        next: () => {

          this.users = this.users.filter(u => u.id !== id);

        },

        error: (err) => {
          console.error(err);
          this.error = 'Erro ao eliminar utilizador';
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