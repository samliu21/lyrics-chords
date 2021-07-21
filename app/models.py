from django.db import models
from authentication.models import User

class Song(models.Model):
	name = models.CharField(max_length=100, blank=True)
	artist = models.CharField(max_length=100, blank=True)
	creator = models.CharField(max_length=100, default="samliu12")
	lyrics = models.TextField(default="", blank=True)
	pulled_lyrics = models.TextField(default="", blank=True)
	chords = models.TextField(default="", blank=True)
	strumming_pattern = models.CharField(max_length=30, default="", blank=True)
	public = models.BooleanField(default=False)
	views = models.TextField(default="", blank=True)
	is_favourite = models.BooleanField(default=False)

	def __str__(self):
		return self.name 

class View(models.Model):
	user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	song = models.ForeignKey(Song, on_delete=models.DO_NOTHING)
	value = models.IntegerField(default=0)