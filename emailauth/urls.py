from django.urls import path

from . import views

urlpatterns = [
	path('activate/<str:uidb64>/<str:token>', views.activate),
	path('is_activated', views.get_is_activated),
	path('resend-activation', views.resend_activation),
	path('password-reset', views.send_password_reset),
	path('change-password', views.change_password),
]