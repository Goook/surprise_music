from django.shortcuts import render

# Create your views here.
from django.views.generic import ListView, TemplateView


class MyMusicView(TemplateView):
    template_name = ''

class MusicFavouriteView(ListView):
    pass


class MusicHistoryView(ListView):
    pass

class PlayerView(TemplateView):
    template_name = 'player/../templates/mymusic/player.html'
