import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000/api`;

const UploadZone = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', file.name);
    formData.append('file_size', file.size);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadResult(null);
    setError('');
  };

  if (uploadResult) {
    const downloadUrl = `${window.location.origin}/receive?code=${uploadResult.short_code}`;
    return (
      <div className="result-container">
        <div className="alert alert-success">
          <CheckCircle size={18} /> File ready to share!
        </div>
        
        <div className="qr-code-wrapper">
          <QRCodeSVG value={uploadResult.short_code} size={200} />
        </div>
        
        <p style={{ color: 'var(--text-secondary)' }}>Share this code:</p>
        <div className="short-code-display">{uploadResult.short_code}</div>
        
        <div className="file-info" style={{ width: '100%' }}>
          <File className="file-icon" size={24} />
          <div className="file-details">
            <div className="file-name">{file.name}</div>
            <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        </div>

        <button className="btn-primary" onClick={resetUpload} style={{ marginTop: '1rem' }}>
          Upload Another File
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {!file ? (
        <div
          className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud className="upload-icon" />
          <div className="upload-text">Drag & drop a file here</div>
          <div className="upload-subtext">or tap to browse your files</div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div>
          <div className="file-info">
            <File className="file-icon" size={24} />
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={handleUpload} 
            disabled={isUploading}
          >
            {isUploading ? (
              <><span className="loader"></span> Uploading...</>
            ) : (
              <><UploadCloud size={20} /> Generate Link</>
            )}
          </button>
          
          <button 
            onClick={() => setFile(null)} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              width: '100%', 
              padding: '1rem', 
              marginTop: '0.5rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
