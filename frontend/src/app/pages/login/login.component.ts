import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router'; // 👈 AQUI

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // 👈 AQUI
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
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Preenche todos os campos';
      return;
    }

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

        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },

      error: (err) => {
        this.loading = false;

        if (err.status === 401) {
          this.error = 'Credenciais inválidas';
        } else if (err.status === 403) {
          this.error = 'Conta desativada';
        } else {
          this.error = 'Erro no servidor';
        }
      }
    });
  }
}
