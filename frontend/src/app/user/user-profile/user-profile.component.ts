import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {

  user = {
    name: '',
    email: '',
    role: 'user'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {

    // 🔥 carregar dados reais do localStorage
    this.user.name = localStorage.getItem('name') || 'User';
    this.user.email = localStorage.getItem('email') || 'user@techflow.com';
    this.user.role = localStorage.getItem('role') || 'user';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }
}