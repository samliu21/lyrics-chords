from django.urls import path, include

from . import views

urlpatterns = [
	# User session authentication
	path('signup', views.auth_signup, name='signup'),
	path('login', views.auth_login, name='login'),
	path('logout', views.auth_logout, name='logout'),

	# Get information about user
	path('authenticated', views.is_authenticated, name='authenticated'),
	path('user', views.get_user, name='user'),

	path('csrf', views.get_csrf, name='csrf'),

	# User's about section
	path('about/<str:username>', views.get_about, name='about'),
	path('set_about', views.set_about, name='set_about'),

	# User profile picture
	path('images/get_image/<str:username>', views.get_image, name='get_image'),
	path('images/', views.ImageView.as_view(), name='images'),

	# Email services
	path('email/', include('emailauth.urls')),
]