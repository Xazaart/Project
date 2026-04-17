import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { ReviewService } from '../../services/review.service';
import { TransactionService } from '../../services/transaction.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Book, Review } from '../../models/interfaces';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  reviews: Review[] = [];
  errorMessage = '';
  successMessage = '';

  // review form
  newRating = 5;
  newComment = '';

  // buy form
  quantity = 1;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private reviewService: ReviewService,
    private transactionService: TransactionService,
    private favoriteService: FavoriteService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook(id);
    this.loadReviews(id);
  }

  loadBook(id: number) {
    this.bookService.get(id).subscribe({
      next: (b) => this.book = b,
      error: (err: any) => this.errorMessage = err.error?.detail || 'Book not found'
    });
  }

  loadReviews(bookId: number) {
    this.reviewService.listForBook(bookId).subscribe({
      next: (r) => this.reviews = r,
      error: () => {}
    });
  }

  submitReview() {
    if (!this.book) return;
    this.errorMessage = '';
    this.reviewService.create({
      book: this.book.id,
      rating: this.newRating,
      comment: this.newComment,
    }).subscribe({
      next: () => {
        this.newComment = '';
        this.newRating = 5;
        this.loadReviews(this.book!.id);
        this.successMessage = 'Review posted!';
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.detail
          || err.error?.non_field_errors?.[0]
          || 'Failed to post review';
      }
    });
  }

  buyBook() {
    if (!this.book) return;
    // Navigate to checkout with book id + chosen quantity
    this.router.navigate(['/checkout', this.book.id], {
      queryParams: { qty: this.quantity }
    });
  }

  addToFavorites() {
    if (!this.book) return;
    this.errorMessage = '';
    this.favoriteService.add(this.book.id).subscribe({
      next: () => {
        this.successMessage = 'Added to favorites!';
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.detail || 'Failed to add to favorites';
      }
    });
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
