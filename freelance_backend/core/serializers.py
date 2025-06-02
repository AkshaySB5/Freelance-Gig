# core/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Gig, Booking, Transaction, Review, Dispute

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        # expose id, username, bio, skills, portfolio_url, contact_email, contact_phone
        fields = [
            "id",
            "user",
            "bio",
            "skills",
            "portfolio_url",
            "contact_email",
            "contact_phone",
        ]
read_only_fields = ["id", "user"]

class GigSerializer(serializers.ModelSerializer):
    freelancer = ProfileSerializer(read_only=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Gig
        fields = [
            "id",
            "title",
            "description",
            "price",
            "delivery_time",
            "created_at",
            "image",
            "freelancer",
        ]


class BookingSerializer(serializers.ModelSerializer):
    gig_detail = GigSerializer(source="gig", read_only=True)
    freelancer_contact = serializers.SerializerMethodField(read_only=True)

    # Make "gig" a write-only IntegerField so DRF knows how to validate it
    gig = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "gig",               # now declared as write-only
            "gig_detail",
            "status",
            "booked_at",
            "freelancer_contact",
        ]

    def get_freelancer_contact(self, obj):
        freelancer = obj.gig.freelancer
        return {
            "email": freelancer.contact_email or "",
            "phone": freelancer.contact_phone or "",
        }

    def create(self, validated_data):
        # Extract the gig ID from validated_data and replace with actual instance
        gig_id = validated_data.pop("gig")
        booking = Booking.objects.create(
            gig_id=gig_id,
            client=self.context["request"].user.profile,
            **validated_data
        )
        return booking


class TransactionSerializer(serializers.ModelSerializer):
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())

    class Meta:
        model  = Transaction
        fields = ['id', 'booking', 'razorpay_payment_id', 'amount', 'status', 'created_at']
        read_only_fields = ['razorpay_payment_id', 'status', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    user    = serializers.ReadOnlyField(source='user.username')
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())

    class Meta:
        model  = Review
        fields = ['id', 'booking', 'rating', 'comment', 'user', 'reviewed_at']
        read_only_fields = ['user', 'reviewed_at']


class DisputeSerializer(serializers.ModelSerializer):
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())

    class Meta:
        model  = Dispute
        fields = [
            'id',
            'booking',
            'description',
            'resolution_status',
            'opened_at',
            'resolved_at',
        ]
        read_only_fields = ['resolution_status', 'opened_at', 'resolved_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # 1) Create the Django user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        # 2) Create the profile if missing (avoids duplicates)
        Profile.objects.get_or_create(user=user)
        return user
