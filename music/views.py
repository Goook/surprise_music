from django.http import JsonResponse
from django.shortcuts import render

# Create your views here.
from django.template import loader
from django.views import View
from django.views.generic import ListView, TemplateView

from accounts.models import UserLike
from music.models import MusicHistory, MusicFavourite, MusicList, Singer


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
        print(len(queryset))
        print(queryset)
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
        singer_name = MusicList.objects.get(list_id=music_id).singer
        singer_id = Singer.objects.get(singer_name=singer_name).id
        user_id = self.request.user.id
        try:
            user_like = UserLike.objects.get(user_id=self.request.user.id, music_id=music_id)
        except:
            # UserLike.objects.create(user_id=user_id, music_id=music_id, singer_id=singer_id)
            user_like = UserLike(user_id=self.request.user.id, music_id=music_id, singer_id=singer_id)
        user_like.play += 1
        click_location = request.GET.get('location')
        if click_location == 'search':
            user_like.search += 1
        user_like.save()
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


class PlayerLikeView(View):
    def get(self, request, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        music_id = request.POST.get('music_id')
        if music_id:
            music = MusicFavourite.objects.filter(music_id=music_id)
            try:
                user_like = UserLike.objects.get(music_id=music_id, user_id=request.user.id)
            except:
                user_like = UserLike(music_id=music_id, user_id=request.user.id)
            if music:
                music.delete()
                user_like.like = 0
                return JsonResponse({
                    'status': True,
                    'result': -1,
                    'msg': None
                })
            else:
                user_like.like = 1
                MusicFavourite.objects.create(music_id=music_id, user_id=request.user.id)
                return JsonResponse({
                    'status': True,
                    'result': 1,
                    'msg': None
                })
        else:
            return JsonResponse({
                'status': False,
                'result': 0,
                'msg': '收藏失败'
            })


