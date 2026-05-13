import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
export class UserSettingsComponent {

  user = {
    name: '',
    email: '',
    role: 'user'
  };

  darkMode = false;

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.user.name = localStorage.getItem('name') || 'User';
    this.user.email = localStorage.getItem('email') || 'user@techflow.com';
    this.user.role = localStorage.getItem('role') || 'user';

    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    document.body.className = this.darkMode ? 'dark' : 'light';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  deleteAccount(): void {
    if (!confirm('Tens certeza que queres apagar a conta?')) return;

    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }
}