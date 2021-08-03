from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.http.response import HttpResponseBadRequest
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

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
		Sets queryset to all songs if admin
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
	queryset = Comment.objects.all()
	# permission_classes=(IsAuthenticated,)

	# def get_permissions(self):
	# 	pass

	def create(self, request):
		if not request.user.is_authenticated:
			return HttpResponseBadRequest('You are not authenticated.')
		try:
			username = request.data.get('user')
			contents = request.data.get('contents')
			song_id = request.data.get('songId')
			parent = request.data.get('parent')
			if parent:
				parent_comment = Comment.objects.get(pk=parent)

			user = get_user_model().objects.get(username=username)
			song = Song.objects.get(pk=song_id)
			if parent:
				comment = Comment(song=song, user=user, contents=contents, parent=parent_comment)
			else:
				comment = Comment(song=song, user=user, contents=contents)
			comment.save()
			serializer = CommentSerializer(comment)
			return Response(serializer.data)
		except Exception as e:
			print(e)
			return HttpResponseBadRequest('An error occurred.')

	@action(detail=True, methods=['GET'])
	def get_song_comments(self, _, pk=None):
		try:
			song = Song.objects.get(pk=pk)
			qs = Comment.objects.filter(song=song)
			serializer = CommentSerializer(qs, many=True)
			return Response(serializer.data)
		except Exception as e:
			print(e)
			return HttpResponseBadRequest('An error occurred.')

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
