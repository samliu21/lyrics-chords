from rest_framework import serializers
from .models import Image
from django.contrib.auth import get_user_model

class ImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Image
		fields = '__all__'

	# def create(self, validated_data):
	# 	user = get_user_model().objects.get(username=validated_data.get('username'))
	# 	image = Image.objects.create(image=validated_data.get('image'), user=user)
	# 	return image