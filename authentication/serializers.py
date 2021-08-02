from rest_framework import serializers
from .models import Image
from django.contrib.auth import get_user_model

class ImageSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')

	class Meta:
		model = Image
		fields = ['id', 'username', 'url']

	# def create(self, validated_data):
	# 	try:
	# 		username = validated_data.get('user').get('username')
	# 		image_name = validated_data.get('image')
	# 		user = get_user_model().objects.get(username=username)

	# 		image = Image.objects.create(image=image_name, user=user)
	# 		return image
	# 	except get_user_model().DoesNotExist:
	# 		return TypeError('User does not exist')
	# 	except Exception as e:
	# 		return e

	# def is_valid(self):
	# 	return True

	# def is_valid(self, raise_exception):
	# 	return super().is_valid(raise_exception=raise_exception)