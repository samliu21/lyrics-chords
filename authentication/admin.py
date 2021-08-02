from django.contrib import admin

from .models import User, Image

admin.site.register(User)
admin.register(Image)
