from django.contrib import admin
from .models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'views_count', 'created_at')
    list_filter = ('author',)
    search_fields = ('title', 'description')