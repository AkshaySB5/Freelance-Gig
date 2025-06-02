# core/views.py

import hmac
import hashlib
import razorpay
from rest_framework.exceptions import PermissionDenied
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Gig
from .serializers import GigSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Gig, Booking, Transaction, Review, Dispute
from .serializers import (
    ProfileSerializer,
    GigSerializer,
    BookingSerializer,
    TransactionSerializer,
    ReviewSerializer,
    DisputeSerializer,
    RegisterSerializer,
)


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "User created successfully."},
            status=status.HTTP_201_CREATED
        )


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get', 'patch'],
            permission_classes=[permissions.IsAuthenticated],
            url_path='me')
    def me(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)

        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class GigViewSet(viewsets.ModelViewSet):
    queryset = Gig.objects.all()
    serializer_class = GigSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # get the Profile for the logged-in user
        profile = Profile.objects.get(user=self.request.user)
        serializer.save(freelancer=profile)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(client=self.request.user.profile)

    def perform_create(self, serializer):
        
              # The serializer’s create() method will handle gig & client
        serializer.save()

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class CreateOrderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get('booking')
        booking = Booking.objects.filter(
            id=booking_id,
            client__user=request.user
        ).first()
        if not booking:
            return Response({'detail': 'Invalid booking'},
                            status=status.HTTP_400_BAD_REQUEST)

        amount_paise = int(booking.gig.price * 100)
        razor_client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        order = razor_client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': f'booking_{booking.id}'
        })
        txn = Transaction.objects.create(
            booking=booking,
            amount=booking.gig.price,
            status='CREATED'
        )
        return Response({
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency'],
            'key': settings.RAZORPAY_KEY_ID,
            'transaction_id': txn.id
        })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def razorpay_webhook(request):
    sig = request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        request.body,
        hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    data = request.data['payload']['payment']['entity']
    txn_id = data.get('notes', {}).get('transaction_id')
    txn = Transaction.objects.filter(id=txn_id).first()
    if not txn:
        return Response(status=status.HTTP_404_NOT_FOUND)

    txn.razorpay_payment_id = data['id']
    is_captured = (data.get('status') == 'captured')
    txn.status = 'PAID' if is_captured else data['status'].upper()
    txn.save()

    booking = txn.booking
    booking.status = (
        Booking.Status.CONFIRMED if is_captured else Booking.Status.FAILED
    )
    booking.save()

    return Response(status=status.HTTP_200_OK)
