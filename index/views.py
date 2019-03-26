from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
from django.template import loader
from django.views import View
from django.views.generic import ListView

from music.models import MusicList


class IndexView(ListView):
    template_name = 'index/index.html'
    queryset = MusicList.objects.all()
    context_object_name = 'musics'

    def get_context_data(self, *, object_list=None, **kwargs):
        content = super().get_context_data(object_list=object_list, **kwargs)
        content['hots'] = content['musics'][:10]
        content['recommend'] = content['musics'][10:20]
        return content


