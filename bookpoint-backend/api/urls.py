from django.urls import path
from . import views

urlpatterns = [

    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),


    path('books/', views.BookListCreateView.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),


    path('categories/', views.category_list, name='category-list'),


    path('reviews/', views.review_list, name='review-list'),


    path('favorites/', views.favorite_list, name='favorite-list'),
    path('favorites/<int:pk>/', views.favorite_remove, name='favorite-remove'),


    path('purchase/', views.PurchaseBookView.as_view(), name='purchase'),
    path('my-transactions/', views.my_transactions, name='my-transactions'),
]