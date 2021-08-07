from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import View
from app.models import Song

@api_view(['POST'])
def increment_view(request):
	"""
	/api/views/increment
	Takes a songId in POST body
	Adds a view to the corresponding song if the issuer of the request has not already added a view for that particular song
	"""
	if not request.user.is_authenticated:
		return Response('User is unauthenticated.', status=status.HTTP_401_UNAUTHORIZED)
	
	try:
		song_id = request.data['songId']
	except KeyError:
		return Response('Provided data is of an invalid format.', status=status.HTTP_400_BAD_REQUEST)

	qs = View.objects.all()
	existing_value = qs.filter(Q(user=request.user) & Q(song=song_id))

	if len(existing_value) == 0:
		try:
			song = Song.objects.get(id=song_id)
		except Song.DoesNotExist:
			return Response('Given song id does not correspond to a song.', status=status.HTTP_404_NOT_FOUND)
		view = View(user=request.user, song=song)
		view.save()
		return Response('View has been recorded.', status=status.HTTP_200_OK)

	return Response('View has already been recorded for user.', status=status.HTTP_200_OK)

@api_view(['POST'])
def get_views(request):
	"""
	/api/views/get_views
	Takes a list of ids whose views the request issuer wants to know
	Returns a dictionary of { id: view } whose receive type can be specified by the "Accept" header
	"""
	try:
		ids = request.data['ids']
	except KeyError:
		return Response('The given request body is of an invalid form.', status=status.HTTP_400_BAD_REQUEST)

	qs = View.objects.all()
	views = {}
	for id in ids:
		views[id] = len(qs.filter(song=id))
	return Response(views, status=status.HTTP_200_OK)