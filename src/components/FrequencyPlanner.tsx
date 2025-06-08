import React, { useState, useEffect, useMemo } from 'react';
import { Radio, Clock, Satellite, Signal, Volume2, Info, Download, Star } from 'lucide-react';

interface SatelliteFrequency {
  satellite: string;
  noradId: number;
  frequencies: {
    uplink: string;
    downlink: string;
    mode: string;
    description: string;
  }[];
  band: string;
  active: boolean;
}

interface FrequencyPlan {
  satellite: string;
  frequency: string;
  mode: string;
  passTime: string;
  duration: number;
  maxElevation: number;
  active: boolean;
}

const FrequencyPlanner: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [frequencies, setFrequencies] = useState<SatelliteFrequency[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<FrequencyPlan[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [favoriteFrequencies, setFavoriteFrequencies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'time' | 'elevation' | 'satellite'>('time');

  // Amatör radyo uydu frekansları (gerçek veriler)
  const satelliteFrequencies: SatelliteFrequency[] = useMemo(() => [
    {
      satellite: 'ISS (ARISS)',
      noradId: 25544,
      frequencies: [
        { uplink: '145.200 MHz', downlink: '145.800 MHz', mode: 'FM', description: 'Voice repeater (çoğunlukla kapalı)' },
        { uplink: '145.990 MHz', downlink: '145.800 MHz', mode: 'FM', description: 'Voice simplex' },
        { uplink: '437.550 MHz', downlink: '145.800 MHz', mode: 'APRS', description: 'APRS digipeater' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'AO-91 (Fox-1B)',
      noradId: 43017,
      frequencies: [
        { uplink: '435.250 MHz', downlink: '145.960 MHz', mode: 'FM', description: 'Linear transponder' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'AO-92 (Fox-1D)',
      noradId: 43137,
      frequencies: [
        { uplink: '435.350 MHz', downlink: '145.880 MHz', mode: 'FM', description: 'Linear transponder' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'SO-50',
      noradId: 27607,
      frequencies: [
        { uplink: '145.850 MHz', downlink: '436.795 MHz', mode: 'FM', description: '67 Hz CTCSS tone required' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'AO-27',
      noradId: 22825,
      frequencies: [
        { uplink: '145.850 MHz', downlink: '436.795 MHz', mode: 'FM', description: 'Intermittent operation' }
      ],
      band: 'VHF/UHF',
      active: false
    },
    {
      satellite: 'FO-29',
      noradId: 24278,
      frequencies: [
        { uplink: '145.900-146.000 MHz', downlink: '435.800-435.900 MHz', mode: 'CW/SSB', description: 'Linear transponder' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'AO-73 (FUNcube)',
      noradId: 39444,
      frequencies: [
        { uplink: '435.140-435.160 MHz', downlink: '145.935-145.955 MHz', mode: 'CW/SSB', description: 'Linear transponder' },
        { uplink: '1267.300 MHz', downlink: '145.950 MHz', mode: 'Digital', description: 'Telemetry downlink' }
      ],
      band: 'VHF/UHF',
      active: true
    },
    {
      satellite: 'AO-7',
      noradId: 7530,
      frequencies: [
        { uplink: '145.850-145.950 MHz', downlink: '29.400-29.500 MHz', mode: 'CW/SSB', description: 'Mode B transponder' },
        { uplink: '432.120-432.220 MHz', downlink: '145.975-145.875 MHz', mode: 'CW/SSB', description: 'Mode J transponder' }
      ],
      band: 'HF/VHF/UHF',
      active: false
    }
  ], []);

  const frequencyBands = ['all', 'HF', 'VHF/UHF', 'Microwave'];
  const modes = ['all', 'FM', 'CW/SSB', 'Digital', 'APRS'];

  useEffect(() => {
    let filtered = satelliteFrequencies;
    
    if (selectedBand !== 'all') {
      filtered = filtered.filter(sat => sat.band.includes(selectedBand));
    }
    
    if (selectedMode !== 'all') {
      filtered = filtered.filter(sat => 
        sat.frequencies.some(freq => freq.mode.includes(selectedMode))
      );
    }
    
    if (showOnlyActive) {
      filtered = filtered.filter(sat => sat.active);
    }
    
    setFrequencies(filtered);
  }, [selectedBand, selectedMode, showOnlyActive, satelliteFrequencies]);

  const generateFrequencyPlan = () => {
    const plans: FrequencyPlan[] = [];
    const now = new Date();
    
    frequencies.forEach((satellite, index) => {
      satellite.frequencies.forEach((freq, freqIndex) => {
        // Her uydu için rastgele geçiş zamanları oluştur
        const passTime = new Date(now.getTime() + (index * 2 + freqIndex + 1) * 3 * 60 * 60 * 1000);
        const duration = 300 + Math.random() * 600; // 5-15 dakita
        const elevation = 10 + Math.random() * 70;
        
        plans.push({
          satellite: satellite.satellite,
          frequency: freq.downlink,
          mode: freq.mode,
          passTime: passTime.toLocaleString('tr-TR'),
          duration: Math.floor(duration),
          maxElevation: Math.floor(elevation),
          active: satellite.active
        });
      });
    });
    
    // Sıralama uygula
    plans.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(a.passTime).getTime() - new Date(b.passTime).getTime();
        case 'elevation':
          return b.maxElevation - a.maxElevation;
        case 'satellite':
          return a.satellite.localeCompare(b.satellite);
        default:
          return 0;
      }
    });
    
    setPlannedSessions(plans);
  };

  const toggleFavorite = (frequency: string) => {
    setFavoriteFrequencies(prev => 
      prev.includes(frequency) 
        ? prev.filter(f => f !== frequency)
        : [...prev, frequency]
    );
  };

  const exportToCalendar = () => {
    const icsContent = generateICSFile(plannedSessions);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'uydu-frekans-plani.ics';
    link.click();
  };

  const generateICSFile = (sessions: FrequencyPlan[]) => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Uydu Takip Merkezi//EN\n';
    
    sessions.forEach((session, index) => {
      const startDate = new Date(session.passTime);
      const endDate = new Date(startDate.getTime() + session.duration * 1000);
      
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:satellite-${index}@uydu-takip.com\n`;
      icsContent += `DTSTART:${formatDateForICS(startDate)}\n`;
      icsContent += `DTEND:${formatDateForICS(endDate)}\n`;
      icsContent += `SUMMARY:${session.satellite} - ${session.mode}\n`;
      icsContent += `DESCRIPTION:Frekans: ${session.frequency}\\nMod: ${session.mode}\\nMax Yükseklik: ${session.maxElevation}°\n`;
      icsContent += `END:VEVENT\n`;
    });
    
    icsContent += 'END:VCALENDAR';
    return icsContent;
  };

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'FM': return '#ff6b6b';
      case 'CW/SSB': return '#4ecdc4';
      case 'Digital': return '#45b7aa';
      case 'APRS': return '#96ceb4';
      default: return '#ffffff';
    }
  };

  const getBandColor = (band: string) => {
    switch (band) {
      case 'HF': return '#ff9f43';
      case 'VHF/UHF': return '#54a0ff';
      case 'HF/VHF/UHF': return '#5f27cd';
      case 'Microwave': return '#00d2d3';
      default: return '#ffffff';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#4ecdc4', marginBottom: '2rem', textAlign: 'center' }}>
        📻 Uydu Frekans Planlayıcısı
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem'
      }}>
        
        {/* Sol Panel - Filtreler ve Frekans Listesi */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>🎛️ Uydu Frekansları</h3>
          
          {/* Filtreler */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4ecdc4' }}>
                Frekans Bandı:
              </label>
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white'
                }}
              >
                {frequencyBands.map(band => (
                  <option key={band} value={band}>
                    {band === 'all' ? 'Tüm Bandlar' : band}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4ecdc4' }}>
                Modülasyon:
              </label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white'
                }}
              >
                {modes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode === 'all' ? 'Tüm Modlar' : mode}
                  </option>
                ))}
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={showOnlyActive}
                onChange={(e) => setShowOnlyActive(e.target.checked)}
              />
              <span>Sadece aktif uydular</span>
            </label>

            <button
              onClick={generateFrequencyPlan}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              <Clock size={16} />
              Dinleme Planı Oluştur
            </button>
          </div>

          {/* Frekans Listesi */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {frequencies.map((satellite, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Satellite size={16} />
                  <strong style={{ color: '#ff6b6b' }}>{satellite.satellite}</strong>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    background: getBandColor(satellite.band),
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    color: '#000'
                  }}>
                    {satellite.band}
                  </span>
                  {!satellite.active && (
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>⚠️ Pasif</span>
                  )}
                </div>
                
                {satellite.frequencies.map((freq, freqIndex) => (
                  <div key={freqIndex} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    borderLeft: `3px solid ${getModeColor(freq.mode)}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Signal size={14} />
                        <strong style={{ color: getModeColor(freq.mode) }}>{freq.mode}</strong>
                      </div>
                      <button
                        onClick={() => toggleFavorite(freq.downlink)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          borderRadius: '4px',
                          color: favoriteFrequencies.includes(freq.downlink) ? '#ffeb3b' : 'rgba(255, 255, 255, 0.3)'
                        }}
                        title={favoriteFrequencies.includes(freq.downlink) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      >
                        <Star size={14} fill={favoriteFrequencies.includes(freq.downlink) ? '#ffeb3b' : 'none'} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <strong>⬆️ Uplink:</strong> {freq.uplink}
                    </div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      <strong>⬇️ Downlink:</strong> {freq.downlink}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      <Info size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                      {freq.description}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Panel - Dinleme Planı */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#ff6b6b', margin: 0 }}>📅 Dinleme Planı</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {plannedSessions.length > 0 && (
                <>
                  <button
                    onClick={exportToCalendar}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(78, 205, 196, 0.3)',
                      border: '1px solid rgba(78, 205, 196, 0.5)',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Download size={14} />
                    Takvim
                  </button>
                  <button
                    onClick={generateFrequencyPlan}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'rgba(255, 107, 107, 0.3)',
                      border: '1px solid rgba(255, 107, 107, 0.5)',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Clock size={14} />
                    Yenile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sıralama Seçenekleri */}
          {plannedSessions.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4ecdc4', fontSize: '0.9rem' }}>
                Sıralama:
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'time' | 'elevation' | 'satellite');
                  generateFrequencyPlan();
                }}
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
                <option value="time">⏰ Zamana Göre</option>
                <option value="elevation">📐 Yüksekliğe Göre</option>
                <option value="satellite">🛰️ Uyduya Göre</option>
              </select>
            </div>
          )}
          
          {plannedSessions.length > 0 ? (
            <div>
              <div style={{
                padding: '1rem',
                background: 'rgba(78, 205, 196, 0.1)',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid rgba(78, 205, 196, 0.3)'
              }}>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 0.5rem 0' }}>📻 Amatör Radyo Rehberi</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                  <strong>FM:</strong> Handheld telsizler için ideal<br/>
                  <strong>CW/SSB:</strong> HF/VHF transceiver gerekli<br/>
                  <strong>APRS:</strong> APRS cihazı veya yazılım<br/>
                  <strong>Digital:</strong> Özel dekodlama yazılımı
                </p>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {plannedSessions.map((session, index) => (
                  <div key={index} style={{
                    background: session.active ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${session.active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    opacity: session.active ? 1 : 0.6
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Volume2 size={16} color={getModeColor(session.mode)} />
                      <strong style={{ color: '#ff6b6b' }}>{session.satellite}</strong>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        background: getModeColor(session.mode),
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: '#000'
                      }}>
                        {session.mode}
                      </span>
                      {!session.active && <span style={{ fontSize: '0.7rem' }}>⚠️</span>}
                    </div>
                    
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      <div><Clock size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        <strong>Geçiş:</strong> {session.passTime}
                      </div>
                      <div><Radio size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        <strong>Frekans:</strong> {session.frequency}
                      </div>
                      <div><Signal size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        <strong>Süre:</strong> {Math.floor(session.duration / 60)}dk {session.duration % 60}sn
                      </div>
                      <div><span>📐</span>
                        <strong>Max Yükseklik:</strong> {session.maxElevation}°
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              opacity: 0.7,
              fontSize: '1.1rem'
            }}>
              📻 Filtrelerinizi seçin ve<br/>
              "Dinleme Planı Oluştur" butonuna tıklayın!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrequencyPlanner; 