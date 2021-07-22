from django.db import models
from app.models import Song
from authentication.models import User

class View(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	song = models.ForeignKey(Song, on_delete=models.CASCADE)
