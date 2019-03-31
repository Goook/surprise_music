import random

from django.db.models import Count, Sum, Max
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
from django.template import loader
from django.views import View
from django.views.generic import ListView, TemplateView
from recommend_music.surprise_recommend_main import playlist_recommend_main
from accounts.models import UserLike
from music.models import MusicList


class IndexView(ListView):
    template_name = 'index/index.html'
    queryset = MusicList.objects.all()
    context_object_name = 'recommends_hots'

    def get_queryset(self):
        user_likes = UserLike.objects.values('music_id').annotate(
            play_num=Sum('play')).order_by('-play_num')[:10]
        hots_music_id = [d['music_id'] for d in user_likes]
        hots = MusicList.objects.filter(list_id__in=hots_music_id)
        user_to_music = UserLike.objects.filter(user_id=self.request.user.id)
        max_like_music_id = None
        max_sums = 0
        for music in user_to_music:
            sums = abs(20 - abs(5 - music.play) * 2) + music.like * 30 + music.search * 30 + music.download * 20
            if sums > max_sums:
                max_like_music_id = music.music_id
        try:
            music = MusicList.objects.get(list_id=max_like_music_id)
            recommend_id_list = playlist_recommend_main(music.music_name)
            music_id_list = [d['song_id'] for d in recommend_id_list['data']]
            recommends = MusicList.objects.filter(list_id__in=music_id_list)
        except:
            print('冷启动')
            recommends = random.sample(list(self.queryset), 10)

        return (recommends, hots)

    def get_context_data(self, *, object_list=None, **kwargs):
        content = super().get_context_data(object_list=object_list, **kwargs)
        content['recommends'] = content['recommends_hots'][0]
        content['hots'] = content['recommends_hots'][1]
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




