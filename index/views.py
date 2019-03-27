from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
from django.template import loader
from django.views import View
from django.views.generic import ListView, TemplateView
# from recommend_music.surprise_recommend_main import playlist_recommend_main
from accounts.models import UserLike
from music.models import MusicList


class IndexView(ListView):
    template_name = 'index/index.html'
    queryset = MusicList.objects.all()
    context_object_name = 'musics'

    def get_context_data(self, *, object_list=None, **kwargs):
        content = super().get_context_data(object_list=object_list, **kwargs)
        content['hots'] = content['musics'][:60:6]
        content['recommend'] = content['musics'][:50:5]
        return content



class SearchView(ListView):
    template_name = 'index/search.html'
    context_object_name = 'musics'
    queryset = MusicList.objects.all()

    def get_queryset(self):
        music_name = self.request.GET.get('music')
        queryset = super().get_queryset().filter(music_name__contains=music_name)
        print(len(queryset))
        return queryset




