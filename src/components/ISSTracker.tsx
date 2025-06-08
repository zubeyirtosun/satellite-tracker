import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Clock, MapPin, Users, Zap, Globe } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { getISSPositionAlternative, getDemoCrew } from '../services/alternativeApi';
import { reverseGeocode } from '../services/satelliteApi';

interface ISSPosition {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

// ISS ikonu oluştur
const issIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
      <defs>
        <radialGradient id="issGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD700"/>
          <stop offset="100%" stop-color="#FF6B6B"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#issGradient)" stroke="#fff" stroke-width="3"/>
      <path d="M25 40 L75 40 M35 25 L65 25 M35 75 L65 75 M40 50 L60 50" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="8" fill="#fff"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const ISSTracker: React.FC = () => {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [issPath, setIssPath] = useState<[number, number][]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchISSData = async () => {
    try {
      const position = await getISSPositionAlternative();
      setIssPosition(position);
      
      // Yolculuk güzergahını güncelle (son 50 nokta)
      setIssPath(prev => {
        const newPath: [number, number][] = [...prev, [position.latitude, position.longitude]];
        return newPath.slice(-50); // Son 50 konumu sakla
      });

      // Konum bilgisini al
      const location = await reverseGeocode(position.latitude, position.longitude);
      setCurrentLocation(location);
      
      setError(null);
    } catch (err) {
      setError('ISS verileri alınamadı');
      console.error(err);
    }
  };

  const fetchCrewData = async () => {
    try {
      const crewData = getDemoCrew();
      setCrew(crewData);
    } catch (err) {
      console.error('Mürettebat bilgisi alınamadı:', err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchISSData(), fetchCrewData()]);
      setLoading(false);
    };

    initialize();

    // Her 10 saniyede bir güncelle
    const interval = setInterval(fetchISSData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">🛰️ ISS veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="loading">❌ {error}</div>;
  }

  if (!issPosition) {
    return <div className="loading">📡 ISS konumu bulunamadı</div>;
  }

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('tr-TR');
  };

  const formatSpeed = (velocity: number) => {
    return `${velocity.toLocaleString('tr-TR')} km/s`;
  };

  return (
    <div className="iss-tracker">
      <div className="map-container">
        <MapContainer
          center={[issPosition.latitude, issPosition.longitude]}
          zoom={3}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* ISS konumu */}
          <Marker 
            position={[issPosition.latitude, issPosition.longitude]} 
            icon={issIcon}
          >
            <Popup>
              <div>
                <h4>🛰️ Uluslararası Uzay İstasyonu</h4>
                <p><strong>Konum:</strong> {currentLocation}</p>
                <p><strong>Yükseklik:</strong> {issPosition.altitude} km</p>
                <p><strong>Hız:</strong> {formatSpeed(issPosition.velocity)}</p>
                <p><strong>Koordinat:</strong> {issPosition.latitude.toFixed(4)}, {issPosition.longitude.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>

          {/* ISS geçmiş rotası */}
          {issPath.length > 1 && (
            <Polyline
              positions={issPath}
              color="#ff6b6b"
              weight={3}
              opacity={0.7}
            />
          )}
        </MapContainer>
      </div>

      <div className="iss-info">
        <h3>🛰️ ISS Bilgileri</h3>
        
        <div className="info-item">
          <span className="info-label">
            <MapPin size={16} />
            Mevcut Konum
          </span>
          <span className="info-value">{currentLocation}</span>
        </div>

        <div className="info-item">
          <span className="info-label">
            <Globe size={16} />
            Koordinat
          </span>
          <span className="info-value">
            {issPosition.latitude.toFixed(4)}, {issPosition.longitude.toFixed(4)}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">
            <Zap size={16} />
            Yükseklik
          </span>
          <span className="info-value">{issPosition.altitude} km</span>
        </div>

        <div className="info-item">
          <span className="info-label">
            <Zap size={16} />
            Hız
          </span>
          <span className="info-value">{formatSpeed(issPosition.velocity)}</span>
        </div>

        <div className="info-item">
          <span className="info-label">
            <Clock size={16} />
            Son Güncelleme
          </span>
          <span className="info-value">{formatDateTime(issPosition.timestamp)}</span>
        </div>

        {crew.length > 0 && (
          <>
            <div className="info-item">
              <span className="info-label">
                <Users size={16} />
                Mürettebat
              </span>
              <span className="info-value">{crew.length} kişi</span>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '0.5rem' }}>👨‍🚀 Astronotlar:</h4>
              {crew.map((astronaut, index) => (
                <div key={index} style={{ 
                  padding: '0.5rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  {astronaut.name}
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          background: 'rgba(78, 205, 196, 0.1)', 
          borderRadius: '10px',
          border: '1px solid rgba(78, 205, 196, 0.3)'
        }}>
          <h4 style={{ color: '#4ecdc4', margin: '0 0 0.5rem 0' }}>💡 Bilgi</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
            ISS, Dünya'yı yaklaşık 90 dakikada bir turlayarak günde 16 defa gündoğumu ve günbatımı görür. 
            10 saniyede bir konum güncellenir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker; 