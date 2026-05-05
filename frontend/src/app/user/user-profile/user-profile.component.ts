import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent {

  // 👤 modelo completo (tem que bater com o HTML)
  user = {
    name: '',
    email: '',
    role: 'user' // 👈 adiciona isto para evitar erro
  };

}
