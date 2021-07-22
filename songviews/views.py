from django.views.decorators.http import require_GET, require_POST
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.db.models import Q
from django.views.decorators.cache import cache_page

import json
from app.models import Song
from .models import View

@require_POST
def increment_view(request):
	if not request.user.is_authenticated:
		return HttpResponseBadRequest('You are not authenticated.')
	try:
		body = json.loads(request.body)
		song_id = body.get('songId')

		qs = View.objects.all()
		existing_value = qs.filter(Q(user=request.user) & Q(song=song_id))

		if len(existing_value) == 0:
			song = Song.objects.get(id=song_id)
			v = View(user=request.user, song=song)
			v.save()
			return HttpResponse('View has been recorded.')
		return HttpResponseBadRequest('Already in the database.')
	except Exception as e:
		print(e)
		return HttpResponseBadRequest('An error occurred')

@cache_page(10)
@require_GET
def get_views(_, id):
	try:
		qs = View.objects.filter(song=id)
		return HttpResponse(len(qs))
	except:
		return HttpResponseBadRequest('An error occurred.')

@require_POST
def get_all_views(request):
	try:
		body = json.loads(request.body)
		ids = body.get('ids')

		qs = View.objects.all()
		views = {}
		for id in ids:
			views[id] = len(qs.filter(song=id))
		return HttpResponse(json.dumps(views))
	except:
		return HttpResponseBadRequest('An error occurred.')