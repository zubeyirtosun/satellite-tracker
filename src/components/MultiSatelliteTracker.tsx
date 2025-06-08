import React, { useState, useEffect, useMemo } from 'react';
import { Satellite as SatelliteIcon, Filter, Eye, EyeOff, RefreshCw, Zap, Map } from 'lucide-react';
import { popularSatellites, getSatellitePosition, Satellite } from '../services/multiSatelliteApi';
import { useSettings } from '../contexts/SettingsContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet ikonları düzelt
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MultiSatelliteTracker: React.FC = () => {
  const { settings } = useSettings();
  const [satellites, setSatellites] = useState<Satellite[]>(popularSatellites);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['scientific', 'communication']);
  const [onlyActive, setOnlyActive] = useState(true);
  const [visibleSatellites, setVisibleSatellites] = useState<Set<number>>(new Set([25544])); // ISS varsayılan
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState<boolean>(true);

  const satelliteTypes = [
    { key: 'scientific', label: '🔬 Bilimsel', color: '#4ecdc4' },
    { key: 'communication', label: '📡 İletişim', color: '#ff6b6b' },
    { key: 'weather', label: '🌦️ Hava Durumu', color: '#45b7aa' },
    { key: 'navigation', label: '🧭 Navigasyon', color: '#96ceb4' },
    { key: 'military', label: '🛡️ Askeri', color: '#ffeaa7' }
  ];

  const updateSatellitePositions = React.useCallback(async () => {
    setIsLoading(true);
    
    // Current satellites'ı al, dependency loop'u önlemek için
    setSatellites(currentSatellites => {
      // Async update'i promise olarak çalıştır
      Promise.all(
        currentSatellites.map(async (sat) => {
          if (visibleSatellites.has(sat.id)) {
            const position = await getSatellitePosition(sat.noradId);
            return { ...sat, position: position || undefined };
          }
          return sat;
        })
      ).then(updatedSatellites => {
        setSatellites(updatedSatellites);
        setIsLoading(false);
      });
      
      return currentSatellites; // Şimdilik aynı değeri döndür
    });
  }, [visibleSatellites]);

  useEffect(() => {
    if (!settings.autoRefresh) return;
    
    updateSatellitePositions();
    const intervalMs = settings.realTimeMode ? 1000 : settings.updateInterval * 1000;
    const interval = setInterval(updateSatellitePositions, intervalMs);
    return () => clearInterval(interval);
  }, [updateSatellitePositions, settings.autoRefresh, settings.realTimeMode, settings.updateInterval]);

  // Memoized filtered satellites
  const filteredSatellites = useMemo(() => {
    return satellites.filter(satellite => {
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(satellite.type);
      const statusMatch = onlyActive ? satellite.active : true;
      return typeMatch && statusMatch;
    });
  }, [satellites, selectedTypes, onlyActive]);

  const toggleSatelliteVisibility = (satId: number) => {
    const newVisible = new Set(visibleSatellites);
    if (newVisible.has(satId)) {
      newVisible.delete(satId);
    } else {
      newVisible.add(satId);
    }
    setVisibleSatellites(newVisible);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getTypeConfig = (type: string) => {
    return satelliteTypes.find(t => t.key === type) || { label: type, color: '#ffffff' };
  };

  // Uydu türlerine göre harita ikonları
  const createSatelliteIcon = (type: string) => {
    const typeConfig = getTypeConfig(type);
    return L.divIcon({
      html: `<div style="
        background: ${typeConfig.color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px ${typeConfig.color};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
      ">🛰️</div>`,
      className: 'satellite-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <h2 style={{ color: '#4ecdc4', margin: 0 }}>
          🛰️ Çoklu Uydu Takibi
        </h2>
        <button
          onClick={updateSatellitePositions}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Güncelleniyor...' : 'Pozisyonları Güncelle'}
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr', 
        gap: '2rem',
        minHeight: '70vh'
      }}>
        
        {/* Sol Panel - Filtreler ve Uydu Listesi */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>
            <Filter size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Filtreler
          </h3>
          
          {/* Uydu Türleri */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>Uydu Türleri:</h4>
            {satelliteTypes.map(type => (
              <label 
                key={type.key}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.key)}
                  onChange={() => toggleType(type.key)}
                />
                <span style={{ color: type.color }}>{type.label}</span>
              </label>
            ))}
          </div>

          {/* Aktif Uydu Filtresi */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(e.target.checked)}
              />
              <span>Sadece aktif uydular</span>
            </label>
          </div>

          {/* Uydu Listesi */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>
              Uydular ({filteredSatellites.length}):
            </h4>
            {filteredSatellites.map(satellite => {
              const typeConfig = getTypeConfig(satellite.type);
              const isVisible = visibleSatellites.has(satellite.id);
              
              return (
                <div 
                  key={satellite.id}
                  style={{
                    background: isVisible ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isVisible ? typeConfig.color : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSatelliteVisibility(satellite.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: typeConfig.color,
                        fontSize: '0.9rem'
                      }}>
                        {satellite.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        opacity: 0.8,
                        marginTop: '0.3rem'
                      }}>
                        NORAD: {satellite.noradId}
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: typeConfig.color,
                        marginTop: '0.2rem'
                      }}>
                        {typeConfig.label}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {!satellite.active && <span style={{ fontSize: '0.7rem' }}>⚠️</span>}
                      {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </div>
                  </div>
                  
                  {isVisible && satellite.position && (
                    <div style={{ 
                      marginTop: '0.8rem', 
                      padding: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      <div>📍 Lat: {satellite.position.latitude.toFixed(2)}°</div>
                      <div>📍 Lon: {satellite.position.longitude.toFixed(2)}°</div>
                      <div>🚀 Alt: {satellite.position.altitude.toFixed(0)} km</div>
                      <div>⚡ Hız: {satellite.position.velocity.toFixed(2)} km/s</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ Panel - Harita/Liste Görünümü */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <h3 style={{ color: '#ff6b6b', margin: 0 }}>
              <SatelliteIcon size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Takip Edilen Uydular
            </h3>
            <button
              onClick={() => setShowMap(!showMap)}
              style={{
                padding: '0.5rem 1rem',
                background: showMap ? 'linear-gradient(45deg, #4ecdc4, #45b7aa)' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Map size={16} />
              {showMap ? 'Liste Görünümü' : 'Harita Görünümü'}
            </button>
          </div>

          {visibleSatellites.size === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              opacity: 0.7,
              fontSize: '1.1rem'
            }}>
              🛰️ Takip etmek için sol panelden<br/>
              uyduları seçin!
            </div>
          ) : showMap ? (
            // Harita Görünümü
            <div style={{ height: '500px', borderRadius: '10px', overflow: 'hidden' }}>
              <MapContainer
                center={[39.9208, 32.8541]} // Ankara
                zoom={2}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {satellites
                  .filter(sat => visibleSatellites.has(sat.id) && sat.position)
                  .map(satellite => {
                    const typeConfig = getTypeConfig(satellite.type);
                    
                    return (
                      <Marker
                        key={satellite.id}
                        position={[satellite.position!.latitude, satellite.position!.longitude]}
                        icon={createSatelliteIcon(satellite.type)}
                      >
                        <Popup>
                          <div style={{ minWidth: '200px' }}>
                            <h4 style={{ 
                              color: typeConfig.color, 
                              margin: '0 0 0.5rem 0',
                              fontSize: '1rem'
                            }}>
                              {satellite.name}
                            </h4>
                            <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                              {typeConfig.label} • NORAD {satellite.noradId}
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              <div>📍 Lat: {satellite.position!.latitude.toFixed(4)}°</div>
                              <div>📍 Lon: {satellite.position!.longitude.toFixed(4)}°</div>
                              <div>🚀 Alt: {satellite.position!.altitude.toFixed(0)} km</div>
                              <div>⚡ Hız: {satellite.position!.velocity.toFixed(2)} km/s</div>
                            </div>
                            <div style={{
                              marginTop: '0.5rem',
                              padding: '0.3rem 0.6rem',
                              background: satellite.active ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)',
                              borderRadius: '15px',
                              fontSize: '0.75rem',
                              textAlign: 'center'
                            }}>
                              {satellite.active ? '🟢 Aktif' : '🔴 Pasif'}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {satellites
                .filter(sat => visibleSatellites.has(sat.id))
                .map(satellite => {
                  const typeConfig = getTypeConfig(satellite.type);
                  
                  return (
                    <div 
                      key={satellite.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `2px solid ${typeConfig.color}`,
                        borderRadius: '12px',
                        padding: '1.5rem'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h4 style={{ 
                            color: typeConfig.color, 
                            margin: '0 0 0.5rem 0',
                            fontSize: '1.2rem'
                          }}>
                            {satellite.name}
                          </h4>
                          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            {typeConfig.label} • NORAD {satellite.noradId}
                          </div>
                        </div>
                        <div style={{
                          padding: '0.3rem 0.8rem',
                          background: satellite.active ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 107, 107, 0.3)',
                          borderRadius: '20px',
                          fontSize: '0.8rem'
                        }}>
                          {satellite.active ? '🟢 Aktif' : '🔴 Pasif'}
                        </div>
                      </div>

                      {satellite.position ? (
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: '1rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '1rem',
                          borderRadius: '8px'
                        }}>
                          <div>
                            <div style={{ color: '#4ecdc4', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                              <Zap size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                              Pozisyon
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              📍 {satellite.position.latitude.toFixed(4)}°, {satellite.position.longitude.toFixed(4)}°
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              🚀 Yükseklik: {satellite.position.altitude.toFixed(0)} km
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#4ecdc4', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                              ⚡ Hız
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              {satellite.position.velocity.toFixed(2)} km/s
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              ({(satellite.position.velocity * 3600).toFixed(0)} km/h)
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '2rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '8px',
                          opacity: 0.7
                        }}>
                          ⏳ Pozisyon bilgisi yükleniyor...
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSatelliteTracker; 