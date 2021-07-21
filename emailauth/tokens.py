from django.contrib.auth.tokens import PasswordResetTokenGenerator

class ConfirmEmailTokenGenerator(PasswordResetTokenGenerator):
	def _make_hash_value(self, user, timestamp):
		# Timestamp is almost impossible to guess
		# Once the user confirms their email, is_active is set to True, effectively expiring the activation link
		return f'{user.pk}{timestamp}{user.is_active}'
