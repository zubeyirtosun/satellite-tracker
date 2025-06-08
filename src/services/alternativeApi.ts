import axios from 'axios';

export interface ISSPosition {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

// CORS sorunu olmayan alternatif ISS API'si
export const getISSPositionAlternative = async (): Promise<ISSPosition> => {
  try {
    // wheretheiss.at API'si CORS destekler
    const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    
    return {
      timestamp: Math.floor(Date.now() / 1000),
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      altitude: response.data.altitude,
      velocity: response.data.velocity
    };
  } catch (error) {
    console.error('Alternatif ISS API hatası:', error);
    
    // Fallback: Simülasyon verisi
    const now = Math.floor(Date.now() / 1000);
    const timeOffset = (now % 5400) / 5400; // 90 dakikalık yörünge simülasyonu
    const lat = Math.sin(timeOffset * Math.PI * 2) * 51.6; // ISS'in maksimum enlemi
    const lon = (timeOffset * 360 - 180) % 360;
    
    return {
      timestamp: now,
      latitude: lat,
      longitude: lon > 180 ? lon - 360 : lon,
      altitude: 408 + Math.random() * 20 - 10, // 398-418 km arası
      velocity: 27600 + Math.random() * 200 - 100 // Küçük varyasyon
    };
  }
};

// Demo mürettebat verisi
export const getDemoCrew = () => {
  return [
    { name: 'Jasmin Moghbeli (NASA)' },
    { name: 'Andreas Mogensen (ESA)' },
    { name: 'Satoshi Furukawa (JAXA)' },
    { name: 'Konstantin Borisov (Roscosmos)' },
    { name: 'Oleg Kononenko (Roscosmos)' },
    { name: 'Nikolai Chub (Roscosmos)' },
    { name: 'Loral O\'Hara (NASA)' }
  ];
};

// Demo geçiş verileri oluştur
export const generateDemoPasses = (latitude: number, longitude: number) => {
  const passes = [];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
    const passTime = new Date(now.getTime() + (i * 6 + 2) * 60 * 60 * 1000); // Her 6 saatte bir, 2 saat sonra başla
    const duration = 180 + Math.random() * 360; // 3-9 dakika
    const endTime = new Date(passTime.getTime() + duration * 1000);
    
    passes.push({
      satellite: 'ISS (Uluslararası Uzay İstasyonu)',
      duration: Math.floor(duration),
      maxElevation: Math.floor(10 + Math.random() * 70), // 10-80 derece
      startTime: passTime.toLocaleString('tr-TR'),
      endTime: endTime.toLocaleString('tr-TR'),
      direction: i % 3 === 0 ? 'Kuzeydoğu-Güneybatı' : i % 3 === 1 ? 'Güneydoğu-Kuzeybatı' : 'Doğu-Batı'
    });
  }
  
  return passes;
}; 