from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader
from django.views.generic import ListView, TemplateView

from music.models import MusicHistory, MusicFavourite, MusicList


class MusicView(TemplateView):
    template_name = 'music/music.html'


class MusicFavouriteView(ListView):
    template_name = 'music/favourite.html'
    queryset = MusicFavourite.objects.all()
    context_object_name = 'favourites'

    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        context = self.get_context_data(object_list=self.object_list)
        template_text = loader.render_to_string(self.template_name, context=context, request=request)
        data = {'status': True, 'data': template_text, 'msg': None}
        return JsonResponse(data)

    def get_queryset(self):
        queryset = super().get_queryset().filter(user_id=self.request.user.id)
        return queryset

class MusicHistoryView(ListView):
    template_name = 'music/history.html'
    context_object_name = 'histories'
    queryset = MusicHistory.objects.all()

    def get(self, request, *args, **kwargs):
        self.object_list = self.get_queryset()
        context = self.get_context_data(object_list=self.object_list)
        template_text = loader.render_to_string(self.template_name, context=context, request=request)
        data = {'status': True, 'data': template_text, 'msg': None}
        return JsonResponse(data)

    def get_queryset(self):
        queryset = super().get_queryset().filter(user_id=self.request.user.id)
        return queryset


class PlayerView(ListView):
    template_name = 'music/player.html'
    queryset = MusicHistory.objects.all()
    context_object_name = 'histories'

    def get(self, request, *args, **kwargs):
        music_id = kwargs.get('id') or self.kwargs.get('id')
        music = MusicList(list_id=music_id)
        history = MusicHistory.objects.filter(user=self.request.user, music=music)
        if not history:
            MusicHistory.objects.create(user=self.request.user, music=music)
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset().filter(user_id=self.request.user.id).order_by('-history_id')
        return queryset

    def get_context_data(self, *, object_list=None, **kwargs):
        content = super().get_context_data(object_list=object_list, **kwargs)
        content['current_music'] = self.kwargs.get('id')
        return content


