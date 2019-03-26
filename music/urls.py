from django.contrib import admin
from django.urls import path
from . import views

app_name = 'music'
urlpatterns = [
    path(r'',views.MusicView.as_view()),
    path(r'favourite/', views.MusicFavouriteView.as_view()),
    path(r'history/', views.MusicHistoryView.as_view()),
    path(r'player/', views.PlayerView.as_view(), name='player'),
    path(r'player/<int:id>', views.PlayerView.as_view(), name='player')

]
