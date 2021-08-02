from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
	email = models.EmailField(unique=True)
	confirmed_email = models.BooleanField(default=False)
	about = models.CharField(max_length=500, blank=True, default="")

	REQUIRED_FIELDS = ['email']

	class Meta:
		db_table = 'auth_user'

class Image(models.Model):
	url = models.ImageField(upload_to='user_images')
	user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, default=None)

	def delete(self):
		self.image.storage.delete(self.image.name)
		super().delete()