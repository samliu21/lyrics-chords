from django.contrib.auth import get_user_model
from django.db import models

class Song(models.Model):
	"""
	Fields that are displayed on the Song screeen
	"""
	name = models.CharField(max_length=100, blank=True, default="")
	artist = models.CharField(max_length=100, blank=True, default="")
	creator = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	lyrics = models.TextField(default="", blank=True)
	pulled_lyrics = models.TextField(default="", blank=True)
	chords = models.TextField(default="", blank=True)
	strumming_pattern = models.CharField(max_length=30, default="", blank=True)

	"""
	Additional information used to determine where to display the song
	"""
	public = models.BooleanField(default=False)
	is_favourite = models.BooleanField(default=False)

	def __str__(self):
		return self.name 

class Comment(models.Model):
	"""
	Each comment is associated with a song and user
	If those models are deleted, so should the comment
	"""
	song = models.ForeignKey(Song, on_delete=models.CASCADE)
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

	contents = models.CharField(max_length=500)
	date_of_creation = models.DateTimeField(auto_now=True)
	edited = models.BooleanField(default=False)

	"""
	null if comment was not in reply of another comment
	Foreign key to comment that was replied to
	"""
	parent = models.ForeignKey('self', null=True, default=None, on_delete=models.CASCADE)
