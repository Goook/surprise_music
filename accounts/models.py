from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
# Create your models here.

class User(AbstractUser):
    mugshot = models.ImageField('头像',
                                upload_to='upload/mugshots',
                                default="/upload/mugshots/default.jpg")
    phone = models.CharField(verbose_name='手机号', max_length=12, blank=True)
    nickname = models.CharField(verbose_name='昵称', max_length=20, blank=True)
    sex = models.CharField(verbose_name='性别', max_length=10, blank=True)
    birthday = models.DateField(verbose_name='生日', blank=True, null=True)
    introduce = models.CharField(verbose_name='个人介绍', max_length=64, blank=True)
    last_login = models.DateField(verbose_name='最近登录', default=now)


    class Meta:
        db_table = 'user'
        verbose_name = '用户'
        verbose_name_plural = '用户'


