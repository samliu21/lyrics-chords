from django.contrib.auth.tokens import PasswordResetTokenGenerator

class ConfirmEmailTokenGenerator(PasswordResetTokenGenerator):
	def _make_hash_value(self, user, timestamp):
		"""
		1. Timestamp is near impossible to guess
		2. Once the user confirms their email, is_active is set to True, expiring the activation link
		3. If the user doesn't confirm their email, Django expires the link in half an hour
		"""
		# Timestamp is almost impossible to guess
		# Once the user confirms their email, confirmed_email is set to True, effectively expiring the activation link
		return f'{user.pk}{timestamp}{user.confirmed_email}'
