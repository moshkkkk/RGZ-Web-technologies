from django.http import StreamingHttpResponse, Http404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Video, Comment
from .serializers import VideoSerializer, VideoUploadSerializer, CommentSerializer
import os


def range_file_iterator(file_path, start, end, chunk_size=8192):
    with open(file_path, 'rb') as f:
        f.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = f.read(min(chunk_size, remaining))
            if not chunk:
                break
            yield chunk
            remaining -= len(chunk)


class VideoListView(generics.ListAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (permissions.AllowAny,)


class VideoUploadView(generics.CreateAPIView):
    serializer_class = VideoUploadSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class VideoDetailView(generics.RetrieveDestroyAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def retrieve(self, request, *args, **kwargs):
        video = self.get_object()
        video.views_count += 1
        video.save()
        serializer = self.get_serializer(video)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        video = self.get_object()
        if video.author != request.user:
            return Response(
                {'error': 'Нет прав для удаления этого видео'},
                status=status.HTTP_403_FORBIDDEN
            )
        video.file.delete(save=False)
        if video.thumbnail:
            video.thumbnail.delete(save=False)
        video.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class VideoStreamView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        try:
            video = Video.objects.get(pk=pk)
        except Video.DoesNotExist:
            raise Http404

        file_path = video.file.path
        file_size = os.path.getsize(file_path)
        range_header = request.META.get('HTTP_RANGE', '')

        if range_header:
            range_value = range_header.strip().replace('bytes=', '')
            parts = range_value.split('-')
            start = int(parts[0])
            end = int(parts[1]) if parts[1] else file_size - 1
        else:
            start = 0
            end = file_size - 1

        response = StreamingHttpResponse(
            range_file_iterator(file_path, start, end),
            status=206 if range_header else 200,
            content_type='video/mp4'
        )
        response['Content-Length'] = end - start + 1
        response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        response['Accept-Ranges'] = 'bytes'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Headers'] = 'Range'
        response['Access-Control-Expose-Headers'] = 'Content-Range, Content-Length'
        return response


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return Comment.objects.filter(video_id=self.kwargs['pk'])

    def perform_create(self, serializer):
        video = Video.objects.get(pk=self.kwargs['pk'])
        serializer.save(author=self.request.user, video=video)