from django.contrib import admin
from django.urls import path
from . import views

app_name = 'mymusic'
urlpatterns = [
    path(r'',views.MyMusicView.as_view()),
    path(r'favourite/', views.MusicHistoryView.as_view()),
    path(r'history/', views.MusicHistoryView.as_view()),
path(r'', views.PlayerView.as_view(), name='player'),

]
