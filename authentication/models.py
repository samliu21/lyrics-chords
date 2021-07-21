from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
	email = models.EmailField(unique=True, blank=False, null=False)
	confirmed_email = models.BooleanField(default=False)

	REQUIRED_FIELDS = ['email']

	class Meta:
		db_table = 'auth_user'