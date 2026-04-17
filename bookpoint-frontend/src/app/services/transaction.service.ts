import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  purchase(bookId: number, quantity: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/purchase/`, {
      book: bookId,
      quantity,
    });
  }

  myTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/my-transactions/`);
  }
}
