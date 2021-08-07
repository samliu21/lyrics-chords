from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode 
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

import cloudinary
from authentication.models import Image
from authentication.serializers import ImageSerializer, UserSerializer
from backend.settings import EMAIL_HOST_USER, BACKEND
from emailauth.tokens import ConfirmEmailTokenGenerator

account_activation_token = ConfirmEmailTokenGenerator()

@api_view(['POST'])
def auth_signup(request):
	"""
	/api/auth/signup
	Validate the user's inputted credentials
	Create a hashed token and user id to be used in the email verification URL
	Send the email
	"""
	try:
		username = request.data['username']
		email = request.data['email']
		password = request.data['password']
	except KeyError:
		return Response('The provided data is in an improper form.', status=status.HTTP_400_BAD_REQUEST)

	if len(username) < 5:
		return Response('Username should be at least 5 characters.', status=status.HTTP_400_BAD_REQUEST)

	if len(password) < 5:
		return Response('Password should be at least 5 characters.', status=status.HTTP_400_BAD_REQUEST)

	try:
		get_user_model().objects.get(username=username)
		return Response('Username already exists. Did you mean to login instead?', status=status.HTTP_409_CONFLICT)
	except get_user_model().DoesNotExist:
		pass

	try:
		get_user_model().objects.get(email=email)
		return Response('Email already exists. Did you mean to login instead?', status=status.HTTP_409_CONFLICT)
	except get_user_model().DoesNotExist:
		pass

	user = get_user_model().objects.create(username=username, email=email, password=password)
	user.save()
	print(user)

	token = account_activation_token.make_token(user)
	uid = urlsafe_base64_encode(force_bytes(user.pk))

	subject = 'Confirm your email at lyrics-chords!'
	message = 'Use the following link to activate your account: ' + BACKEND + '/api/auth/email/activate/{}/{}. If you didn\'t make an account here, kindly ignore the email.'.format(uid, token)
	email_from = EMAIL_HOST_USER
	recipient_list = [user.email]

	send_mail(subject, message, email_from, recipient_list, fail_silently=False)

	login(request, user)
	user_serializer = UserSerializer(user)
	return Response(user_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def auth_login(request):
	"""
	/auth/api/login
	Given a username and password, attempt to login the user
	The view also accomodates email as username
	"""
	try:
		username = request.data['username']
		password = request.data['password']
	except KeyError:
		return Response('The provided data is in an improper form.', status=status.HTTP_400_BAD_REQUEST)

	user = authenticate(username=username, password=password)
	if user is None:
		user = authenticate(email=username, password=password)

	if user is None:
		return Response('Login credentials are incorrect.', status=status.HTTP_401_UNAUTHORIZED)

	login(request, user)
	user_serializer = UserSerializer(user)
	return Response(user_serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def auth_logout(request):
	"""
	/api/auth/logout
	"""
	logout(request)
	return Response('Logout is successful.', status=status.HTTP_200_OK)

@api_view(['GET'])
def is_authenticated(request):
	"""
	/api/auth/authenticated
	Check if the issuer of the request is authenticated
	"""
	return Response(request.user.is_authenticated, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user(request):
	"""
	/api/auth/user
	Returns user's information as defined by UserSerializer
	"""
	if not request.user.is_authenticated:
		return Response('User is not authenticated.', status=status.HTTP_401_UNAUTHORIZED)
	print(request.user)
	user_serializer = UserSerializer(request.user)
	return Response(user_serializer.data)

@ensure_csrf_cookie
@api_view(['GET'])
def get_csrf(_):
	"""
	/api/auth/csrf
	User should request a CSRF token at the start of the session
	"""
	# csrf = get_token(request)
	# print(csrf)
	return Response('CSRF cookie was obtained.', status=status.HTTP_200_OK)

@api_view(['GET'])
def get_about(_, username):
	"""
	/api/auth/get_about/<username>
	Gets user's biography
	"""
	try:
		user = get_user_model().objects.get(username=username)
	except get_user_model().DoesNotExist:
		return Response('User does not exist.', status=status.HTTP_400_BAD_REQUEST)
	return Response(user.about, status=status.HTTP_200_OK)

@api_view(['POST'])
def set_about(request):
	"""
	/api/auth/set_about
	Receives a biography and sets the about property for the issuer of the request
	"""
	if not request.user.is_authenticated:
		return Response('User is not authenticated.', status=status.HTTP_401_UNAUTHORIZED)
	try:
		about = request.data['about']
	except KeyError:
		return Response('Provided data is of improper format.', status=status.HTTP_400_BAD_REQUEST)

	user = get_user_model().objects.get(username=request.user.username)
	user.about = about
	user.save()
	return Response(user.about, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_image(_, username):
	"""
	/api/auth/images/get_image/USERNAME
	Returns the image URL of the given username
	"""
	try:
		user = get_user_model().objects.get(username=username)
		image = Image.objects.get(user=user)
		return Response(image.url, status=status.HTTP_200_OK)
	except get_user_model().DoesNotExist:
		return Response('Username does not exist.', status=status.HTTP_404_NOT_FOUND)
	except Image.DoesNotExist:
		return Response('User does not have a profile picture.', status=status.HTTP_404_NOT_FOUND)

class ImageView(APIView):
	parser_classes=(MultiPartParser, FormParser)

	def post(self, request):
		"""
		/api/auth/images/
		Receive an image and upload request to Cloudinary server
		Delete existing profile picture if exists
		Returns newly created song (e.g. id, url, username)
		"""
		if not request.user.is_authenticated:
			return Response('User is not authenticated', status=status.HTTP_401_UNAUTHORIZED)
		try:
			img = request.data['image']
		except KeyError:
			return Response('Input form is invalid.', status=status.HTTP_400_BAD_REQUEST)

		response = cloudinary.uploader.upload(img, public_id=request.user.id)
		url = response.get('url')

		Image.objects.filter(user=request.user).delete()

		image = Image.objects.create(user=request.user, url=url)
		image_serializer = ImageSerializer(image)
		return Response(image_serializer.data)
