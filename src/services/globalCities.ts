export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  continent: string;
}

export const globalCities: City[] = [
  // Kuzey Amerika
  { name: 'New York', country: 'ABD', lat: 40.7128, lon: -74.0060, continent: 'Kuzey Amerika' },
  { name: 'Los Angeles', country: 'ABD', lat: 34.0522, lon: -118.2437, continent: 'Kuzey Amerika' },
  { name: 'Chicago', country: 'ABD', lat: 41.8781, lon: -87.6298, continent: 'Kuzey Amerika' },
  { name: 'Toronto', country: 'Kanada', lat: 43.6532, lon: -79.3832, continent: 'Kuzey Amerika' },
  { name: 'Mexico City', country: 'Meksika', lat: 19.4326, lon: -99.1332, continent: 'Kuzey Amerika' },
  
  // Güney Amerika
  { name: 'São Paulo', country: 'Brezilya', lat: -23.5505, lon: -46.6333, continent: 'Güney Amerika' },
  { name: 'Buenos Aires', country: 'Arjantin', lat: -34.6037, lon: -58.3816, continent: 'Güney Amerika' },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lon: -77.0428, continent: 'Güney Amerika' },
  { name: 'Bogotá', country: 'Kolombiya', lat: 4.7110, lon: -74.0721, continent: 'Güney Amerika' },
  
  // Avrupa
  { name: 'London', country: 'İngiltere', lat: 51.5074, lon: -0.1278, continent: 'Avrupa' },
  { name: 'Paris', country: 'Fransa', lat: 48.8566, lon: 2.3522, continent: 'Avrupa' },
  { name: 'Berlin', country: 'Almanya', lat: 52.5200, lon: 13.4050, continent: 'Avrupa' },
  { name: 'Rome', country: 'İtalya', lat: 41.9028, lon: 12.4964, continent: 'Avrupa' },
  { name: 'Madrid', country: 'İspanya', lat: 40.4168, lon: -3.7038, continent: 'Avrupa' },
  { name: 'Amsterdam', country: 'Hollanda', lat: 52.3676, lon: 4.9041, continent: 'Avrupa' },
  { name: 'Stockholm', country: 'İsveç', lat: 59.3293, lon: 18.0686, continent: 'Avrupa' },
  { name: 'Moscow', country: 'Rusya', lat: 55.7558, lon: 37.6176, continent: 'Avrupa' },
  
  // Türkiye
  { name: 'İstanbul', country: 'Türkiye', lat: 41.0082, lon: 28.9784, continent: 'Avrupa/Asya' },
  { name: 'Ankara', country: 'Türkiye', lat: 39.9334, lon: 32.8597, continent: 'Avrupa/Asya' },
  { name: 'İzmir', country: 'Türkiye', lat: 38.4192, lon: 27.1287, continent: 'Avrupa/Asya' },
  { name: 'Bursa', country: 'Türkiye', lat: 40.1826, lon: 29.0665, continent: 'Avrupa/Asya' },
  { name: 'Antalya', country: 'Türkiye', lat: 36.8969, lon: 30.7133, continent: 'Avrupa/Asya' },
  
  // Asya
  { name: 'Tokyo', country: 'Japonya', lat: 35.6762, lon: 139.6503, continent: 'Asya' },
  { name: 'Seoul', country: 'Güney Kore', lat: 37.5665, lon: 126.9780, continent: 'Asya' },
  { name: 'Beijing', country: 'Çin', lat: 39.9042, lon: 116.4074, continent: 'Asya' },
  { name: 'Shanghai', country: 'Çin', lat: 31.2304, lon: 121.4737, continent: 'Asya' },
  { name: 'Mumbai', country: 'Hindistan', lat: 19.0760, lon: 72.8777, continent: 'Asya' },
  { name: 'Delhi', country: 'Hindistan', lat: 28.7041, lon: 77.1025, continent: 'Asya' },
  { name: 'Singapore', country: 'Singapur', lat: 1.3521, lon: 103.8198, continent: 'Asya' },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lon: 114.1694, continent: 'Asya' },
  { name: 'Bangkok', country: 'Tayland', lat: 13.7563, lon: 100.5018, continent: 'Asya' },
  { name: 'Jakarta', country: 'Endonezya', lat: -6.2088, lon: 106.8456, continent: 'Asya' },
  
  // Afrika
  { name: 'Cairo', country: 'Mısır', lat: 30.0444, lon: 31.2357, continent: 'Afrika' },
  { name: 'Lagos', country: 'Nijerya', lat: 6.5244, lon: 3.3792, continent: 'Afrika' },
  { name: 'Johannesburg', country: 'Güney Afrika', lat: -26.2041, lon: 28.0473, continent: 'Afrika' },
  { name: 'Cape Town', country: 'Güney Afrika', lat: -33.9249, lon: 18.4241, continent: 'Afrika' },
  { name: 'Casablanca', country: 'Fas', lat: 33.5731, lon: -7.5898, continent: 'Afrika' },
  
  // Okyanusya
  { name: 'Sydney', country: 'Avustralya', lat: -33.8688, lon: 151.2093, continent: 'Okyanusya' },
  { name: 'Melbourne', country: 'Avustralya', lat: -37.8136, lon: 144.9631, continent: 'Okyanusya' },
  { name: 'Auckland', country: 'Yeni Zelanda', lat: -36.8485, lon: 174.7633, continent: 'Okyanusya' },
  
  // Orta Doğu
  { name: 'Dubai', country: 'BAE', lat: 25.2048, lon: 55.2708, continent: 'Asya' },
  { name: 'Riyadh', country: 'Suudi Arabistan', lat: 24.7136, lon: 46.6753, continent: 'Asya' },
  { name: 'Tel Aviv', country: 'İsrail', lat: 32.0853, lon: 34.7818, continent: 'Asya' },
];

export const continents = [
  'Tümü',
  'Avrupa',
  'Asya', 
  'Kuzey Amerika',
  'Güney Amerika',
  'Afrika',
  'Okyanusya',
  'Avrupa/Asya'
];

export const getCitiesByContinent = (continent: string): City[] => {
  if (continent === 'Tümü') return globalCities;
  return globalCities.filter(city => city.continent === continent);
};

export const searchCities = (query: string): City[] => {
  const lowerQuery = query.toLowerCase();
  return globalCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // İlk 10 sonuç
}; 