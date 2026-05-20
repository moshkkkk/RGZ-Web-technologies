from rest_framework import serializers
from .models import Video, Comment
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author', 'text', 'created_at')
        read_only_fields = ('id', 'author', 'created_at')


class VideoSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = ('id', 'author', 'title', 'description',
                  'thumbnail', 'views_count', 'created_at', 'comments')
        read_only_fields = ('id', 'author', 'views_count', 'created_at')


class VideoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'file', 'thumbnail')
        read_only_fields = ('id',)