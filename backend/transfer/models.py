import os
import random
import string
from django.db import models

def generate_short_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def file_upload_path(instance, filename):
    # Store files in a folder named with their short code
    return f'shared_files/{instance.short_code}/{filename}'



class SharedFile(models.Model):
    file = models.FileField(upload_to=file_upload_path)
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    short_code = models.CharField(max_length=10, unique=True, default=generate_short_code)
    created_at = models.DateTimeField(auto_now_add=True)
    downloads = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.file_name:
            self.file_name = self.file.name
        if not self.file_size and self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.file_name} ({self.short_code})"
