from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.forms import widgets
from django.conf import settings
from django.contrib.auth import get_user_model


class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget = widgets.TextInput(attrs={'placeholder': "username", "class": "form-control"})
        self.fields['password'].widget = widgets.PasswordInput(
            attrs={'placeholder': "password", "class": "form-control"})


class RegisterForm(UserCreationForm):

    RADIO_CHOICES = (
        ('男', "Male"),
        ('女', "Female"),
    )

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)

        self.fields['username'].widget = widgets.TextInput(attrs={'placeholder': "username", "class": "form-control"})
        self.fields['username'].label = '用户名'
        self.fields['email'].widget = widgets.EmailInput(attrs={'placeholder': "email", "class": "form-control"})
        self.fields['email'].label = '邮箱'
        self.fields['password1'].widget = widgets.PasswordInput(
            attrs={'placeholder': "password", "class": "form-control"})
        self.fields['password1'].label = '密码'
        self.fields['birthday'].widget = widgets.DateInput(
            attrs={'placeholder': "1995-12-16", "class": "form-control"})
        self.fields['birthday'].label = '生日'
        self.fields['sex'].widget = widgets.RadioSelect(choices=self.RADIO_CHOICES,
            attrs={'placeholder': "sex", "class": "radio"})
        self.fields['sex'].label = '性别'
        self.fields['password2'].widget = widgets.PasswordInput(
            attrs={'placeholder': "repeat password", "class": "form-control"})
        self.fields['password2'].label = '重复密码'

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "birthday", 'sex')
