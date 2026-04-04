# cars/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse
from django.views import View

from .services.car_loader import get_car_by_slug, get_all_cars
from .services.wikipedia_service import get_wikipedia_summary_for_car

from rest_framework import status
from .models import Favorite
from .serializers import FavoriteSerializer

minimal_cars = [
    {
        "id": car["id"],
        "slug": car["slug"],
        "company": car["company"],
        "car_name": car["car_name"],
        "horsepower": car["horsepower"],
        "top_speed": car["top_speed"],
        "price": car["price"],
        "image": car["image"],
    }
    for car in cars
]

class CarDetailView(View):
    def get(self, request, slug):
        car = get_car_by_slug(slug)

        if not car:
            return JsonResponse({"error": "Car not found"}, status=404)

        wiki_details = get_wikipedia_summary_for_car(car)

        response = {
            **car,  # full original + normalized data
            "wiki_details": wiki_details
        }

        return JsonResponse(response, safe=False)
    


class ProtectedGarageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Welcome {request.user.username}, this is your protected garage."
        })
    
class FavoriteListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        car_slug = request.data.get("car_slug")

        if not car_slug:
            return Response(
                {"detail": "car_slug is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            car_slug=car_slug
        )

        if created:
            serializer = FavoriteSerializer(favorite)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"detail": "Car already in favorites.", "car_slug": car_slug},
            status=status.HTTP_200_OK
        )


class FavoriteDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, car_slug):
        try:
            favorite = Favorite.objects.get(user=request.user, car_slug=car_slug)
            favorite.delete()
            return Response(
                {"detail": "Removed from favorites.", "car_slug": car_slug},
                status=status.HTTP_200_OK
            )
        except Favorite.DoesNotExist:
            return Response(
                {"detail": "Favorite not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class FavoriteStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, car_slug):
        is_favorited = Favorite.objects.filter(
            user=request.user,
            car_slug=car_slug
        ).exists()

        return Response(
            {
                "car_slug": car_slug,
                "is_favorited": is_favorited
            },
            status=status.HTTP_200_OK
        )
