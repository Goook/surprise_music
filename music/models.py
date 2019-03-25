from django.db import models

# Create your models here.


class MusicList(models.Model):
    list_id = models.AutoField(primary_key=True)

    music_name = models.CharField(max_length=50)

    music_path = models.CharField(max_length=100)

    lrc_path = models.CharField(max_length=100)

    singer = models.CharField(max_length=15)

    length_time = models.CharField(max_length=5)

    music_pic = models.CharField(max_length=100)


    class Meta:
        db_table = 'music_list'

        ordering = ['list_id']


class MusicFavourite(models.Model):
    favourite_id = models.AutoField(primary_key=True)

    user_id = models.CharField(max_length=20)

    music_id = models.CharField(max_length=50)

    class Meta:
        db_table = 'music_favourite'


class MusicHistory(models.Model):
    history_id = models.AutoField(primary_key=True)

    user_id = models.CharField(max_length=20)

    music_id = models.CharField(max_length=50)

    class Meta:
        db_table = 'music_history'


class Singer(models.Model):
    pass


class MusicLike(models.Model):
    user_id = models.IntegerField()
    sheet_id = models.IntegerField()
    music_id = models.IntegerField()


