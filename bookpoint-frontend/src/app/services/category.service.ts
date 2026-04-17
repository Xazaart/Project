import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/categories';

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/`);
  }

  create(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/`, data);
  }
}
