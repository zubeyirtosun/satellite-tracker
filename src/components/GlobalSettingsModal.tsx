import React from 'react';
import { Settings, X, RotateCcw, Zap, Clock, Eye } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();

  if (!isOpen) return null;

  const intervalPresets = [
    { value: 1, label: '⚡ Süper Hızlı (1s)', color: '#ff6b6b', description: 'Çok yüksek kaynak kullanımı' },
    { value: 5, label: '🚀 Gerçek Zamanlı (5s)', color: '#ff9f43', description: 'Yüksek kaynak kullanımı' },
    { value: 15, label: '⚡ Normal (15s)', color: '#4ecdc4', description: 'Dengeli performans' },
    { value: 30, label: '🔋 Ekonomik (30s)', color: '#45b7aa', description: 'Orta kaynak kullanımı' },
    { value: 60, label: '🐌 Yavaş (60s)', color: '#96ceb4', description: 'Düşük kaynak kullanımı' },
    { value: 120, label: '💤 Çok Yavaş (120s)', color: '#a8e6cf', description: 'Minimum kaynak kullanımı' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(40, 40, 70, 0.95))',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minWidth: '500px',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#4ecdc4', margin: 0, fontSize: '1.5rem' }}>
            <Settings size={28} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Uygulama Ayarları
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Gerçek Zamanlı Mod */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <Zap size={20} style={{ marginRight: '0.5rem' }} />
            Gerçek Zamanlı Mod
          </h3>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1rem',
            borderRadius: '10px',
            border: settings.realTimeMode ? '2px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}>
              <input
                type="checkbox"
                checked={settings.realTimeMode}
                onChange={(e) => updateSettings({ 
                  realTimeMode: e.target.checked,
                  updateInterval: e.target.checked ? 1 : 15
                })}
                style={{ transform: 'scale(1.5)' }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {settings.realTimeMode ? '🔴 CANLI' : '⭕ Normal'} Mod
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.3rem' }}>
                  {settings.realTimeMode 
                    ? 'Sürekli güncelleme, maksimum doğruluk, yüksek kaynak kullanımı'
                    : 'Belirli aralıklarla güncelleme, dengeli performans'
                  }
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Güncelleme Aralığı */}
        {!settings.realTimeMode && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#4ecdc4', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <Clock size={20} style={{ marginRight: '0.5rem' }} />
              Güncelleme Aralığı: {settings.updateInterval} saniye
            </h3>
            
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={settings.updateInterval}
              onChange={(e) => updateSettings({ updateInterval: Number(e.target.value) })}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #ff6b6b, #4ecdc4, #45b7aa)',
                outline: 'none',
                appearance: 'none',
                marginBottom: '1rem'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {intervalPresets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => updateSettings({ updateInterval: preset.value })}
                  style={{
                    padding: '0.8rem',
                    background: settings.updateInterval === preset.value 
                      ? `linear-gradient(45deg, ${preset.color}, #4ecdc4)` 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{preset.label}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Diğer Ayarlar */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#45b7aa', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <Eye size={20} style={{ marginRight: '0.5rem' }} />
            Görünüm Ayarları
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={settings.showAnimations}
                onChange={(e) => updateSettings({ showAnimations: e.target.checked })}
                style={{ transform: 'scale(1.3)' }}
              />
              <div>
                <div>🎬 Animasyonları Göster</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  Uydu rotasyonları ve geçiş efektleri
                </div>
              </div>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => updateSettings({ autoRefresh: e.target.checked })}
                style={{ transform: 'scale(1.3)' }}
              />
              <div>
                <div>🔄 Otomatik Yenileme</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  Uydu pozisyonlarını otomatik güncelle
                </div>
              </div>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              cursor: 'pointer',
              padding: '0.8rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => updateSettings({ debugMode: e.target.checked })}
                style={{ transform: 'scale(1.3)' }}
              />
              <div>
                <div>🐛 Debug Modu</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  Geliştirici bilgileri göster
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* İstatistikler */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#96ceb4', marginBottom: '1rem' }}>📊 Mevcut Durum</h3>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '1rem', 
            borderRadius: '10px',
            fontSize: '0.9rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem'
          }}>
            <div>🔄 Güncelleme: {settings.realTimeMode ? 'Gerçek Zamanlı' : `${settings.updateInterval}s`}</div>
            <div>🎬 Animasyon: {settings.showAnimations ? 'Açık' : 'Kapalı'}</div>
            <div>♻️ Oto Yenileme: {settings.autoRefresh ? 'Açık' : 'Kapalı'}</div>
            <div>🌙 Tema: {settings.theme === 'dark' ? 'Koyu' : 'Açık'}</div>
            <div>🌍 Dil: {settings.language === 'tr' ? 'Türkçe' : 'English'}</div>
            <div>🐛 Debug: {settings.debugMode ? 'Açık' : 'Kapalı'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={resetSettings}
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(45deg, #ff6b6b, #ff9f43)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RotateCcw size={16} />
            Sıfırla
          </button>
          
          <button
            onClick={onClose}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(45deg, #4ecdc4, #45b7aa)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ✅ Kaydet ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsModal; 