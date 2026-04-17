import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { Favorite } from '../../models/interfaces';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  errorMessage = '';
  successMessage = '';

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

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.list().subscribe({
      next: (data) => this.favorites = data,
      error: (err: any) => this.errorMessage = err.error?.detail || 'Failed to load favorites'
    });
  }

  removeFavorite(fav: Favorite) {
    if (!confirm(`Remove "${fav.book_title}" from favorites?`)) return;
    this.favoriteService.remove(fav.id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== fav.id);
        this.successMessage = `Removed "${fav.book_title}" from favorites`;
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err: any) => this.errorMessage = err.error?.detail || 'Failed to remove'
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
}
