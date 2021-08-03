from rest_framework import serializers

from .models import Image, User

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['email', 'username', 'confirmed_email', 'is_superuser']

class ImageSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')

	class Meta:
		model = Image
		fields = ['id', 'username', 'url']
