from rest_framework import serializers

from .models import Song, Comment

class SongSerializer(serializers.ModelSerializer):
	class Meta:
		model = Song
		fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = '__all__'