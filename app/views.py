from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Song, Comment
from .serializers import SongSerializer, CommentSerializer
from backend.settings import API_KEY

import lyricsgenius as lg

class SongViewSet(viewsets.ModelViewSet):
	serializer_class = SongSerializer

	def get_queryset(self):
		"""
		Sets queryset to be songs owned by user
		This makes it so that a user can only manipulate their own songs
		"""
		user = self.request.user
		qs = Song.objects.all()
		if user.is_superuser:
			return qs
		else:
			return qs.filter(creator=user.username)

	def create(self, request):
		"""
		Check that the request's user matches the proposed creator of the song
		Then, call the super create() function
		"""
		try:
			username = request.data['creator']
			
			if username != request.user.username:
				return Response('Cannot make a song for another user.', status=status.HTTP_403_FORBIDDEN)
		except KeyError:
			return Response('Username was not provided.', status=status.HTTP_400_BAD_REQUEST)
		
		return super().create(request)

	@action(detail=False)
	@method_decorator(cache_page(10))
	def public(self, _):
		"""
		/api/songs/public/
		Returns a list of Song objects in the format specified by the "Accept" header
		Usually returns application/json
		"""
		qs = Song.objects.all()
		filtered_qs = qs.filter(public=True)
		serializer = SongSerializer(filtered_qs, many=True)
		return Response(serializer.data)

	@action(detail=True)
	def count(self, _, pk=None):
		"""
		/api/songs/USERNAME/count/
		Get the number of songs created by a user
		"""
		username = pk

		try:
			get_user_model().objects.get(username=username)
		except get_user_model().DoesNotExist:
			return Response('User does not exist', status=status.HTTP_404_NOT_FOUND)

		qs = Song.objects.all()
		filtered_qs = qs.filter(creator=username)
		return Response(len(filtered_qs))

class CommentViewSet(viewsets.ModelViewSet):
	serializer_class = CommentSerializer

	"""
	GET actions should be allowed to all users
	PUT, PATCH, and DELETE should only be available if the author of the comment matches the issuer of the request
	CREATE should only be allowed if the proposed user matches the issuer of the request
	"""
	def get_permissions(self):
		methods = ['list', 'retrieve', 'get_song_comments']
		if self.action in methods:
			permission_classes = [AllowAny]
		else:
			permission_classes = [IsAuthenticated]
		return [permission() for permission in permission_classes]

	def get_queryset(self):
		methods = ['retrieve', 'update', 'partial_update', 'destroy']
		if self.action in methods:
			return Comment.objects.filter(user=self.request.user)
		else:
			return Comment.objects.all()

	def create(self, request):
		"""
		Receives username, comment contents, id of song that the comment exists on, and the id of the parent comment
		Check that the received username matches the username of the request issuer
		Creates comment object based on user data
		"""
		try:
			username = request.data['user']
			contents = request.data['contents']
			song_id = request.data['songId']
			parent = request.data['parent']
		except KeyError:
			return Response('Improper content. Please check that you have included all necessary fields.', status=status.HTTP_400_BAD_REQUEST)
		
		if username != request.user.username:
			return Response('Cannot make a comment for another user.', status=status.HTTP_403_FORBIDDEN)

		try:
			if parent:
				parent_comment = Comment.objects.get(pk=parent)
			else:
				parent_comment = None
			user = get_user_model().objects.get(username=username)
			song = Song.objects.get(pk=song_id)
		except Comment.DoesNotExist:
			return Response('Parent comment does not exist.', status=status.HTTP_404_NOT_FOUND)
		except get_user_model().DoesNotExist:
			return Response('User does not exist.', status=status.HTTP_404_NOT_FOUND)
		except Song.DoesNotExist:
			return Response('Song does not exist.', status=status.HTTP_404_NOT_FOUND)

		comment = Comment(song=song, user=user, contents=contents, parent=parent_comment)
		comment.save()
		serializer = CommentSerializer(comment)
		return Response(serializer.data)

	@action(detail=True)
	def get_song_comments(self, _, pk=None):
		"""
		/api/comments/get_song_comments/
		Returns all comments in the format specified by the "Accept" header
		"""
		try:
			song = Song.objects.get(pk=pk)
		except Song.DoesNotExist:
			return Response('Song does not exist.', status=status.HTTP_404_NOT_FOUND)
		qs = Comment.objects.filter(song=song)
		serializer = CommentSerializer(qs, many=True)
		return Response(serializer.data)

# Fetch lyrics using lyricsgenius API
# Only accessible by authenticated users 
@require_GET
def fetch_lyrics(request, info):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest("Not authenticated.")
	try:
		genius = lg.Genius(API_KEY,
								skip_non_songs=True, excluded_terms=["(Remix)", "(Live)"],
								remove_section_headers=True)
		
		artist_name, name = info.split('**')
		artist = genius.search_artist(artist_name, max_songs=0)
		lyrics = artist.song(name).lyrics
		end_str = "EmbedShare UrlCopyEmbedCopy"
		if end_str in lyrics:
			lyrics = lyrics[:lyrics.index(end_str)]
		return HttpResponse(lyrics)
	except:
		return HttpResponseBadRequest("There was an error retrieving the lyrics. Please check your spelling and spacing to make sure there isn't a typo. If not, please try again in a few moments.")
