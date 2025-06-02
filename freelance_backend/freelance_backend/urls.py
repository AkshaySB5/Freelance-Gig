# freelance_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from core.views import (
    ProfileViewSet,
    GigViewSet,
    BookingViewSet,
    TransactionViewSet,
    ReviewViewSet,
    DisputeViewSet,
    RegisterAPIView,
    CreateOrderAPIView,
    razorpay_webhook,
)

router = DefaultRouter()
router.register(r'profiles',     ProfileViewSet)
router.register(r'gigs',         GigViewSet)
router.register(r'bookings',     BookingViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'reviews',      ReviewViewSet)
router.register(r'disputes',     DisputeViewSet)

urlpatterns = [
    # Admin UI
    path('admin/', admin.site.urls),

    # Public registration endpoint
    path('api/register/', RegisterAPIView.as_view(), name='register'),

    # Router-based CRUD endpoints
    path('api/', include(router.urls)),

    # JWT authentication
    path('api/token/',         TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(),   name='token_refresh'),

    # Create Razorpay order
    path('api/create-order/',    CreateOrderAPIView.as_view(), name='create_order'),

    # Razorpay webhook callback
    path('api/webhook/razorpay/', razorpay_webhook,           name='razorpay_webhook'),
]
