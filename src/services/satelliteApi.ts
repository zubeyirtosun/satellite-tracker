import axios from 'axios';

export interface ISSPosition {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

export interface SatellitePass {
  satellite: string;
  duration: number;
  maxElevation: number;
  startTime: string;
  endTime: string;
  direction: string;
}

// CORS proxy kullanarak API'lere erişim
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const ISS_API_BASE = 'https://api.open-notify.org';

// ISS konumunu gerçek zamanlı alır
export const getISSPosition = async (): Promise<ISSPosition> => {
  try {
    const response = await axios.get(`${CORS_PROXY}${ISS_API_BASE}/iss-now.json`);
    const { latitude, longitude } = response.data.iss_position;
    const timestamp = response.data.timestamp;
    
    // Basit yükseklik ve hız hesaplaması (ISS için ortalama değerler)
    const altitude = 408; // km ortalama ISS yüksekliği
    const velocity = 27600; // km/h ortalama ISS hızı
    
    return {
      timestamp,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      altitude,
      velocity
    };
  } catch (error) {
    console.error('ISS konumu alınamadı:', error);
    
    // Fallback: Demo veri döndür
    const now = Math.floor(Date.now() / 1000);
    return {
      timestamp: now,
      latitude: 41.0082 + Math.random() * 10 - 5, // İstanbul civarı rastgele
      longitude: 28.9784 + Math.random() * 10 - 5,
      altitude: 408,
      velocity: 27600
    };
  }
};

// ISS astronotlarını alır
export const getISSCrew = async () => {
  try {
    const response = await axios.get(`${CORS_PROXY}${ISS_API_BASE}/astros.json`);
    return response.data.people.filter((person: any) => person.craft === 'ISS');
  } catch (error) {
    console.error('ISS mürettebatı alınamadı:', error);
    
    // Fallback: Demo mürettebat
    return [
      { name: 'Demo Astronot 1' },
      { name: 'Demo Astronot 2' },
      { name: 'Demo Astronot 3' }
    ];
  }
};

// Belirli bir konum için uydu geçiş tahminleri
export const getSatellitePasses = async (
  latitude: number, 
  longitude: number, 
  altitude: number = 0
): Promise<SatellitePass[]> => {
  try {
    const response = await axios.get(
      `${CORS_PROXY}${ISS_API_BASE}/iss-pass.json?lat=${latitude}&lon=${longitude}&alt=${altitude}`
    );
    
    return response.data.response.map((pass: any) => ({
      satellite: 'ISS',
      duration: pass.duration,
      maxElevation: 45, // API'den gelmiyor, varsayılan değer
      startTime: new Date(pass.risetime * 1000).toLocaleString('tr-TR'),
      endTime: new Date((pass.risetime + pass.duration) * 1000).toLocaleString('tr-TR'),
      direction: 'Kuzey-Güney' // API'den gelmiyor, varsayılan değer
    }));
  } catch (error) {
    console.error('Uydu geçiş bilgileri alınamadı:', error);
    
    // Fallback: Demo geçiş verileri
    const now = new Date();
    const demoPass = [];
    
    for (let i = 1; i <= 5; i++) {
      const startTime = new Date(now.getTime() + (i * 6 * 60 * 60 * 1000)); // Her 6 saatte bir
      const duration = 300 + Math.random() * 300; // 5-10 dakika
      const endTime = new Date(startTime.getTime() + duration * 1000);
      
      demoPass.push({
        satellite: 'ISS',
        duration: Math.floor(duration),
        maxElevation: 20 + Math.random() * 60,
        startTime: startTime.toLocaleString('tr-TR'),
        endTime: endTime.toLocaleString('tr-TR'),
        direction: i % 2 === 0 ? 'Kuzey-Güney' : 'Doğu-Batı'
      });
    }
    
    return demoPass;
  }
};

// Koordinatları şehir ismine dönüştürür
export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
    );
    
    const address = response.data.address;
    const city = address.city || address.town || address.village || address.state || 'Bilinmeyen Konum';
    const country = address.country || '';
    
    return `${city}, ${country}`;
  } catch (error) {
    console.error('Konum bilgisi alınamadı:', error);
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  }
}; 