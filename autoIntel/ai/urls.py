from django.urls import path
from .views import garage_assistant, used_car_advisor

urlpatterns = [
    path("garage/", garage_assistant, name="garage-assistant"),
    path("used-car-advisor/", used_car_advisor, name="used-car-advisor"),
    path("garage/", GarageAIView.as_view(), name="garage-ai"),
]
