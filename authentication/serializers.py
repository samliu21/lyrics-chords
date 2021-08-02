from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.Serializer):
	class Meta:
		model = Image
		fields = '__all__'