from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
	email = models.EmailField(unique=True, blank=False, null=False)
	confirmed_email = models.BooleanField(default=False)

	REQUIRED_FIELDS = ['email']

	class Meta:
		db_table = 'auth_user'