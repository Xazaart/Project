import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/interfaces';

@Component({
  selector: 'app-my-transactions',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './my-transactions.component.html',
  styleUrl: './my-transactions.component.css'
})
export class MyTransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  errorMessage = '';

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    this.txService.myTransactions().subscribe({
      next: (d) => this.transactions = d,
      error: (err) => this.errorMessage = err.error?.detail || 'Failed to load'
    });
  }
}
