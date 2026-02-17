import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  user = { username: '', email: '', password: '' };
  isLoading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  // ✅ Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✅ Password validation
  isValidPassword(password: string): boolean {
    // At least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    return passwordRegex.test(password);
  }

  signup() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (!this.isValidPassword(this.user.password)) {
      this.error =
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.auth.signup(this.user).subscribe(
      () => {
        this.isLoading = false;
        localStorage.setItem('username', this.user.username);
        this.router.navigate(['/login']);
      },
      () => {
        this.isLoading = false;
        this.error = 'Signup failed. Please try again.';
      }
    );
  }
}
