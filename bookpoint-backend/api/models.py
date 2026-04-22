from django.db import models
from django.contrib.auth.models import User



class PublishedBookManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)



class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name



class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)


    category = models.ForeignKey(
        Category, related_name='books',
        on_delete=models.CASCADE
    )

    added_by = models.ForeignKey(
        User, related_name='books_added',
        on_delete=models.SET_NULL, null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    objects = models.Manager()
    published = PublishedBookManager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.author}"

    @property
    def average_rating(self):
        ratings = self.reviews.all()
        if not ratings:
            return 0
        return round(sum(r.rating for r in ratings) / ratings.count(), 2)



class Review(models.Model):
    book = models.ForeignKey(Book, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()  # 1-5
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('book', 'user')

    def __str__(self):
        return f"{self.user.username} -> {self.book.title} ({self.rating})"



class Favorite(models.Model):
    user = models.ForeignKey(User, related_name='favorites', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} ♥ {self.book.title}"



class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(User, related_name='transactions', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='transactions', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} bought {self.quantity}x {self.book.title} - {self.status}"