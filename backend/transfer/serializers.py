from rest_framework import serializers
from .models import SharedFile

class SharedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFile
        fields = ['id', 'file', 'file_name', 'file_size', 'short_code', 'created_at', 'downloads']
        read_only_fields = ['id', 'file_name', 'file_size', 'short_code', 'created_at', 'downloads']
