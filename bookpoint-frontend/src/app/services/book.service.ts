import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = 'http://localhost:8000/api/books';

  constructor(private http: HttpClient) {}

  list(category?: number, search?: string): Observable<Book[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category.toString());
    if (search) params = params.set('search', search);
    return this.http.get<Book[]>(`${this.apiUrl}/`, { params });
  }

  get(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}/`);
  }

  create(data: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
