from django.contrib import admin

from .models import Song, Comment

class SongAdmin(admin.ModelAdmin):
	readonly_fields = ('id')

class CommentAdmin(admin.ModelAdmin):
	list_display = ('contents', 'user', 'song')
	readonly_fields = ('id', 'date_of_creation')

admin.site.register(Song)
admin.site.register(Comment, CommentAdmin)