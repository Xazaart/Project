import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.loading = true;
    this.auth.register(this.username, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err) => {
        this.errorMessage = this.parseError(err);
        this.loading = false;
      }
    });
  }

  private parseError(err: any): string {
    if (err.error?.username) return err.error.username[0];
    if (err.error?.email) return err.error.email[0];
    if (err.error?.password) return err.error.password[0];
    return 'Registration failed';
  }
}
