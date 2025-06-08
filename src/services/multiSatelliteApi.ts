export interface Satellite {
  id: number;
  name: string;
  noradId: number;
  type: 'communication' | 'weather' | 'navigation' | 'scientific' | 'military';
  active: boolean;
  position?: {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
  };
  nextPass?: {
    time: string;
    duration: number;
    maxElevation: number;
  };
}

export const popularSatellites: Satellite[] = [
  // Bilimsel Uydular
  {
    id: 1,
    name: 'ISS (International Space Station)',
    noradId: 25544,
    type: 'scientific',
    active: true
  },
  {
    id: 2,
    name: 'Hubble Space Telescope',
    noradId: 20580,
    type: 'scientific',
    active: true
  },
  {
    id: 6,
    name: 'TERRA',
    noradId: 25994,
    type: 'scientific',
    active: true
  },
  {
    id: 7,
    name: 'AQUA',
    noradId: 27424,
    type: 'scientific',
    active: true
  },
  {
    id: 8,
    name: 'ENVISAT',
    noradId: 27386,
    type: 'scientific',
    active: false
  },
  {
    id: 20,
    name: 'CHEOPS',
    noradId: 44874,
    type: 'scientific',
    active: true
  },
  {
    id: 21,
    name: 'WISE',
    noradId: 36411,
    type: 'scientific',
    active: true
  },
  {
    id: 22,
    name: 'GAIA',
    noradId: 39463,
    type: 'scientific',
    active: true
  },
  {
    id: 23,
    name: 'TESS',
    noradId: 43435,
    type: 'scientific',
    active: true
  },
  {
    id: 24,
    name: 'SOLAR ORBITER',
    noradId: 45132,
    type: 'scientific',
    active: true
  },
  {
    id: 25,
    name: 'James Webb Space Telescope',
    noradId: 50463,
    type: 'scientific',
    active: true
  },

  // İletişim Uydular
  {
    id: 3,
    name: 'Starlink-1007',
    noradId: 44713,
    type: 'communication',
    active: true
  },
  {
    id: 9,
    name: 'Starlink-1130',
    noradId: 44714,
    type: 'communication',
    active: true
  },
  {
    id: 10,
    name: 'Starlink-1131',
    noradId: 44715,
    type: 'communication',
    active: true
  },
  {
    id: 11,
    name: 'Starlink-2182',
    noradId: 48274,
    type: 'communication',
    active: true
  },
  {
    id: 12,
    name: 'TURKSAT 4A',
    noradId: 39522,
    type: 'communication',
    active: true
  },
  {
    id: 13,
    name: 'TURKSAT 4B',
    noradId: 40874,
    type: 'communication',
    active: true
  },
  {
    id: 14,
    name: 'TURKSAT 5A',
    noradId: 47319,
    type: 'communication',
    active: true
  },
  {
    id: 15,
    name: 'INTELSAT 19',
    noradId: 36516,
    type: 'communication',
    active: true
  },
  {
    id: 26,
    name: 'EUTELSAT 70B',
    noradId: 28884,
    type: 'communication',
    active: true
  },
  {
    id: 27,
    name: 'ASTRA 2F',
    noradId: 39461,
    type: 'communication',
    active: true
  },

  // Hava Durumu Uyduları
  {
    id: 4,
    name: 'NOAA-18',
    noradId: 28654,
    type: 'weather',
    active: true
  },
  {
    id: 16,
    name: 'NOAA-19',
    noradId: 33591,
    type: 'weather',
    active: true
  },
  {
    id: 17,
    name: 'NOAA-20',
    noradId: 43013,
    type: 'weather',
    active: true
  },
  {
    id: 18,
    name: 'Meteosat 9',
    noradId: 29499,
    type: 'weather',
    active: true
  },
  {
    id: 19,
    name: 'Meteosat 10',
    noradId: 38552,
    type: 'weather',
    active: true
  },
  {
    id: 28,
    name: 'Meteosat 11',
    noradId: 41604,
    type: 'weather',
    active: true
  },
  {
    id: 29,
    name: 'Himawari 8',
    noradId: 40732,
    type: 'weather',
    active: true
  },
  {
    id: 30,
    name: 'GOES-16',
    noradId: 41866,
    type: 'weather',
    active: true
  },

  // Navigasyon Uyduları (GPS, GLONASS, Galileo)
  {
    id: 5,
    name: 'GPS BIIR-2',
    noradId: 26360,
    type: 'navigation',
    active: true
  },
  {
    id: 31,
    name: 'GPS BIIF-5',
    noradId: 40534,
    type: 'navigation',
    active: true
  },
  {
    id: 32,
    name: 'GPS BIIF-12',
    noradId: 43873,
    type: 'navigation',
    active: true
  },
  {
    id: 33,
    name: 'GLONASS-M 54',
    noradId: 36585,
    type: 'navigation',
    active: true
  },
  {
    id: 34,
    name: 'GLONASS-M 55',
    noradId: 40315,
    type: 'navigation',
    active: true
  },
  {
    id: 35,
    name: 'GALILEO 5',
    noradId: 37829,
    type: 'navigation',
    active: true
  },
  {
    id: 36,
    name: 'GALILEO 6',
    noradId: 37846,
    type: 'navigation',
    active: true
  },
  {
    id: 37,
    name: 'GALILEO 11',
    noradId: 40128,
    type: 'navigation',
    active: true
  },
  {
    id: 38,
    name: 'BEIDOU-3 M1',
    noradId: 43001,
    type: 'navigation',
    active: true
  },

  // Askeri Uydular
  {
    id: 39,
    name: 'USA 245 (KH-11)',
    noradId: 37348,
    type: 'military',
    active: true
  },
  {
    id: 40,
    name: 'USA 251',
    noradId: 39166,
    type: 'military',
    active: true
  },
  {
    id: 41,
    name: 'USA 276',
    noradId: 43098,
    type: 'military',
    active: true
  },
  {
    id: 42,
    name: 'MILSTAR 5',
    noradId: 25744,
    type: 'military',
    active: true
  },
  {
    id: 43,
    name: 'LACROSSE 5',
    noradId: 32555,
    type: 'military',
    active: true
  },
  {
    id: 44,
    name: 'NROL-82',
    noradId: 49044,
    type: 'military',
    active: true
  }
];

export const getSatellitePosition = async (noradId: number): Promise<Satellite['position'] | null> => {
  try {
    // ISS için özel API
    if (noradId === 25544) {
      const response = await fetch('http://api.open-notify.org/iss-now.json');
      const data = await response.json();
      
      return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        altitude: 408, // ISS ortalama yükseklik
        velocity: 7.66 // km/s
      };
    }
    
    // Diğer uydular için demo data
    return {
      latitude: (Math.random() - 0.5) * 180,
      longitude: (Math.random() - 0.5) * 360,
      altitude: 200 + Math.random() * 800,
      velocity: 5 + Math.random() * 3
    };
  } catch (error) {
    console.error('Uydu pozisyon hatası:', error);
    return null;
  }
};

export const generateSatellitePasses = (satellite: Satellite, userLat: number, userLon: number): Satellite['nextPass'][] => {
  const passes: Satellite['nextPass'][] = [];
  const now = new Date();
  
  // Sonraki 24 saat için 2-6 geçiş oluştur
  const passCount = 2 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < passCount; i++) {
    const passTime = new Date(now.getTime() + (i * 4 + 2) * 60 * 60 * 1000);
    const duration = 180 + Math.random() * 420; // 3-10 dakika
    const maxElevation = 10 + Math.random() * 70; // 10-80 derece
    
    passes.push({
      time: passTime.toLocaleString('tr-TR'),
      duration: Math.floor(duration),
      maxElevation: Math.floor(maxElevation)
    });
  }
  
  return passes;
};

export const getSatellitesByType = (type: Satellite['type']): Satellite[] => {
  return popularSatellites.filter(sat => sat.type === type);
};

export const getActiveSatellites = (): Satellite[] => {
  return popularSatellites.filter(sat => sat.active);
}; 