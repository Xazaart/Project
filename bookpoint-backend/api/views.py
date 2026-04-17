from django.contrib.auth import authenticate
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book, Category, Review, Favorite, Transaction
from .serializers import (
    BookSerializer, CategorySerializer, ReviewSerializer,
    FavoriteSerializer, TransactionSerializer,
    LoginSerializer, RegisterSerializer,
)




@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'email': user.email}
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
    )
    if user is None:
        return Response({'detail': 'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'detail': 'Logged out successfully'})




class BookListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.all()
        category_id = request.query_params.get('category')
        search = request.query_params.get('search')
        if category_id:
            books = books.filter(category_id=category_id)
        if search:
            books = books.filter(title__icontains=search)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(added_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Book, pk=pk)

    def get(self, request, pk):
        book = self.get_object(pk)
        return Response(BookSerializer(book).data)

    def put(self, request, pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        book = self.get_object(pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        book = self.get_object(pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




@api_view(['GET', 'POST'])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def review_list(request):
    if request.method == 'GET':
        reviews = Review.objects.all()
        book_id = request.query_params.get('book')
        if book_id:
            reviews = reviews.filter(book_id=book_id)
        return Response(ReviewSerializer(reviews, many=True).data)

    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def favorite_list(request):

    if request.method == 'GET':
        favs = Favorite.objects.filter(user=request.user)
        return Response(FavoriteSerializer(favs, many=True).data)

    book_id = request.data.get('book')
    if not book_id:
        return Response({'detail': 'book is required'}, status=status.HTTP_400_BAD_REQUEST)

    if Favorite.objects.filter(user=request.user, book_id=book_id).exists():
        return Response({'detail': 'Already in favorites'}, status=status.HTTP_400_BAD_REQUEST)

    fav = Favorite.objects.create(user=request.user, book_id=book_id)
    return Response(FavoriteSerializer(fav).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def favorite_remove(request, pk):

    fav = get_object_or_404(Favorite, pk=pk, user=request.user)
    fav.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)




class PurchaseBookView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id = request.data.get('book')
        quantity = int(request.data.get('quantity', 1))

        if not book_id:
            return Response({'detail': 'book is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                book = Book.objects.select_for_update().get(pk=book_id)

                if book.stock < quantity:
                    raise ValueError("Not enough stock")

                book.stock -= quantity
                book.save()

                total = book.price * quantity
                tx = Transaction.objects.create(
                    user=request.user,
                    book=book,
                    quantity=quantity,
                    total_price=total,
                    status='completed',
                )
        except Book.DoesNotExist:
            return Response({'detail': 'Book not found'},
                            status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'detail': str(e)},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(tx).data,
                        status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_transactions(request):
    txs = Transaction.objects.filter(user=request.user)
    return Response(TransactionSerializer(txs, many=True).data)