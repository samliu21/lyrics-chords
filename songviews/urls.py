from django.urls import path

from . import views

urlpatterns = [
	path('increment', views.increment_view),
	path('get_views', views.get_views),
]