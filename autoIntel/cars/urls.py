from django.urls import path
from .views import CarListView, CarDetailView
from .views import FavoriteListCreateView, FavoriteDeleteView, FavoriteStatusView
from .auth_views import (
    csrf,
    register_view,
    login_view,
    logout_view,
    session_view,
    dashboard_view,
)

urlpatterns = [
    path("", CarListView.as_view(), name="car-list"),

    path("auth/csrf/", csrf, name="csrf"),
    path("auth/register/", register_view, name="register"),
    path("auth/login/", login_view, name="login"),
    path("auth/logout/", logout_view, name="logout"),
    path("auth/session/", session_view, name="session"),
    path("auth/dashboard/", dashboard_view, name="dashboard"),

    path("favorites/", FavoriteListCreateView.as_view(), name="favorites-list-create"),
    path("favorites/<slug:car_slug>/", FavoriteDeleteView.as_view(), name="favorites-delete"),
    path("favorites/status/<slug:car_slug>/", FavoriteStatusView.as_view(), name="favorites-status"),

    path("<slug:slug>/", CarDetailView.as_view(), name="car-detail"),
]