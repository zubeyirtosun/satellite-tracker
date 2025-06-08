import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppSettings {
  updateInterval: number; // saniye cinsinden
  realTimeMode: boolean; // gerçek zamanlı mod
  showAnimations: boolean; // animasyonları göster
  autoRefresh: boolean; // otomatik yenileme
  theme: 'dark' | 'light'; // tema
  language: 'tr' | 'en'; // dil
  debugMode: boolean; // debug modu
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  updateInterval: 15, // 15 saniye
  realTimeMode: false,
  showAnimations: true,
  autoRefresh: true,
  theme: 'dark',
  language: 'tr',
  debugMode: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // LocalStorage'dan ayarları yükle
    const savedSettings = localStorage.getItem('satelliteApp_settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Ayarları LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('satelliteApp_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('satelliteApp_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}; 