from django.contrib.auth import get_user_model, logout, login
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.utils.encoding import force_text, force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.http import require_POST
from emailauth.tokens import ConfirmEmailTokenGenerator

import json
from backend.settings import EMAIL_HOST_USER, BACKEND, FRONTEND

account_activation_token = ConfirmEmailTokenGenerator()
password_reset_token = PasswordResetTokenGenerator()

# Decode the user id and obtain the corresponding user
# Check the token with the user
# If they match, login and set the confirmed email status to be true
def activate(request, uidb64, token):
	try:
		uid = force_text(urlsafe_base64_decode(uidb64))
		user = get_user_model().objects.get(id=uid)
	except:
		user = None
	if user is not None and account_activation_token.check_token(user, token):
		user.is_active = True
		user.confirmed_email = True
		user.save()
		login(request, user)
		return HttpResponse("Email has been authenticated!")
	return HttpResponseBadRequest("Authentication failed.")

# Whether the user has activated their email or not
def get_is_activated(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("User is not authenticated.")
	try:
		return HttpResponse(request.user.confirmed_email)
	except Exception:
		return HttpResponseBadRequest("An error occurred.")

# Resend account activation mail
# Create a token and user id from the request.user object
# Send email with new link
def resend_activation(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("User is not authenticated.")
	try:
		token = account_activation_token.make_token(request.user)
		uid = urlsafe_base64_encode(force_bytes(request.user.pk))

		subject = 'Confirm your email at lyrics-chords!'
		message = 'Use the following link to activate your account: ' + BACKEND + '/api/auth/email/activate/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
		email_from = EMAIL_HOST_USER
		recipient_list = [request.user.email]

		send_mail(subject, message, email_from, recipient_list, fail_silently=False)

		return HttpResponse("Mail sent.")
	except Exception:
		return HttpResponseBadRequest("Mail did not send.")

# Get user object from inputted email, and send email with passsword reset link
def send_password_reset(request):
	try:
		body = json.loads(request.body)
		email = body.get('email')
		user = get_user_model().objects.get(email=email)
		token = password_reset_token.make_token(user)
		uid = urlsafe_base64_encode(force_bytes(user.pk))

		subject = 'Reset your password at lyrics-chords!'
		message = 'Use the following link to reset your password: ' + FRONTEND + '/accounts/password-change/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
		email_from = EMAIL_HOST_USER
		recipient_list = [user.email]

		send_mail(subject, message, email_from, recipient_list, fail_silently=False)

		return HttpResponse("Mail sent.")
	except get_user_model().DoesNotExist:
		return HttpResponseBadRequest("Email is not attached to an account.")
	except Exception:
		return HttpResponseBadRequest("Mail did not send.")

# Get the uid and token from request body and check the valididty of the token
@require_POST
def password_change(request):
	body = json.loads(request.body)
	uidb64 = body.get('uid')
	token = body.get('token')
	password = body.get('password')

	if len(password) < 5:
		return HttpResponseBadRequest("Password must be at least 5 characters long!")

	try:
		uid = force_text(urlsafe_base64_decode(uidb64))
		user = get_user_model().objects.get(id=uid)
	except:
		user = None
	if user is not None and password_reset_token.check_token(user, token):
		logout(request)
		user.set_password(password)
		user.save()

		return HttpResponse("New password has been set!")
	return HttpResponseBadRequest("Password reset failed. Please try again.")

def password_change_link(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest('You are not authenticated.')
	try:
		token = password_reset_token.make_token(request.user)
		uid = urlsafe_base64_encode(force_bytes(request.user.pk))
		link = '/accounts/password-change/{}/{}'.format(uid, token)
		return HttpResponse(link)
	except:
		return HttpResponseBadRequest('An error occurred.')
