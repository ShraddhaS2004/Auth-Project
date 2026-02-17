import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:5105/api/auth';

  constructor(private http: HttpClient) {}

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
