from django.shortcuts import render
from discover.models import *
from django.http import HttpResponse
from discover.models import *
# Create your views here.

def player(request):
    list_id = request.GET.get('list_id', '-1')
    user_history_id = ""
    if request.META.get('HTTP_X_FORWARDED_FOR', None):
        user_history_id = request.META['HTTP_X_FORWARDED_FOR']
    else:
        user_history_id = request.META['REMOTE_ADDR']
    if list_id == '0':
        MusicHistory.objects.filter(user_id=user_history_id).delete();
        return render(request, 'player/player.html', {'userImage':request.session.get('image'), 'music_list':None})
    elif list_id == '-1':
        sheet = request.GET.get('sheet', None)
        user = request.GET.get('user', None)
        music_sheet_list = []
        sheet = UserSheet.objects.filter(sheet_name=sheet, user_id=user)
        if sheet:
            music_sheet_list = MusicSheet.objects.filter(sheet_id=sheet.sheet_id)
            for music_sheet in music_sheet_list:
                music_history = MusicHistory.objects.filter(user_id=user_history_id, Hmusic_id=music_sheet.music_id)
                if not music_history:
                    MusicHistory.objects.create(user_id=user_history_id, Hmusic_id=music_sheet.music_id)
        else:
            favourite_list = MusicFavourite.objects.filter(user_id=user)
            for favourite in favourite_list:
                music_history = MusicHistory.objects.filter(user_id=user_history_id, Hmusic_id=favourite.Fmusic_id)
                if not music_history:
                    MusicHistory.objects.create(user_id=user_history_id, Hmusic_id=favourite.Fmusic_id)
        music_history_list = MusicHistory.objects.filter(user_id=user_history_id).order_by('-history_id')
        music_list = []
        singer_list = []
        for mhl in music_history_list:
            music = MusicList.objects.filter(list_id=mhl.Hmusic_id)[0]
            if music:
                music_list.append(music)
        music_id = music_list[0].list_id if music_list else 0
        return render(request, 'player/player.html', {'userImage': request.session.get('image'),
                                                      'music_list': music_list,
                                                      'singer_list': singer_list,
                                                      'music_id': music_id})
    else:
        music = MusicList.objects.filter(list_id=list_id)
        if music:
            music_history = MusicHistory.objects.filter(user_id=user_history_id, Hmusic_id=list_id)
            if not music_history:
                MusicHistory.objects.create(user_id=user_history_id, Hmusic_id=list_id)
            music_history_list = MusicHistory.objects.filter(user_id=user_history_id).order_by('-history_id')
            music_list = []
            singer_list = []
            for mhl in music_history_list:
                music = MusicList.objects.filter(list_id=mhl.Hmusic_id)[0]
                if music:
                    music_list.append(music)
            return render(request, 'player/player.html', {'userImage':request.session.get('image'),
                                                          'music_list':music_list,
                                                          'singer_list':singer_list,
                                                          'music_id':list_id})
        else:
            return HttpResponse('对不起没有收录这首歌')


def like(request):
    music_id = request.POST.get('music_id')
    is_like = request.POST.get('is_like', None)
    user_id = request.session.get('user_id',None)
    if user_id:
        if is_like == 'true':
            if not MusicFavourite.objects.filter(user_id=user_id, Fmusic_id=music_id):
                MusicFavourite.objects.create(user_id=user_id, Fmusic_id=music_id)
            return HttpResponse('收藏成功')
        else:
            MusicFavourite.objects.filter(user_id=user_id, Fmusic_id=music_id).delete()
            return HttpResponse('取消收藏')
    else:
        return HttpResponse("请先登录")


def like_selected(request):
    selected_music_id = request.POST.getlist('list')
    user_id = request.session.get('user_id')
    print(selected_music_id)
    if user_id:
        if selected_music_id:
            for music_id in selected_music_id:
                if not MusicFavourite.objects.filter(user_id=user_id, Fmusic_id=music_id):
                    MusicFavourite.objects.create(user_id=user_id, Fmusic_id=music_id)
            return HttpResponse('收藏成功')
        else:
            return HttpResponse('请选中您要收藏的歌曲')
    else:
        return HttpResponse("请先登录")


def flush(request):
    user_history_id = ""
    if request.META.get('HTTP_X_FORWARDED_FOR', None):
        user_history_id = request.META['HTTP_X_FORWARDED_FOR']
    else:
        user_history_id = request.META['REMOTE_ADDR']
    MusicHistory.objects.filter(user_id=user_history_id).delete();
    return HttpResponse('ok')

def delete(request):
    user_history_id = ""


def play_singer(request):
    user_history_id = ""
    if request.META.get('HTTP_X_FORWARDED_FOR', None):
        user_history_id = request.META['HTTP_X_FORWARDED_FOR']
    else:
        user_history_id = request.META['REMOTE_ADDR']
    singer = request.GET.get('singer', None)
    music_list = MusicList.objects.filter(singer=singer)
    for music in music_list:
        print(music.list_id);
        if not MusicHistory.objects.filter(Hmusic_id=music.list_id):
            MusicHistory.objects.create(user_id=user_history_id, Hmusic_id=music.list_id)
    music_history_list = MusicHistory.objects.filter(user_id=user_history_id).order_by('-history_id')
    music_list = []
    singer_list = []
    for mhl in music_history_list:
        music = MusicList.objects.filter(list_id=mhl.Hmusic_id)[0]
        if music:
            music_list.append(music)
    list_id = music_list[0].list_id
    return render(request, 'player/player.html', {'userImage': request.session.get('image'),
                                                  'music_list': music_list,
                                                  'singer_list': singer_list,
                                                  'music_id': list_id})
