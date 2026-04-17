from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Book, Review, Favorite, Transaction



class CategorySerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField(source='books.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'book_count', 'created_at']



class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    added_by_username = serializers.CharField(source='added_by.username', read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'description', 'cover_image',
            'price', 'stock', 'is_published',
            'category', 'category_name',
            'added_by', 'added_by_username',
            'average_rating', 'created_at',
        ]
        read_only_fields = ['added_by']



class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'book', 'book_title', 'user', 'username',
                  'rating', 'comment', 'created_at']
        read_only_fields = ['user']



class FavoriteSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)
    book_price = serializers.DecimalField(source='book.price', max_digits=8, decimal_places=2, read_only=True)
    book_cover = serializers.ImageField(source='book.cover_image', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'book', 'book_title', 'book_author',
                  'book_price', 'book_cover', 'created_at']
        read_only_fields = ['user']


class TransactionSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'username', 'book', 'book_title',
                  'quantity', 'total_price', 'status', 'created_at']
        read_only_fields = ['user', 'total_price', 'status']



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )