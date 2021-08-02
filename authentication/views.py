from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.mail import send_mail
from django.http import HttpResponse
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode 
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from emailauth.tokens import ConfirmEmailTokenGenerator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

import json
from authentication.models import Image
from authentication.serializers import ImageSerializer
from backend.settings import EMAIL_HOST_USER, BACKEND

account_activation_token = ConfirmEmailTokenGenerator()

# Create user account and log them in
# Send email to user asking them to activate account
@require_POST
def auth_signup(request):
	try:
		username, email, password = get_credentials(request)

		if len(username) < 5:
			return HttpResponseBadRequest("Username must be at least 5 characters long.")

		if len(password) < 5:
			return HttpResponseBadRequest("Password must be at least 5 characters long.")

		# Check if username is already taken
		if len(get_user_model().objects.filter(username=username)) > 0:
			return HttpResponseBadRequest("Username already exists. Did you mean to login instead?")

		# Check if email is already taken
		if len(get_user_model().objects.filter(username=username)) > 0:
			return HttpResponseBadRequest("Email already exists. Did you mean to login instead?")

		user = get_user_model().objects.create_user(username=username, email=email, password=password)
		user.is_active = False
		user.save()

		token = account_activation_token.make_token(user)
		uid = urlsafe_base64_encode(force_bytes(user.pk))

		subject = 'Confirm your email at lyrics-chords!'
		message = 'Use the following link to activate your account: ' + BACKEND + '/api/auth/email/activate/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
		email_from = EMAIL_HOST_USER
		recipient_list = [user.email]

		send_mail(subject, message, email_from, recipient_list, fail_silently=False)

		if user is None:
			return HttpResponse("User could not be created.")
		login(request, user)
		return HttpResponse(f'{username}**{email}**{user.is_superuser}')
	except Exception as e:
		return HttpResponseBadRequest(e)

# Log user in, attempting to authenticate with email or username
@require_POST
def auth_login(request):
	if request.user.is_authenticated:
		return HttpResponseBadRequest("You are already logged in.")

	try:
		username, _, password = get_credentials(request)
		user = authenticate(username=username, password=password)
		if user is None:
			user = authenticate(email=username, password=password)
			if user is None:
				return HttpResponseBadRequest("Those credentials do not exist.")

		login(request, user)
		return HttpResponse(f'{user.username}**{user.email}**{user.is_superuser}')
	except Exception:
		return HttpResponseBadRequest("An error occurred.");

# Logout
def auth_logout(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("You aren't logged in.")
	try:
		logout(request)
		return HttpResponse("Logout is successful.")
	except Exception:
		return HttpResponseBadRequest("An error occurred.")

# Check if user is logged in
def is_authenticated(request):
	try:
		return HttpResponse(request.user.is_authenticated)
	except Exception:
		return HttpResponseBadRequest("An error occurred.")

# Retrieve the username of the currently logged in user
def get_user(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("User is not authenticated.")
	try:
		return HttpResponse(request.user.username)
	except Exception:
		return HttpResponseBadRequest("An error occurred.")

# Retrieve the email of the currently logged in user
def get_email(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("User is not authenticated.")
	try:
		return HttpResponse(request.user.email)
	except Exception:
		return HttpResponseBadRequest("An error occurred.")

# Helper function for extracting username and password from JSON request
def get_credentials(request):
	info = json.loads(request.body)
	username = info.get("username")
	email = info.get("email")
	password = info.get("password")
	return (username, email, password)

# Get CSRF token
@ensure_csrf_cookie
def get_csrf(_):
	return HttpResponse("Obtained")

# Get about section
def get_about(_, username):
	try:
		user = get_user_model().objects.get(username=username)
		return HttpResponse(user.about)
	except get_user_model().DoesNotExist:
		return HttpResponseBadRequest('User does not exist')
	except:
		return HttpResponseBadRequest('An error occurred')

@require_POST
def set_about(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest('You are not authenticated.')
	try:
		info = json.loads(request.body)
		username = info.get('username')

		if username != request.user.username:
			return HttpResponseBadRequest('This isn\'t your account!')

		about = info.get('about')
		user = get_user_model().objects.get(username=username)
		user.about = about
		user.save()
		return HttpResponse(user.about)
	except get_user_model().DoesNotExist:
		return HttpResponseBadRequest('User does not exist')
	except:
		return HttpResponseBadRequest('An error occurred')

@require_GET
def get_image(request, username):
	try:
		user = get_user_model().objects.get(username=username)
		image_obj = user.image
		# image_serializer = ImageSerializer(image)
		# print(image_serializer.data.name)
		name = image_obj.image.name
		return HttpResponse(name)
	except Exception as e:
		print(e)
		return HttpResponseBadRequest('An error occurred.')

class ImageView(APIView):
	parser_classes=(MultiPartParser, FormParser)

	def get(self, request):
		qs = Image.objects.all()
		serializer = ImageSerializer(qs, many=True)
		return Response(serializer.data)

	def post(self, request):
		try:
			image_serializer = ImageSerializer(data=request.data)
			if image_serializer.is_valid():
				# Delete existing picture
				username = image_serializer.validated_data.get('user').get('username')
				user = get_user_model().objects.get(username=username)
				images = Image.objects.filter(user=user)
				for image in images:
					image.delete()

				print(image_serializer.validated_data)
				image_serializer.save()
				return Response(image_serializer.data)
			else:
				return HttpResponseBadRequest('Image is invalid.')
		except get_user_model().DoesNotExist:
			return HttpResponseBadRequest('User does not exist.')
		except Exception as e:
			print(e)
			return HttpResponseBadRequest('An error occurred.')
