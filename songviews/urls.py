from django.urls import path

from . import views

urlpatterns = [
	path('increment', views.increment_view),
	path('get_views/<int:id>', views.get_views),
	path('get_all_views', views.get_all_views),
]