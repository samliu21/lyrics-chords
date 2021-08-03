from django.contrib import admin

from .models import User, Image

class UserAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)

class ImageAdmin(admin.ModelAdmin):
	readonly_fields = ('id',)

admin.site.register(User, UserAdmin)
admin.site.register(Image, ImageAdmin)
