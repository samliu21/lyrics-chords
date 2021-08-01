from django.urls import path, include

from . import views

urlpatterns = [
	path('signup', views.auth_signup, name='signup'),
	path('login', views.auth_login, name='login'),
	path('logout', views.auth_logout, name='logout'),
	path('user', views.get_user, name='user'),
	path('email', views.get_email, name='email'),
	path('csrf', views.get_csrf, name='csrf'),
	path('authenticated', views.is_authenticated, name='authenticated'),
	path('about/<str:username>', views.get_about, name='about'),
	path('set_about', views.set_about, name='set_about'),
	path('email/', include('emailauth.urls')),
]