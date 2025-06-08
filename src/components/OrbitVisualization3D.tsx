import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCcw, Pause, Play, Settings } from 'lucide-react';
import { popularSatellites, getSatellitePosition, Satellite } from '../services/multiSatelliteApi';
import { useSettings } from '../contexts/SettingsContext';

// Gelişmiş Dünya modeli
const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002; // Dünya'nın yavaş dönüşü
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001; // Atmosfer hafif farklı dönüş
    }
  });

  // Kıtalar için detaylı pozisyonlar
  const continents = [
    // Avrupa
    { pos: [0.4, 0.6, 0.68], size: 0.08, color: '#27ae60' },
    // Asya
    { pos: [0.2, 0.5, 0.85], size: 0.12, color: '#2ecc71' },
    // Afrika
    { pos: [0.1, 0.2, 0.98], size: 0.1, color: '#27ae60' },
    // Kuzey Amerika
    { pos: [-0.6, 0.4, 0.65], size: 0.1, color: '#2ecc71' },
    // Güney Amerika
    { pos: [-0.5, -0.3, 0.8], size: 0.08, color: '#27ae60' },
    // Avustralya
    { pos: [0.6, -0.6, 0.5], size: 0.05, color: '#2ecc71' },
    // Antarktika
    { pos: [0, -0.95, 0.3], size: 0.15, color: '#ecf0f1' }
  ];

  return (
    <group>
      {/* Ana Dünya */}
      <Sphere ref={earthRef} args={[1, 128, 128]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#1e40af" 
          shininess={30}
          transparent
          opacity={0.95}
        />
      </Sphere>
      
      {/* Atmosfer katmanı */}
      <Sphere ref={atmosphereRef} args={[1.02, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Kıtalar */}
      {continents.map((continent, index) => (
        <Sphere 
          key={index}
          args={[continent.size, 16, 16]} 
          position={continent.pos as [number, number, number]}
        >
          <meshBasicMaterial color={continent.color} />
        </Sphere>
      ))}
      
      {/* Kutuplar */}
      <Sphere args={[0.08, 16, 16]} position={[0, 0.98, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0, -0.98, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      
      {/* Bulutlar */}
      <Sphere args={[1.01, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  );
};

// Gerçekçi uydu yörüngesi çizgisi
const SatelliteOrbit: React.FC<{ 
  satellite: Satellite; 
  visible: boolean;
  color: string;
}> = ({ satellite, visible, color }) => {
  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    // Uydu türüne göre yörünge parametreleri
    const getOrbitParams = (satId: number, type: string) => {
      switch (satId) {
        case 25544: // ISS
          return { altitude: 408, inclination: 51.6, eccentricity: 0.0001 };
        case 20580: // Hubble
          return { altitude: 550, inclination: 28.5, eccentricity: 0.0002 };
        case 50463: // James Webb (L2 point simulation)
          return { altitude: 1500, inclination: 23.4, eccentricity: 0.8 };
        case 44713: // Starlink
          return { altitude: 550, inclination: 53.0, eccentricity: 0.0001 };
        case 44714: // Starlink
          return { altitude: 550, inclination: 53.2, eccentricity: 0.0001 };
        case 28654: // NOAA-18 (Polar)
          return { altitude: 850, inclination: 98.7, eccentricity: 0.001 };
        case 33591: // NOAA-19 (Polar)
          return { altitude: 870, inclination: 99.1, eccentricity: 0.001 };
        case 25994: // Terra (Sun-synchronous)
          return { altitude: 705, inclination: 98.2, eccentricity: 0.001 };
        case 27424: // Aqua (Sun-synchronous)
          return { altitude: 705, inclination: 98.2, eccentricity: 0.001 };
        default:
          // Uydu türüne göre varsayılan değerler
                     // Uydu ID'sine göre deterministik değerler (Math.random yerine)
           const seed = satId % 1000;
           const pseudoRandom = (Math.sin(seed) * 10000) % 1;
           
           switch (type) {
             case 'weather':
               return { altitude: 800 + (pseudoRandom * 200), inclination: 98 + (pseudoRandom * 2), eccentricity: 0.001 };
             case 'navigation':
               return { altitude: 20200, inclination: 55 + (pseudoRandom * 10), eccentricity: 0.01 };
             case 'communication':
               if (pseudoRandom > 0.5) {
                 // GEO satellites
                 return { altitude: 35786, inclination: pseudoRandom * 5, eccentricity: 0.0001 };
               } else {
                 // LEO constellation
                 return { altitude: 500 + (pseudoRandom * 300), inclination: 45 + (pseudoRandom * 20), eccentricity: 0.001 };
               }
             case 'military':
               return { altitude: 400 + (pseudoRandom * 800), inclination: 63 + (pseudoRandom * 30), eccentricity: 0.01 + (pseudoRandom * 0.2) };
             case 'scientific':
             default:
               return { altitude: 400 + (pseudoRandom * 600), inclination: 28 + (pseudoRandom * 70), eccentricity: 0.001 + (pseudoRandom * 0.01) };
           }
      }
    };
    
    const params = getOrbitParams(satellite.id, satellite.type);
    const earthRadius = 1; // 3D modeldeki Dünya yarıçapı
    const altitude = params.altitude / 6371; // Dünya yarıçapına normalize et
    const semiMajorAxis = earthRadius + altitude;
    const inclinationRad = (params.inclination * Math.PI) / 180;
    
    // Rastgele yörünge rotasyonu (RAAN - Right Ascension of Ascending Node)
    const raan = (satellite.id * 137.5) % 360; // Her uydu için farklı rotasyon
    const raanRad = (raan * Math.PI) / 180;
    
    // Eliptik yörünge noktaları oluştur
    for (let i = 0; i <= 128; i++) {
      const trueAnomaly = (i / 128) * Math.PI * 2;
      
      // Eliptik yörünge formülü
      const r = (semiMajorAxis * (1 - params.eccentricity * params.eccentricity)) / 
                (1 + params.eccentricity * Math.cos(trueAnomaly));
      
      // Yörünge düzlemindeki koordinatlar
      const xOrbit = r * Math.cos(trueAnomaly);
      const yOrbit = r * Math.sin(trueAnomaly);
      const zOrbit = 0;
      
      // 3D rotasyon matrisleri
      // 1. Inclination rotasyonu (x ekseni etrafında)
      const x1 = xOrbit;
      const y1 = yOrbit * Math.cos(inclinationRad) - zOrbit * Math.sin(inclinationRad);
      const z1 = yOrbit * Math.sin(inclinationRad) + zOrbit * Math.cos(inclinationRad);
      
      // 2. RAAN rotasyonu (z ekseni etrafında)
      const x2 = x1 * Math.cos(raanRad) - y1 * Math.sin(raanRad);
      const y2 = x1 * Math.sin(raanRad) + y1 * Math.cos(raanRad);
      const z2 = z1;
      
      points.push(new THREE.Vector3(x2, z2, y2)); // Y ve Z koordinatlarını değiştir (Three.js koordinat sistemi)
    }
    
    return points;
  }, [satellite.id, satellite.type]);

  if (!visible) return null;

  return (
    <Line
      points={orbitPoints}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.7}
    />
  );
};

// Uydu 3D modeli
const SatelliteModel: React.FC<{ 
  satellite: Satellite;
  visible: boolean;
  color: string;
}> = ({ satellite, visible, color }) => {
  const satelliteRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    
    if (satelliteRef.current && satellite.position) {
      // Gerçek pozisyonu 3D koordinatlara dönüştür
      const lat = (satellite.position.latitude * Math.PI) / 180;
      const lon = (satellite.position.longitude * Math.PI) / 180;
      const radius = 1 + (satellite.position.altitude || 400) / 6371;
      
      const x = radius * Math.cos(lat) * Math.cos(lon);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lon);
      
      satelliteRef.current.position.set(x, y, z);
      satelliteRef.current.rotation.y += delta * 2; // Uydu kendi ekseni etrafında dönsün
    }
  });

  if (!visible || !satellite.position) return null;

  return (
    <group ref={satelliteRef}>
      {/* Ana uydu gövdesi */}
      <mesh>
        <boxGeometry args={[0.02, 0.02, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Güneş panelleri */}
      <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.04, 0.015]} />
        <meshStandardMaterial color="#1a1a2e" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.04, 0.015]} />
        <meshStandardMaterial color="#1a1a2e" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Uydu etiketi */}
      <Text
        position={[0, 0.05, 0]}
        fontSize={0.02}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {satellite.name}
      </Text>
      
      {/* Sinyal efekti */}
      <Sphere args={[0.01, 8, 8]} position={[0, 0.025, 0]}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.6 + 0.4 * Math.sin(time * 4)}
        />
      </Sphere>
    </group>
  );
};

const OrbitVisualization3D: React.FC = () => {
  const { settings } = useSettings();
  const [satellites, setSatellites] = useState<Satellite[]>(popularSatellites);
  const [visibleSatellites, setVisibleSatellites] = useState<Set<number>>(
    new Set([25544, 20580, 43013]) // ISS, Hubble, Starlink varsayılan
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const getTypeConfig = (type: string) => {
    return satelliteTypes.find(t => t.key === type) || { label: type, color: '#ffffff' };
  };

  const toggleSatelliteVisibility = (satId: number) => {
    const newVisible = new Set(visibleSatellites);
    if (newVisible.has(satId)) {
      newVisible.delete(satId);
    } else {
      newVisible.add(satId);
    }
    setVisibleSatellites(newVisible);
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
          🌍 3D Yörünge Görselleştirme
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            style={{
              padding: '0.5rem 1rem',
              background: isAnimating ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
            {isAnimating ? 'Duraklat' : 'Başlat'}
          </button>
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            style={{
              padding: '0.5rem 1rem',
              background: showOrbits ? 'linear-gradient(45deg, #4ecdc4, #45b7aa)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RotateCcw size={16} />
            {showOrbits ? 'Yörüngeleri Gizle' : 'Yörüngeleri Göster'}
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr', 
        gap: '2rem',
        height: '70vh'
      }}>
        
        {/* Sol Panel - Uydu Kontrolleri */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>
            <Settings size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Uydu Seçimi
          </h3>
          
          {satellites.map(satellite => {
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
                      {typeConfig.label}
                    </div>
                    {isVisible && satellite.position && (
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: typeConfig.color,
                        marginTop: '0.3rem'
                      }}>
                        Alt: {satellite.position.altitude.toFixed(0)} km
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!satellite.active && <span style={{ fontSize: '0.7rem' }}>⚠️</span>}
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div style={{ 
            marginTop: '2rem', 
            fontSize: '0.8rem', 
            opacity: 0.7,
            textAlign: 'center'
          }}>
            💡 Uydulara tıklayarak 3D görünümde gösterin
          </div>
        </div>

        {/* Sağ Panel - 3D Görselleştirme */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative'
        }}>
          {visibleSatellites.size === 0 ? (
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10,
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2rem',
              borderRadius: '15px',
              fontSize: '1.1rem'
            }}>
              🛰️ Sol panelden uyduları seçerek<br/>
              3D görselleştirmeye başlayın!
            </div>
          ) : null}
          
          <Canvas>
            <PerspectiveCamera makeDefault position={[4, 2, 4]} />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={20}
              minDistance={2}
            />
            
            {/* Işıklandırma */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            {/* Dünya */}
            <Earth />
            
            {/* Uydular ve yörüngeleri */}
            {satellites
              .filter(sat => visibleSatellites.has(sat.id))
              .map(satellite => {
                const typeConfig = getTypeConfig(satellite.type);
                const isVisible = visibleSatellites.has(satellite.id);
                
                return (
                  <React.Fragment key={satellite.id}>
                    {showOrbits && (
                      <SatelliteOrbit 
                        satellite={satellite}
                        visible={isVisible}
                        color={typeConfig.color}
                      />
                    )}
                    <SatelliteModel 
                      satellite={satellite}
                      visible={isVisible}
                      color={typeConfig.color}
                    />
                  </React.Fragment>
                );
              })}
            
            {/* Arka plan yıldızları */}
            <mesh>
              <sphereGeometry args={[50, 32, 32]} />
              <meshBasicMaterial 
                color="#000011" 
                side={THREE.BackSide}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Canvas>
          
          {/* Kontrol ipuçları */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            opacity: 0.7
          }}>
            🖱️ Sürükle: Döndür | 🎯 Scroll: Yakınlaştır | 📱 Sağ tık: Kaydır
          </div>
          
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#4ecdc4'
            }}>
              ⏳ Pozisyonlar güncelleniyor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrbitVisualization3D; 