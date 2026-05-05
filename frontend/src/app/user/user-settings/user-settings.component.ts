import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
export class UserSettingsComponent {

  // 👤 user model (obrigatório para ngModel funcionar)
  user = {
    name: 'Zola',
    email: 'zola@test.com'
  };

  // 🌙 tema
  darkMode = false;

  toggleTheme() {
    this.darkMode = !this.darkMode;

    // opcional: aplicar no body
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
