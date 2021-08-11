from rest_framework import serializers

from .models import Song, Comment

class SongSerializer(serializers.ModelSerializer):
	creator = serializers.CharField(source='creator.username')
	chords = serializers.CharField(trim_whitespace=False)
	lyrics = serializers.CharField(trim_whitespace=False)
	pulled_lyrics = serializers.CharField(trim_whitespace=False)

	class Meta:
		model = Song
		fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
	username = serializers.CharField(source='user.username')

	class Meta:
		model = Comment
		fields = ['id', 'song', 'username', 'contents', 'date_of_creation', 'edited', 'parent']