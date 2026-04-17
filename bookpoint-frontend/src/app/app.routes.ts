import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { MyTransactionsComponent } from './components/my-transactions/my-transactions.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'checkout/:bookId', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: 'my-transactions', component: MyTransactionsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
