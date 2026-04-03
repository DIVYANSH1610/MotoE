from rest_framework import serializers
from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "user", "car_slug", "created_at"]
        read_only_fields = ["id", "user", "created_at"]