import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';

  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onLogin() {

    // ⚡ reset rápido de erro
    this.error = '';

    // ⚡ validação local (evita request inútil)
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Preenche todos os campos';
      return;
    }

    if (this.loading) return; // evita spam click

    this.loading = true;

    this.http.post('http://127.0.0.1:8000/api/login', {
      email: this.email,
      password: this.password
    }).subscribe({

      next: (res: any) => {
        this.loading = false;

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('email', res.user_email);

        // ⚡ routing limpo
        const route = res.role === 'admin' ? '/admin' : '/user';
        this.router.navigate([route]);
      },

      error: (err) => {
        this.loading = false;

        // ⚡ respostas mais rápidas e claras
        const status = err.status;

        switch (status) {
          case 401:
            this.error = 'Credenciais inválidas';
            break;

          case 403:
            this.error = 'Conta desativada';
            break;

          case 0:
            this.error = 'Servidor offline';
            break;

          default:
            this.error = 'Erro no servidor';
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/']); // home ou página anterior
  }
}