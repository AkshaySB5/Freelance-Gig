# core/admin.py

from django.contrib import admin
from .models import Profile, Gig, Booking, Transaction, Review, Dispute

# Custom admin for Gig
class GigAdmin(admin.ModelAdmin):
    exclude = ('freelancer',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # superusers see all; everyone else only their own gigs
        if request.user.is_superuser:
            return qs
        return qs.filter(freelancer__user=request.user)

    def save_model(self, request, obj, form, change):
        if not change:
            profile, _ = Profile.objects.get_or_create(user=request.user)
            obj.freelancer = profile
        super().save_model(request, obj, form, change)


# Register all models
admin.site.register(Profile)
admin.site.register(Booking)
admin.site.register(Transaction)
admin.site.register(Review)
admin.site.register(Dispute)

# **Register the Gig model with your custom GigAdmin**
admin.site.register(Gig, GigAdmin)
