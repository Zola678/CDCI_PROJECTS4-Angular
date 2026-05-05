import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css']
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/users')
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao carregar utilizadores';
          this.loading = false;
        }
      });
  }

  deleteUser(id: number): void {
    this.http.delete(`http://127.0.0.1:8000/api/users/${id}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: () => {
          this.error = 'Erro ao eliminar utilizador';
        }
      });
  }
}
