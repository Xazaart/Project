import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  newName = '';
  newDesc = '';
  errorMessage = '';

  constructor(private service: CategoryService, public auth: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.service.list().subscribe({
      next: (d) => this.categories = d,
      error: (err) => this.errorMessage = err.error?.detail || 'Failed to load'
    });
  }

  addCategory() {
    if (!this.newName) return;
    this.service.create({ name: this.newName, description: this.newDesc }).subscribe({
      next: () => { this.newName = ''; this.newDesc = ''; this.load(); },
      error: (err) => this.errorMessage = err.error?.name?.[0] || 'Could not create category'
    });
  }
}
