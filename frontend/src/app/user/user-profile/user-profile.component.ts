import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {

  user: User = {
    name: '',
    email: '',
    role: 'user'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  // 🔥 LOAD ORGANIZADO
  private loadUser(): void {
    this.user = {
      name: this.getSafe('name', 'User'),
      email: this.getSafe('email', 'user@openbox.com'),
      role: this.getSafe('role', 'user')
    };
  }

  // 🧠 SAFE GET (evita null/undefined)
  private getSafe(key: string, fallback: string): string {
    const value = localStorage.getItem(key);
    return value && value.trim() !== '' ? value : fallback;
  }

  // 🚪 LOGOUT
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // 🔙 BACK
  goBack(): void {
    this.router.navigate(['/user']);
  }
}