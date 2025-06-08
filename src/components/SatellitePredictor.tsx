import React, { useState } from 'react';
import { MapPin, Clock, Eye, Navigation, Search, Globe } from 'lucide-react';
import { generateDemoPasses } from '../services/alternativeApi';
import { continents, getCitiesByContinent, searchCities, City } from '../services/globalCities';

interface SatellitePass {
  satellite: string;
  duration: number;
  maxElevation: number;
  startTime: string;
  endTime: string;
  direction: string;
}

const SatellitePredictor: React.FC = () => {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [city, setCity] = useState('');
  const [passes, setPasses] = useState<SatellitePass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState('Avrupa/Asya');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(getCitiesByContinent('Avrupa/Asya'));

  const handleCitySelect = (selectedCity: City) => {
    setCity(`${selectedCity.name}, ${selectedCity.country}`);
    setLocation({ latitude: selectedCity.lat.toString(), longitude: selectedCity.lon.toString() });
  };

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent);
    setSearchQuery('');
    setFilteredCities(getCitiesByContinent(continent));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredCities(searchCities(query));
    } else {
      setFilteredCities(getCitiesByContinent(selectedContinent));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
          setCity('Mevcut Konumunuz');
          setLoading(false);
        },
        (error) => {
          setError('Konum alınamadı: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Tarayıcınız konum hizmetlerini desteklemiyor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.latitude || !location.longitude) {
      setError('Lütfen geçerli koordinatlar girin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const satellitePasses = generateDemoPasses(
        parseFloat(location.latitude),
        parseFloat(location.longitude)
      );
      setPasses(satellitePasses);
    } catch (err) {
      setError('Uydu geçiş bilgileri alınamadı');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#4ecdc4', marginBottom: '2rem', textAlign: 'center' }}>
        🛰️ Uydu Geçiş Tahmini
      </h2>

      <div className="predictor-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem'
      }}>
        
        {/* Sol Panel - Konum Girişi */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>📍 Konum Seçimi</h3>
          
          {/* Global Şehir Seçimi */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '0.5rem' }}>
              <Globe size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Global Şehir Seçimi:
            </h4>
            
            {/* Kıta Seçimi */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Kıta:</label>
              <select
                value={selectedContinent}
                onChange={(e) => handleContinentChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </select>
            </div>

            {/* Arama */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Şehir Ara:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Şehir veya ülke adı yazın..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 2rem 0.5rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Search size={16} style={{ 
                  position: 'absolute', 
                  right: '0.5rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  opacity: 0.5 
                }} />
              </div>
            </div>

            {/* Şehir Listesi */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '0.5rem',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {filteredCities.map((cityData) => (
                <button
                  key={`${cityData.name}-${cityData.country}`}
                  onClick={() => handleCitySelect(cityData)}
                  style={{
                    padding: '0.5rem',
                    background: city === `${cityData.name}, ${cityData.country}` ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)',
                    color: city === `${cityData.name}, ${cityData.country}` ? '#000' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{cityData.name}</div>
                  <div style={{ opacity: 0.7, fontSize: '0.7rem' }}>{cityData.country}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Manuel Koordinat Girişi */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ff6b6b' }}>
                Enlem (Latitude):
              </label>
              <input
                type="number"
                step="any"
                value={location.latitude}
                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                placeholder="Örn: 41.0082"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ff6b6b' }}>
                Boylam (Longitude):
              </label>
              <input
                type="number"
                step="any"
                value={location.longitude}
                onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                placeholder="Örn: 28.9784"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={getCurrentLocation}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Navigation size={16} />
                Mevcut Konumum
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: loading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #4ecdc4, #45b7aa)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Eye size={16} />
                {loading ? 'Aranıyor...' : 'Geçişleri Bul'}
              </button>
            </div>
          </form>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid rgba(255, 107, 107, 0.5)',
              borderRadius: '8px',
              color: '#ff6b6b',
              marginTop: '1rem'
            }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Sağ Panel - Sonuçlar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>🛰️ Geçiş Tahmini Sonuçları</h3>
          
          {city && (
            <div style={{
              padding: '1rem',
              background: 'rgba(78, 205, 196, 0.1)',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#4ecdc4" />
                <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>Seçili Konum: {city}</span>
              </div>
              {location.latitude && location.longitude && (
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  {parseFloat(location.latitude).toFixed(4)}, {parseFloat(location.longitude).toFixed(4)}
                </div>
              )}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
              🔍 ISS geçişleri aranıyor...
            </div>
          )}

          {passes.length > 0 && !loading && (
            <div>
              <h4 style={{ color: '#4ecdc4', marginBottom: '1rem' }}>
                📅 Yaklaşan ISS Geçişleri ({passes.length} adet)
              </h4>
              
              {passes.map((pass, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛰️</span>
                    <strong style={{ color: '#ff6b6b' }}>{pass.satellite}</strong>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      <strong>Başlangıç:</strong> {pass.startTime}
                    </div>
                    <div>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      <strong>Bitiş:</strong> {pass.endTime}
                    </div>
                    <div>
                      <span>⏱️</span>
                      <strong>Süre:</strong> {Math.floor(pass.duration / 60)}dk {pass.duration % 60}sn
                    </div>
                    <div>
                      <span>📐</span>
                      <strong>Max Yükseklik:</strong> {pass.maxElevation}°
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {passes.length === 0 && !loading && !error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              opacity: 0.7,
              fontSize: '1.1rem'
            }}>
              📍 Bir konum seçin ve ISS geçişlerini keşfedin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SatellitePredictor; 