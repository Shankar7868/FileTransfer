import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, AlertCircle, File, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000/api`;

const ReceiveZone = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileDetails, setFileDetails] = useState(null);

  // Check URL for code parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    if (codeParam) {
      setCode(codeParam.toUpperCase());
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-character code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/detail/${code}/`);
      setFileDetails(response.data);
    } catch (err) {
      setError('File not found or link expired.');
      setFileDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Triggers actual browser download
    window.location.href = `${API_BASE_URL}/download/${code}/`;
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
    if (error) setError('');
  };

  return (
    <div>
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {!fileDetails ? (
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <label className="input-label">Enter 6-Digit Code</label>
            <input
              type="text"
              className="code-input"
              value={code}
              onChange={handleCodeChange}
              placeholder="XXXXXX"
              maxLength={6}
              autoComplete="off"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <><span className="loader"></span> Searching...</>
            ) : (
              <><Search size={20} /> Find File</>
            )}
          </button>
        </form>
      ) : (
        <div className="result-container">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>File Found!</h3>
          
          <div className="file-info" style={{ width: '100%' }}>
            <File className="file-icon" size={24} />
            <div className="file-details">
              <div className="file-name">{fileDetails.file_name}</div>
              <div className="file-size">{(fileDetails.file_size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleDownload}>
            <Download size={20} /> Download File
          </button>
          
          <button 
            onClick={() => {
              setFileDetails(null);
              setCode('');
            }} 
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
          >
            Enter Another Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiveZone;
