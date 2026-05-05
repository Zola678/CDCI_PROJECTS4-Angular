import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 👈 IMPORTANTE
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(): void {

    this.error = '';
    this.success = '';

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Preenche todos os campos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'As passwords não coincidem';
      return;
    }

    this.loading = true;

    // 🔥 AQUI ESTÁ A CHAMADA REAL
    this.http.post('http://127.0.0.1:8000/api/register', {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmPassword
    }).subscribe({

      next: (res: any) => {
        this.loading = false;
        this.success = 'Conta criada com sucesso';

        // 🚀 opcional: redirecionar para login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: (err) => {
        this.loading = false;

        if (err.status === 422) {
          this.error = 'Dados inválidos ou email já existe';
        } else {
          this.error = 'Erro no servidor';
        }
      }
    });
  }
}
