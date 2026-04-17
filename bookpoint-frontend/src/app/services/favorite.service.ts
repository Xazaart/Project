import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = 'http://localhost:8000/api/favorites';

  constructor(private http: HttpClient) {}

  list(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.apiUrl}/`);
  }

  add(bookId: number): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.apiUrl}/`, { book: bookId });
  }

  remove(favoriteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${favoriteId}/`);
  }
}
