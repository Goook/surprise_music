from django.conf.urls import url, include
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^$', views.player, name='player'),
    url(r'^like/$',views.like, name='like'),
    url(r'^like_selected/$', views.like_selected, name='like_selected'),
    url(r'^flush/$', views.flush),
    url(r'^play_singer/$', views.play_singer, name='play_singer'),
]
