import React, { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, Save, Send, Globe, Search, Settings, AlertCircle } from 'lucide-react';
import { generateDemoPasses } from '../services/alternativeApi';
import { continents, getCitiesByContinent, searchCities, City } from '../services/globalCities';
import { sendTestEmail, getEmailJSSetupInstructions } from '../services/emailService';

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  email: string;
  location: {
    latitude: string;
    longitude: string;
    name: string;
  };
  beforeMinutes: number;
  satellites: string[];
}

interface ScheduledNotification {
  id: string;
  satellite: string;
  passTime: Date;
  location: string;
  notificationTime: Date;
  sent: boolean;
}

const NotificationManager: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    emailEnabled: false,
    email: '',
    location: {
      latitude: '',
      longitude: '',
      name: ''
    },
    beforeMinutes: 15,
    satellites: ['ISS']
  });

  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [selectedContinent, setSelectedContinent] = useState('Avrupa/Asya');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(getCitiesByContinent('Avrupa/Asya'));
  const [emailTestStatus, setEmailTestStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showEmailSetup, setShowEmailSetup] = useState(false);

  useEffect(() => {
    // Notification permission durumunu kontrol et
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // LocalStorage'dan ayarları yükle
    const savedSettings = localStorage.getItem('satelliteNotificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Zamanlanmış bildirimleri yükle
    loadScheduledNotifications();
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        // Test bildirimi gönder
        new Notification('🛰️ Uydu Takip Merkezi', {
          body: 'Bildirimler başarıyla etkinleştirildi!',
          icon: '/favicon.ico',
          tag: 'satellite-app-test'
        });
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSettings(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              name: 'Mevcut Konumunuz'
            }
          }));
        },
        (error) => {
          console.error('Konum alınamadı:', error);
        }
      );
    }
  };

  const selectCity = (city: City) => {
    setSettings(prev => ({
      ...prev,
      location: {
        latitude: city.lat.toString(),
        longitude: city.lon.toString(),
        name: `${city.name}, ${city.country}`
      }
    }));
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

  const testEmailNotification = async () => {
    if (!settings.email) {
      alert('Lütfen önce e-posta adresinizi girin!');
      return;
    }

    setEmailTestStatus('sending');
    console.log('🧪 E-posta testi başlatılıyor...', settings.email);
    
    try {
      const success = await sendTestEmail(settings.email);
      
      if (success) {
        setEmailTestStatus('sent');
        alert(`✅ Test e-postası başarıyla gönderildi!\n\n📧 Alıcı: ${settings.email}\n📱 Spam klasörünü de kontrol edin!`);
        console.log('🎉 Test başarılı!');
      } else {
        setEmailTestStatus('error');
        alert(`❌ E-posta gönderilemedi!\n\n🔍 Hata detayları Browser Console'da görülebilir (F12 tuşu)`);
        console.log('💡 EmailJS kurulumunu kontrol edin:');
        console.log('   - Service ID doğru mu?');
        console.log('   - Template ID doğru mu?');
        console.log('   - Template aktif mi?');
        console.log('   - Gmail servisi bağlı mı?');
      }
    } catch (error) {
      console.error('E-posta test hatası:', error);
      setEmailTestStatus('error');
      alert(`❌ E-posta servis hatası!\n\n🔧 Konsol hatalarını kontrol edin (F12)`);
    }
    
    setTimeout(() => setEmailTestStatus('idle'), 5000);
  };

  const saveSettings = () => {
    localStorage.setItem('satelliteNotificationSettings', JSON.stringify(settings));
    scheduleNotifications();
    alert('Ayarlar kaydedildi! Bildirimler planlandı.');
  };

  const loadScheduledNotifications = () => {
    const savedNotifications = localStorage.getItem('scheduledNotifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        passTime: new Date(n.passTime),
        notificationTime: new Date(n.notificationTime)
      }));
      setNotifications(parsed);
    }
  };

  const scheduleNotifications = async () => {
    if (!settings.location.latitude || !settings.location.longitude) {
      return;
    }

    try {
      // Geçiş verilerini al
      const passes = generateDemoPasses(
        parseFloat(settings.location.latitude),
        parseFloat(settings.location.longitude)
      );

      const scheduledNotifications: ScheduledNotification[] = passes.map((pass, index) => {
        const passTime = new Date(pass.startTime);
        const notificationTime = new Date(passTime.getTime() - settings.beforeMinutes * 60 * 1000);
        
        return {
          id: `notification-${Date.now()}-${index}`,
          satellite: pass.satellite,
          passTime,
          location: settings.location.name,
          notificationTime,
          sent: false
        };
      });

      setNotifications(scheduledNotifications);
      localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));

      // Gelecekteki bildirimler için timer ayarla
      scheduledNotifications.forEach(notification => {
        const timeUntilNotification = notification.notificationTime.getTime() - Date.now();
        
        if (timeUntilNotification > 0 && timeUntilNotification < 24 * 60 * 60 * 1000) { // 24 saat içinde
          setTimeout(() => {
            sendNotification(notification);
          }, timeUntilNotification);
        }
      });

    } catch (error) {
      console.error('Bildirim planlama hatası:', error);
    }
  };

  const sendNotification = (notification: ScheduledNotification) => {
    if (settings.pushEnabled && permissionStatus === 'granted') {
      new Notification(`🛰️ ${notification.satellite} Geçişi`, {
        body: `${notification.location} üzerinden ${settings.beforeMinutes} dakika içinde geçecek!`,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: true
      });
    }

    // Bildirimi gönderildi olarak işaretle
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, sent: true } : n
      )
    );
  };

  const testNotification = () => {
    if (permissionStatus === 'granted') {
      new Notification('🛰️ Test Bildirimi', {
        body: 'Bu bir test bildirimidir. Bildirimler çalışıyor!',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
    } else {
      alert('Bildirim izni verilmemiş. Lütfen önce izin verin.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#4ecdc4', marginBottom: '2rem', textAlign: 'center' }}>
        🔔 Bildirim Sistemi
      </h2>

      <div className="notification-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem'
      }}>
        
        {/* Sol Panel - Ayarlar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>⚙️ Bildirim Ayarları</h3>
          
          {/* Push Notification Ayarları */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>📱 Push Bildirimler</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={requestNotificationPermission}
                disabled={permissionStatus === 'granted'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: permissionStatus === 'granted' ? 'rgba(78, 205, 196, 0.3)' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: permissionStatus === 'granted' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Bell size={16} />
                {permissionStatus === 'granted' ? '✅ İzin Verildi' : 
                 permissionStatus === 'denied' ? '❌ İzin Reddedildi' : 'Bildirim İzni Ver'}
              </button>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                disabled={permissionStatus !== 'granted'}
              />
              <span>Push bildirimleri etkinleştir</span>
            </label>

            {permissionStatus === 'granted' && (
              <button
                onClick={testNotification}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Test Bildirimi Gönder
              </button>
            )}
          </div>

          {/* E-posta Ayarları */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>📧 E-posta Bildirimleri</h4>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, emailEnabled: e.target.checked }))}
              />
              <span>E-posta bildirimleri etkinleştir</span>
            </label>

            {settings.emailEnabled && (
              <div>
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    marginBottom: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
                {settings.email && (
                  <div>
                    <button
                      onClick={testEmailNotification}
                      disabled={emailTestStatus === 'sending'}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: emailTestStatus === 'sent' 
                          ? 'rgba(78, 205, 196, 0.3)' 
                          : emailTestStatus === 'sending' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : emailTestStatus === 'error'
                          ? 'rgba(255, 107, 107, 0.3)'
                          : 'rgba(78, 205, 196, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: emailTestStatus === 'sending' ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {emailTestStatus === 'sending' ? (
                        <>⏳ Gönderiliyor...</>
                      ) : emailTestStatus === 'sent' ? (
                        <>✅ Test Başarılı</>
                      ) : emailTestStatus === 'error' ? (
                        <>❌ Hata Oluştu</>
                      ) : (
                        <>
                          <Send size={14} />
                          Test E-postası Gönder
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setShowEmailSetup(!showEmailSetup)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Settings size={12} />
                      EmailJS Kurulum Rehberi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* EmailJS Kurulum Rehberi */}
          {showEmailSetup && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ color: '#ff6b6b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                EmailJS Kurulum Rehberi
              </h4>
              
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Gerçek e-posta gönderebilmek için EmailJS servisi kurulmalıdır:
                </p>
                
                <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  {getEmailJSSetupInstructions().steps.map((step, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {step}
                    </li>
                  ))}
                </ol>
                
                <div style={{
                  background: 'rgba(78, 205, 196, 0.1)',
                  border: '1px solid rgba(78, 205, 196, 0.3)',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <strong style={{ color: '#4ecdc4' }}>Önemli:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    EmailJS kurulumu tamamlanana kadar test e-postaları çalışmayacaktır. 
                    Kurulum ücretsizdir ve ayda 200 e-posta gönderebilirsiniz.
                  </p>
                </div>
                
                <div style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <strong style={{ color: '#ffc107' }}>Kurulum Dosyası:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                      src/services/emailService.ts
                    </code> dosyasındaki Service ID, Template ID ve Public Key değerlerini EmailJS'den alarak güncelleyin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Konum Ayarları */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>
              <Globe size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              📍 Global Konum Seçimi
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
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '0.5rem',
              marginBottom: '1rem',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {filteredCities.slice(0, 12).map((city) => (
                <button
                  key={`${city.name}-${city.country}`}
                  onClick={() => selectCity(city)}
                  style={{
                    padding: '0.5rem',
                    background: settings.location.name === `${city.name}, ${city.country}` ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)',
                    color: settings.location.name === `${city.name}, ${city.country}` ? '#000' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{city.name}</div>
                  <div style={{ opacity: 0.7, fontSize: '0.6rem' }}>{city.country}</div>
                </button>
              ))}
            </div>

            <button
              onClick={getCurrentLocation}
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
                marginBottom: '1rem'
              }}
            >
              <MapPin size={16} />
              Mevcut Konumumu Kullan
            </button>

            {settings.location.name && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(78, 205, 196, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                fontSize: '0.9rem'
              }}>
                <strong>Seçili Konum:</strong> {settings.location.name}
              </div>
            )}
          </div>

          {/* Bildirim Zamanlaması */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4ecdc4', fontSize: '1rem', marginBottom: '1rem' }}>⏰ Bildirim Zamanı</h4>
            
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Geçişten kaç dakika önce bildirim:
            </label>
            <select
              value={settings.beforeMinutes}
              onChange={(e) => setSettings(prev => ({ ...prev, beforeMinutes: parseInt(e.target.value) }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white'
              }}
            >
              <option value={5}>5 dakika önce</option>
              <option value={10}>10 dakika önce</option>
              <option value={15}>15 dakika önce</option>
              <option value={30}>30 dakika önce</option>
              <option value={60}>1 saat önce</option>
              <option value={120}>2 saat önce</option>
              <option value={240}>4 saat önce</option>
              <option value={480}>8 saat önce</option>
              <option value={720}>12 saat önce</option>
              <option value={1440}>1 gün önce</option>
            </select>
          </div>

          {/* Kaydet Butonu */}
          <button
            onClick={saveSettings}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(45deg, #4ecdc4, #45b7aa)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={20} />
            Ayarları Kaydet ve Bildirimleri Planla
          </button>
        </div>

        {/* Sağ Panel - Planlanan Bildirimler */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}>📅 Planlanan Bildirimler</h3>
          
          {notifications.length > 0 ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {notifications.map((notification, index) => (
                <div key={notification.id} style={{
                  background: notification.sent ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${notification.sent ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🛰️</span>
                    <strong style={{ color: '#ff6b6b' }}>{notification.satellite}</strong>
                    {notification.sent && <span style={{ color: '#4ecdc4', fontSize: '0.8rem' }}>✅ Gönderildi</span>}
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    <div><Clock size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      <strong>Geçiş:</strong> {notification.passTime.toLocaleString('tr-TR')}
                    </div>
                    <div><Bell size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      <strong>Bildirim:</strong> {notification.notificationTime.toLocaleString('tr-TR')}
                    </div>
                    <div><MapPin size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      <strong>Konum:</strong> {notification.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1rem', 
              opacity: 0.7,
              fontSize: '1.1rem'
            }}>
              📝 Henüz planlanmış bildirim yok.<br/>
              Konum seçip ayarları kaydedin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager; 