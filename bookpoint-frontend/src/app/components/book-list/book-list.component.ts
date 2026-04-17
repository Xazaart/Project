import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CategoryService } from '../../services/category.service';
import { Book, Category } from '../../models/interfaces';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategory: number | null = null;
  errorMessage = '';
  loading = false;

  private gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  ];

  constructor(private bookService: BookService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();
  }

  loadCategories() {
    this.categoryService.list().subscribe({
      next: (data) => this.categories = data,
      error: () => {}
    });
  }

  loadBooks() {
    this.loading = true;
    this.errorMessage = '';
    this.bookService.list(this.selectedCategory ?? undefined, this.search || undefined).subscribe({
      next: (data) => { this.books = data; this.loading = false; },
      error: (err) => {
        this.errorMessage = err.error?.detail || 'Failed to load books';
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.search = '';
    this.selectedCategory = null;
    this.loadBooks();
  }

  getGradient(title: string): string {
    if (!title) return this.gradients[0];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash * 31 + title.charCodeAt(i)) | 0;
    }
    return this.gradients[Math.abs(hash) % this.gradients.length];
  }

  imageUrl(book: Book): string | null {
    if (!book.cover_image) return null;
    if (book.cover_image.startsWith('http')) return book.cover_image;
    return 'http://localhost:8000' + book.cover_image;
  }
}
