from django.contrib import admin
from django.urls import path
from . import views

app_name = 'index'
urlpatterns = [
    path(r'', views.IndexView.as_view())
]

