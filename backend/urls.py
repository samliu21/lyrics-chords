from django.contrib import admin
from django.urls import path, include
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView
from rest_framework import routers

from app import views

router = routers.DefaultRouter()
router.register(r'songs', views.SongViewSet, basename="songs")
router.register(r'comments', views.CommentViewSet, basename="comments")

urlpatterns = [
    path('admin/', admin.site.urls),
	path('api/views/', include('songviews.urls')),
	path('api/lyrics/<str:info>', views.fetch_lyrics),
	path('api/auth/', include('authentication.urls')),
	path('api/', include(router.urls)),
	path('', never_cache(TemplateView.as_view(template_name='index.html'))),
]
