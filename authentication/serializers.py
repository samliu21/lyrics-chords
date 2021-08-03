from rest_framework import serializers

from .models import Image

class ImageSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')

	class Meta:
		model = Image
		fields = ['id', 'username', 'url']
