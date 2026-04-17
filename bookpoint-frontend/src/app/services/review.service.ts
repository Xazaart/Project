import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api/reviews';

  constructor(private http: HttpClient) {}

  listForBook(bookId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/`, {
      params: new HttpParams().set('book', bookId.toString())
    });
  }

  create(data: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/`, data);
  }
}
