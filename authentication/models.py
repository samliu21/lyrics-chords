from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
	"""
	Overrides email property as unique, allowing it to uniquely identify users in login
	About is the biography section of a user's profile page
	"""
	email = models.EmailField(unique=True)
	confirmed_email = models.BooleanField(default=False)
	about = models.CharField(max_length=500, blank=True, default="")

	REQUIRED_FIELDS = ['email']

	class Meta:
		db_table = 'auth_user'

class Image(models.Model):
	"""
	Images are uploaded to a remote cloud storage service
	As such, having only a URL is sufficient
	The URL is suffixed by the user's id, so that a user can only have one profile picture at at time
	"""
	url = models.TextField()
	user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, default=None)