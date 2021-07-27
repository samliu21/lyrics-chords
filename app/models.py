from django.contrib.auth import get_user_model
from django.db import models

class Song(models.Model):
	name = models.CharField(max_length=100, blank=True, default="")
	artist = models.CharField(max_length=100, blank=True, default="")
	creator = models.CharField(max_length=100, default="samliu12")
	lyrics = models.TextField(default="", blank=True)
	pulled_lyrics = models.TextField(default="", blank=True)
	chords = models.TextField(default="", blank=True)
	strumming_pattern = models.CharField(max_length=30, default="", blank=True)
	public = models.BooleanField(default=False)
	is_favourite = models.BooleanField(default=False)

	def __str__(self):
		return self.name 

class Comment(models.Model):
	song = models.ForeignKey(Song, on_delete=models.CASCADE)
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	contents = models.CharField(max_length=500)
	date_of_creation = models.DateTimeField(auto_now=True)
