from django.urls import path
from .views import FileUploadView, FileDetailView, FileDownloadView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('detail/<str:short_code>/', FileDetailView.as_view(), name='file-detail'),
    path('download/<str:short_code>/', FileDownloadView.as_view(), name='file-download'),
]
