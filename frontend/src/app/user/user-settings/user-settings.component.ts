import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
export class UserSettingsComponent implements OnInit {

  user: User = {
    name: '',
    email: '',
    role: 'user'
  };

  darkMode = false;
  loading = false;
  error = '';

  private API_URL = 'http://127.0.0.1:8000/api';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTheme();
  }

  // 🔹 carregar dados do user
  loadUser(): void {
    this.user.name = localStorage.getItem('name') || 'User';
    this.user.email = localStorage.getItem('email') || 'user@openbox.com';
    this.user.role = localStorage.getItem('role') || 'user';
  }

  // 🔹 tema
  loadTheme(): void {
    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;

    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');

    this.applyTheme();
  }

  applyTheme(): void {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(this.darkMode ? 'dark' : 'light');
  }

  // 🔹 headers auth
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 🔹 logout
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔥 DELETE REAL NO BACKEND
  deleteAccount(): void {

    if (!confirm('⚠ Tens certeza que queres apagar a conta permanentemente?')) return;

    this.loading = true;
    this.error = '';

    this.http.delete(`${this.API_URL}/user/delete`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {

        // limpa tudo
        localStorage.clear();

        // redireciona
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);

        this.error = 'Erro ao apagar conta';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }
}