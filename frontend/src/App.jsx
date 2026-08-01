import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import UploadZone from './components/UploadZone';
import ReceiveZone from './components/ReceiveZone';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'receive'

  return (
    <>
      <header className="app-header">
        <div className="logo-container">
          <Share2 className="logo-icon" size={28} />
          <span className="logo-text">AirShare</span>
        </div>
      </header>

      <main className="main-container">
        <div className="glass-card">
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Send File
            </button>
            <button 
              className={`tab-btn ${activeTab === 'receive' ? 'active' : ''}`}
              onClick={() => setActiveTab('receive')}
            >
              Receive File
            </button>
          </div>

          {activeTab === 'upload' ? <UploadZone /> : <ReceiveZone />}
        </div>
      </main>
    </>
  );
}

export default App;
