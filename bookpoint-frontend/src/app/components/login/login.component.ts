import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.errorMessage = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Login failed. Check your credentials.';
        this.loading = false;
      }
    });
  }
}
