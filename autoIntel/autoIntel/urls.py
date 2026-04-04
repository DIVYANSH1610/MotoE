from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse
from django.views.static import serve

def home(request):
    return HttpResponse("🚗 AutoIntel Backend Running Successfully!")

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/cars/", include("cars.urls")),
    path("api/ai/", include("ai.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
