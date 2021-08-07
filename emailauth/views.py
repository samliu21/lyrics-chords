from django.contrib.auth import get_user_model, logout, login
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_text, force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .tokens import ConfirmEmailTokenGenerator
from backend.settings import EMAIL_HOST_USER, BACKEND, FRONTEND

account_activation_token = ConfirmEmailTokenGenerator()
password_reset_token = PasswordResetTokenGenerator()

@api_view(['GET'])
def activate(request, uidb64, token):
	"""
	Email verification link points at this view
	Decode the user id to obtain the corresponding user
	Check the token with the user
	"""
	try:
		uid = force_text(urlsafe_base64_decode(uidb64))
		user = get_user_model().objects.get(id=uid)
	except:
		user = None
	if user is not None and account_activation_token.check_token(user, token):
		# user.is_active = True
		user.confirmed_email = True
		user.save()
		login(request, user)
		return Response('Email has been authenticated!', status=status.HTTP_200_OK)
	return Response('Authentication failed.', status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def resend_activation(request):
	"""
	Resend account email verification email
	Create token and user id based on request and send new email
	"""
	if not request.user.is_authenticated:
		return Response('User is unauthenticated.', status=status.HTTP_401_UNAUTHORIZED)

	token = account_activation_token.make_token(request.user)
	uid = urlsafe_base64_encode(force_bytes(request.user.pk))

	subject = 'Confirm your email at lyrics-chords!'
	message = 'Use the following link to activate your account: ' + BACKEND + '/api/auth/email/activate/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
	email_from = EMAIL_HOST_USER
	recipient_list = [request.user.email]

	try:
		send_mail(subject, message, email_from, recipient_list, fail_silently=False)

		return Response('Mail was sent.', status=status.HTTP_200_OK)
	except:
		return Response('Mail could not send.', status=status.HTTP_502_BAD_GATEWAY)

@api_view(['POST'])
def send_password_reset(request):
	"""
	Takes in the email of the account the user wants to reset
	Get the corresponding user and generate a token and uid
	Password reset link is sent via email
	"""
	try:
		email = request.data['email']
	except KeyError:
		return Response('The provided data is of invalid form.', status=status.HTTP_400_BAD_REQUEST)
	
	try:
		user = get_user_model().objects.get(email=email)
	except get_user_model().DoesNotExist:
		return Response('Email is not attached to an account.', status=status.HTTP_404_NOT_FOUND)

	token = password_reset_token.make_token(user)
	uid = urlsafe_base64_encode(force_bytes(user.pk))

	subject = 'Reset your password at lyrics-chords!'
	message = 'Use the following link to reset your password: ' + FRONTEND + '/accounts/password-change/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
	email_from = EMAIL_HOST_USER
	recipient_list = [user.email]

	try:
		send_mail(subject, message, email_from, recipient_list, fail_silently=False)

		return Response('Password reset mail was sent.', status=status.HTTP_200_OK)
	except:
		return Response('Password reset mail did not sent.', status=status.HTTP_502_BAD_GATEWAY)

# Get the uid and token from request body and check the valididty of the token
@api_view(['POST'])
def password_change(request):
	"""
	Handles password changing from password reset or change
	Decodes uid and token, verify them, and change user's password
	"""
	try:
		uidb64 = request.data['uid']
		token = request.data['token']
		password = request.data['password']
	except KeyError:
		return Response('The given request body is of an invalid form.', status=status.HTTP_400_BAD_REQUEST)

	if len(password) < 5:
		return Response('Password must be at least 5 characters long!', status=status.HTTP_400_BAD_REQUEST)

	try:
		uid = force_text(urlsafe_base64_decode(uidb64))
		user = get_user_model().objects.get(id=uid)
	except:
		user = None
	if user is not None and password_reset_token.check_token(user, token):
		logout(request)
		user.set_password(password)
		user.save()

		return Response('New password has been set!', status=status.HTTP_200_OK)
	return Response('Password change failed.', status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def password_change_link(request):
	"""
	Provides password change link from within a user's account
	"""
	if not request.user.is_authenticated:
		return Response('User is not authenticatd.', status=status.HTTP_401_UNAUTHORIZED)

	token = password_reset_token.make_token(request.user)
	uid = urlsafe_base64_encode(force_bytes(request.user.pk))
	link = '/accounts/password-change/{}/{}'.format(uid, token)
	return Response(link, status=status.HTTP_200_OK)
