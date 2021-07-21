from django.http.response import HttpResponseBadRequest
from rest_framework import viewsets
from rest_framework.decorators import action
from django.http import HttpResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.db.models import Q

from .serializers import SongSerializer
from .models import Song, View
from backend.settings import API_KEY

import json
import lyricsgenius as lg

CACHE_TIME = 10

# ViewSet for Song model
class SongViewSet(viewsets.ModelViewSet):
	serializer_class = SongSerializer

	def get_queryset(self):
		try:
			usr = self.request.user
			qs = Song.objects.all()
			if usr.is_superuser:
				return qs
			else:
				return qs.filter(creator=usr.username)
		except:
			return None

	@action(detail=False)
	@method_decorator(cache_page(CACHE_TIME))
	def public(self, _):
		try:
			qs = Song.objects.all()
			filtered_qs = qs.filter(public=True)
			serializer = SongSerializer(filtered_qs, many=True)
			return Response(serializer.data)
		except:
			return None

	@action(detail=True)
	def count(self, _, pk=None):
		try:
			username = pk

			# Check that the user exists
			get_user_model().objects.get(username=username)

			qs = Song.objects.all()
			filtered_qs = qs.filter(creator=username)
			return HttpResponse(len(filtered_qs))
		except get_user_model().DoesNotExist:
			return HttpResponseBadRequest('The given user does not exist.')
		except:
			return HttpResponseBadRequest('Could not determine the number of songs.')

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
		end_str = "EmbedShare Url:CopyEmbed:Copy"
		if end_str in lyrics:
			lyrics = lyrics[:lyrics.index(end_str)]
		return HttpResponse(lyrics)
	except:
		return HttpResponseBadRequest("There was an error retrieving the lyrics. Please check your spelling and spacing to make sure there isn't a typo. If not, please try again in a few moments.")

@require_POST
def increment_view(request):
	try:
		body = json.loads(request.body)
		song_id = body.get('songId')
		song = Song.objects.get(id=song_id)

		qs = View.objects.all()
		existing_value = qs.filter(Q(user=request.user) & Q(song=song))

		if len(existing_value) == 0:
			v = View(user=request.user, song=song, value=1)
			v.save()
			return HttpResponse('View has been recorded.')
		return HttpResponse('Already in the database.')
	except Exception as e:
		print(e)
		return HttpResponseBadRequest('An error occurred')