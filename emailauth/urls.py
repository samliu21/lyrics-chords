from django.urls import path

from . import views

urlpatterns = [
	path('activate/<str:uidb64>/<str:token>', views.activate),
	path('is_activated', views.get_is_activated),
	path('resend-activation', views.resend_activation),
	path('password-reset', views.send_password_reset),
	path('password-change', views.password_change),
	path('password-change-link', views.password_change_link),
]