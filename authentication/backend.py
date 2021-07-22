from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

class CustomBackend(BaseBackend):
	def authenticate(self, _, username, password):
		if '@' in username:
			kwargs = { 'email': username }
		else:
			kwargs = { 'username': username }
		try:
			user = get_user_model().objects.get(**kwargs)
			if user.check_password(password):
				return user
			return None
		except get_user_model().DoesNotExist:
			return None

	def get_user(self, user_id):
		try:
			return get_user_model().objects.get(id=user_id)
		except get_user_model().DoesNotExist:
			return None