import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const username = localStorage.getItem('username');
    if (!username) {
      this.router.navigate(['/signup']);
      return;
    }
    this.username = username;
  }

  logout() {
    localStorage.removeItem('username');
    this.router.navigate(['/signup']);
  }
}
