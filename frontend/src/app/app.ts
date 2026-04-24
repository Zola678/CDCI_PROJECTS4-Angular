import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  pageTitle = 'System Panel';

  constructor(private router: Router) {

    // Atualiza título automaticamente ao mudar rota
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle(event.url);
      }
    });
  }

  // 🔐 verifica login
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // 👤 user atual
  getUser(): string {
    return localStorage.getItem('user_email') || 'Guest';
  }

  // 🚪 logout global
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    this.router.navigate(['/login']);
  }

  // 🧠 controla título da página
  private updateTitle(url: string): void {
    if (url.includes('dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('login')) {
      this.pageTitle = 'Login';
    } else if (url.includes('register')) {
      this.pageTitle = 'Register';
    } else {
      this.pageTitle = 'System Panel';
    }
  }
}
