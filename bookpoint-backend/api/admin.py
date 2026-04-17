from django.contrib import admin
from .models import Category, Book, Review, Favorite, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'category', 'price', 'stock', 'is_published')
    list_filter = ('category', 'is_published')
    search_fields = ('title', 'author')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'user', 'rating', 'created_at')
    list_filter = ('rating',)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'created_at')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'quantity', 'total_price', 'status', 'created_at')
    list_filter = ('status',)