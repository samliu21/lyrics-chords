from django.contrib.auth.models import AbstractUser
from django.db import models

class Image(models.Model):
	image = models.ImageField(upload_to='user_images')

class User(AbstractUser):
	email = models.EmailField(unique=True)
	confirmed_email = models.BooleanField(default=False)
	about = models.CharField(max_length=500, blank=True, default="")
	image = models.OneToOneField(Image, on_delete=models.CASCADE, null=True, default=None)

	REQUIRED_FIELDS = ['email']

	class Meta:
		db_table = 'auth_user'