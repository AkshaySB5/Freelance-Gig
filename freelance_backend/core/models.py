# core/models.py

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    portfolio_url = models.URLField(blank=True)

    # ── new contact fields:
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_profile_for_new_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


class Gig(models.Model):
    freelancer = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='gigs'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    delivery_time = models.IntegerField(help_text='Days to deliver')
    created_at = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(
        upload_to="gig_images/",
        null=True,
        blank=True,
        help_text="Upload a representative image for this gig"
    )


    def __str__(self):
        return self.title


class Booking(models.Model):
    gig = models.ForeignKey(
        Gig, on_delete=models.CASCADE, related_name='bookings'
    )
    client = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='bookings'
    )
    booked_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('PAID', 'Paid'),
            ('COMPLETED', 'Completed'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='PENDING'
    )

    def __str__(self):
        return f"{self.client.user.username} → {self.gig.title}"


class Transaction(models.Model):
    booking = models.OneToOneField(
        Booking, on_delete=models.CASCADE, related_name='transaction'
    )
    razorpay_payment_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Txn {self.booking.id}: {self.status}"


class Review(models.Model):
    # Now required fields—no null=True or blank=True
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating}★ by {self.user.username} on booking {self.booking.id}"


class Dispute(models.Model):
    booking = models.ForeignKey(
        Booking, on_delete=models.CASCADE, related_name='disputes'
    )
    description = models.TextField()
    resolution_status = models.CharField(
        max_length=20,
        choices=[
            ('OPEN', 'Open'),
            ('RESOLVED', 'Resolved'),
            ('REJECTED', 'Rejected'),
        ],
        default='OPEN'
    )
    opened_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Dispute #{self.id} for Booking {self.booking.id}"
