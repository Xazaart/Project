import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { TransactionService } from '../../services/transaction.service';
import { Book } from '../../models/interfaces';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  book: Book | null = null;
  quantity = 1;
  loading = false;
  errorMessage = '';


  cardholderName = '';
  cardNumber = '';
  expiry = '';
  cvv = '';


  fullName = '';
  phone = '';
  city = 'Almaty';
  address = '';
  postalCode = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('bookId'));
    const qty = Number(this.route.snapshot.queryParamMap.get('qty') || '1');
    this.quantity = qty > 0 ? qty : 1;
    this.bookService.get(id).subscribe({
      next: (b) => this.book = b,
      error: () => this.errorMessage = 'Book not found',
    });
  }

  get subtotal(): number {
    if (!this.book) return 0;
    return Number(this.book.price) * this.quantity;
  }

  get shipping(): number {
    return this.subtotal > 50 ? 0 : 5;
  }

  get total(): number {
    return this.subtotal + this.shipping;
  }


  formatCardNumber() {
    let digits = this.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }


  formatExpiry() {
    let digits = this.expiry.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      this.expiry = digits.slice(0, 2) + '/' + digits.slice(2);
    } else {
      this.expiry = digits;
    }
  }


  formatCvv() {
    this.cvv = this.cvv.replace(/\D/g, '').slice(0, 4);
  }

  isFormValid(): boolean {
    return !!this.cardholderName.trim()
      && this.cardNumber.replace(/\s/g, '').length === 16
      && /^\d{2}\/\d{2}$/.test(this.expiry)
      && this.cvv.length >= 3
      && !!this.fullName.trim()
      && !!this.phone.trim()
      && !!this.address.trim();
  }

  payNow() {
    if (!this.book || !this.isFormValid() || this.loading) return;
    this.loading = true;
    this.errorMessage = '';


    this.transactionService.purchase(this.book.id, this.quantity).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/my-transactions'], {
          queryParams: { success: '1' }
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.detail || 'Payment failed. Please try again.';
      }
    });
  }
}
