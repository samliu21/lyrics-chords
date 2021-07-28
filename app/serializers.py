from rest_framework import serializers

from .models import Song, Comment

class SongSerializer(serializers.ModelSerializer):
	class Meta:
		model = Song
		fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')

	class Meta:
		model = Comment
		fields = ['id', 'song', 'username', 'contents', 'date_of_creation', 'edited', 'parent']