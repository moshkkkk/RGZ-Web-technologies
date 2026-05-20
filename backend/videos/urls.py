from django.urls import path
from .views import VideoListView, VideoUploadView, VideoDetailView, VideoStreamView, CommentListCreateView

urlpatterns = [
    path('', VideoListView.as_view(), name='video-list'),
    path('upload/', VideoUploadView.as_view(), name='video-upload'),
    path('<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('<int:pk>/stream/', VideoStreamView.as_view(), name='video-stream'),
    path('<int:pk>/comments/', CommentListCreateView.as_view(), name='video-comments'),
]