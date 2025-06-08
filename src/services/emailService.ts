import emailjs from '@emailjs/browser';

// EmailJS yapılandırması - Bu değerleri kendi EmailJS hesabınızdan alın
const EMAILJS_SERVICE_ID = 'your_service_id'; // EmailJS Service ID'nizi buraya yazın
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // EmailJS Template ID'nizi buraya yazın  
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // EmailJS Public Key'inizi buraya yazın

// EmailJS'i başlat
export const initEmailJS = () => {
  try {
    console.log('🚀 EmailJS başlatılıyor...');
    console.log('🔍 Konfigürasyon kontrolleri:');
    console.log('   📧 Service ID:', EMAILJS_SERVICE_ID);
    console.log('   📋 Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('   🔑 Public Key:', EMAILJS_PUBLIC_KEY ? `${EMAILJS_PUBLIC_KEY.substring(0, 10)}...` : 'EKSİK!');
    
    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes('YOUR_PUBLIC_KEY')) {
      console.error('❌ HATA: Public Key güncellenmemiş!');
      return;
    }
    
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS başarıyla başlatıldı');
  } catch (error) {
    console.error('❌ EmailJS başlatma hatası:', error);
  }
};

// Test e-postası gönder
export const sendTestEmail = async (toEmail: string): Promise<boolean> => {
  try {
    console.log('📤 E-posta gönderimi başlatılıyor...', toEmail);
    
    const templateParams = {
      to_email: toEmail,
      from_name: 'Uydu Takip Merkezi',
      subject: 'Uydu Takip Test E-postası',
      message: `
🛰️ Uydu Takip Merkezi Test E-postası

Merhaba!

Bu e-posta, uydu takip sisteminizin bildirim özelliğinin test edilmesi için gönderilmiştir.

✅ E-posta bildirimleri aktif
📍 Konum ayarlarınız kaydedildi  
🔔 ISS ve diğer uydu geçişleri için bildirim alacaksınız

Test başarılı! Artık uydu geçişlerinden önce e-posta bildirimleri alabilirsiniz.

---
🌍 Uydu Takip Merkezi
Uzayı takip et, gökyüzünü keşfet!
      `,
      timestamp: new Date().toLocaleString('tr-TR')
    };

    console.log('📋 Template parametreleri:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ E-posta başarıyla gönderildi!', response);
    return true;
  } catch (error) {
    console.error('❌ E-posta gönderim hatası:', error);
    console.error('🔍 Hata detayları:', {
      service: EMAILJS_SERVICE_ID,
      template: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? 'Mevcut' : 'Eksik'
    });
    return false;
  }
};

// Uydu geçiş bildirimi e-postası gönder
export const sendSatelliteNotification = async (
  toEmail: string, 
  satelliteName: string, 
  passTime: string, 
  maxElevation: number,
  location: string
): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: toEmail,
      from_name: 'Uydu Takip Merkezi',
      subject: `🛰️ ${satelliteName} Geçiş Bildirimi`,
      satellite_name: satelliteName,
      pass_time: passTime,
      max_elevation: maxElevation,
      location: location,
      message: `
🛰️ Uydu Geçiş Bildirimi

${satelliteName} uydusu yakında ${location} üzerinden geçecek!

📅 Geçiş Zamanı: ${passTime}
📐 Maksimum Yükseklik: ${maxElevation}°
📍 Konum: ${location}

Gökyüzüne bakmaya hazır olun! 🌟

---
🌍 Uydu Takip Merkezi
      `,
      timestamp: new Date().toLocaleString('tr-TR')
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Uydu bildirimi gönderildi:', response);
    return true;
  } catch (error) {
    console.error('Uydu bildirimi gönderim hatası:', error);
    return false;
  }
};

// EmailJS kurulum talimatları
export const getEmailJSSetupInstructions = () => {
  return {
    steps: [
      "1. https://www.emailjs.com/ adresine gidin",
      "2. Ücretsiz hesap oluşturun",
      "3. Email Service ekleyin (Gmail, Outlook, vs.)",
      "4. Email Template oluşturun",
      "5. Service ID, Template ID ve Public Key'i alın",
      "6. Bu değerleri emailService.ts dosyasına ekleyin"
    ],
    templateExample: `
Şablon içeriği örneği:
{{from_name}} tarafından gönderilen mesaj:

Konu: {{subject}}
Alıcı: {{to_email}}

{{message}}

Zaman: {{timestamp}}
    `
  };
};