import os
from django.http import HttpResponse, Http404
from rest_framework import status, views, response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import SharedFile
from .serializers import SharedFileSerializer

class FileUploadView(views.APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = SharedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return response.Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return response.Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileDetailView(views.APIView):
    def get(self, request, short_code, *args, **kwargs):
        shared_file = get_object_or_404(SharedFile, short_code=short_code)
        serializer = SharedFileSerializer(shared_file)
        return response.Response(serializer.data)

class FileDownloadView(views.APIView):
    def get(self, request, short_code, *args, **kwargs):
        shared_file = get_object_or_404(SharedFile, short_code=short_code)
        
        # Increment downloads
        shared_file.downloads += 1
        shared_file.save()
        
        file_path = shared_file.file.path
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            resp = HttpResponse(file_data, content_type="application/octet-stream")
            resp['Content-Disposition'] = f'attachment; filename="{shared_file.file_name}"'
            return resp
        raise Http404("File does not exist")
