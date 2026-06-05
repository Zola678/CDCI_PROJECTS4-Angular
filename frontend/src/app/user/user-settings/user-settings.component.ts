import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../config';

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

  private API_URL = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTheme();
  }

  // 🔹 carregar dados do user
  loadUser(): void {
    this.user.name = this.cookieService.get('name') || 'User';
    this.user.email = this.cookieService.get('email') || 'user@openbox.com';
    this.user.role = this.cookieService.get('role') || 'user';
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

  // 🔹 logout
  logout(): void {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }

  // 🔥 DELETE REAL NO BACKEND
  deleteAccount(): void {

    if (!confirm('⚠ Tens certeza que queres apagar a conta permanentemente?')) return;

    this.loading = true;
    this.error = '';

    this.http.delete(`${this.API_URL}/user/delete`).subscribe({
      next: () => {

        // limpa tudo
        this.cookieService.deleteAll();

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