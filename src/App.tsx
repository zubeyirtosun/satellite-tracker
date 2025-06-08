import React, { useState, useEffect } from 'react';
import './App.css';
import ISSTracker from './components/ISSTracker';
import SatellitePredictor from './components/SatellitePredictor';
import NotificationManager from './components/NotificationManager';
import FrequencyPlanner from './components/FrequencyPlanner';
import MultiSatelliteTracker from './components/MultiSatelliteTracker';
import OrbitVisualization3D from './components/OrbitVisualization3D';
import GlobalSettingsModal from './components/GlobalSettingsModal';
import { SettingsProvider } from './contexts/SettingsContext';
import { initEmailJS } from './services/emailService';
import { Satellite, Radar, Bell, Radio, Orbit, Globe, Settings } from 'lucide-react';

type ActiveTab = 'iss' | 'predictor' | 'notifications' | 'frequencies' | 'multi-satellite' | '3d-orbit';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('iss');
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);

  // EmailJS'i başlat
  useEffect(() => {
    initEmailJS();
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'iss':
        return <ISSTracker />;
      case 'predictor':
        return <SatellitePredictor />;
      case 'notifications':
        return <NotificationManager />;
      case 'frequencies':
        return <FrequencyPlanner />;
      case 'multi-satellite':
        return <MultiSatelliteTracker />;
      case '3d-orbit':
        return <OrbitVisualization3D />;
      default:
        return <ISSTracker />;
    }
  };

  return (
    <SettingsProvider>
      <div className="App">
        <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1>🛰️ Uydu Takip Merkezi</h1>
          <button
            onClick={() => setShowGlobalSettings(true)}
            style={{
              padding: '0.7rem 1.2rem',
              background: 'linear-gradient(45deg, #ffeaa7, #fdcb6e)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            <Settings size={20} />
            Ayarlar
          </button>
        </div>
        <nav className="navigation">
          <button 
            className={`nav-button ${activeTab === 'iss' ? 'active' : ''}`}
            onClick={() => setActiveTab('iss')}
          >
            <Satellite size={20} />
            Canlı ISS Takibi
          </button>
          <button 
            className={`nav-button ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictor')}
          >
            <Radar size={20} />
            Geçiş Tahmini
          </button>
          <button 
            className={`nav-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} />
            Bildirimler
          </button>
          <button 
            className={`nav-button ${activeTab === 'frequencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('frequencies')}
          >
            <Radio size={20} />
            Frekanslar
          </button>
          <button 
            className={`nav-button ${activeTab === 'multi-satellite' ? 'active' : ''}`}
            onClick={() => setActiveTab('multi-satellite')}
          >
            <Orbit size={20} />
            Çoklu Takip
          </button>
          <button 
            className={`nav-button ${activeTab === '3d-orbit' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d-orbit')}
          >
            <Globe size={20} />
            3D Görselleştirme
          </button>
        </nav>
      </header>
      
        <main className="main-content">
          {renderActiveComponent()}
        </main>
        
        <GlobalSettingsModal 
          isOpen={showGlobalSettings}
          onClose={() => setShowGlobalSettings(false)}
        />
      </div>
    </SettingsProvider>
  );
}

export default App;
