# 🤝 Katkıda Bulunma Rehberi

Satellite Tracker projesine katkıda bulunmak istediğiniz için teşekkürler! Bu dokümanda, projeye nasıl katkıda bulunabileceğinizi öğreneceksiniz.

## 📋 İçindekiler

- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [Kod Standartları](#kod-standartları)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Issue Raporlama](#issue-raporlama)
- [Özellik Önerileri](#özellik-önerileri)

## 🛠️ Geliştirme Ortamı Kurulumu

### Gereksinimler
- Node.js 16.0.0+
- npm 8.0.0+
- Git

### Kurulum Adımları

1. **Repo'yu fork edin**
```bash
# GitHub'da fork butonuna tıklayın
```

2. **Yerel makinenize klonlayın**
```bash
git clone https://github.com/yourusername/satellite-tracker.git
cd satellite-tracker
```

3. **Upstream remote ekleyin**
```bash
git remote add upstream https://github.com/zubeyirtosun/satellite-tracker.git
```

4. **Bağımlılıkları yükleyin**
```bash
npm install
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm start
```

## 📝 Kod Standartları

### TypeScript/JavaScript
- **ESLint** kurallarına uyun
- **Prettier** formatını kullanın
- **TypeScript strict mode** aktif
- Fonksiyon ve değişkenler için **açıklayıcı isimler**

### React
- **Functional components** kullanın
- **React Hooks** tercih edin
- **Props interface**'lerini tanımlayın
- **useMemo** ve **useCallback** ile performansı optimize edin

### CSS
- **Responsive design** prensipleri
- **CSS modules** veya **styled-components**
- **Mobile-first** yaklaşımı
- **Accessibility** standartları

### Örnek Kod Stili
```typescript
// ✅ Doğru
interface SatelliteProps {
  id: number;
  name: string;
  position: Position;
  onSelect: (id: number) => void;
}

const SatelliteItem: React.FC<SatelliteProps> = ({ 
  id, 
  name, 
  position, 
  onSelect 
}) => {
  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <div className="satellite-item" onClick={handleClick}>
      <h3>{name}</h3>
      <p>Lat: {position.latitude}</p>
    </div>
  );
};

// ❌ Yanlış
const SatelliteItem = (props) => {
  return (
    <div onClick={() => props.onSelect(props.id)}>
      <h3>{props.name}</h3>
    </div>
  );
};
```

## 📢 Commit Mesajları

### Format
```
type(scope): subject

body

footer
```

### Commit Türleri
- **feat**: Yeni özellik
- **fix**: Bug düzeltmesi
- **docs**: Dokümantasyon değişikliği
- **style**: Kod formatı değişikliği
- **refactor**: Kod refactoring
- **test**: Test ekleme/düzeltme
- **chore**: Build süreçleri, araç yapılandırması

### Örnekler
```bash
# ✅ Doğru
feat(3d): add realistic satellite orbits with inclination
fix(notifications): resolve email service connection issue
docs(readme): update installation instructions

# ❌ Yanlış
added new feature
fixed bug
update
```

## 🔄 Pull Request Süreci

### PR Oluşturmadan Önce
1. **Main branch**'ten güncel çekin
```bash
git checkout main
git pull upstream main
```

2. **Yeni branch oluşturun**
```bash
git checkout -b feature/amazing-feature
```

3. **Değişikliklerinizi yapın ve test edin**
```bash
npm test
npm run lint
npm run build
```

4. **Commit'lerinizi yapın**
```bash
git add .
git commit -m "feat(component): add amazing feature"
```

5. **Branch'i push edin**
```bash
git push origin feature/amazing-feature
```

### PR Template
```markdown
## 📝 Açıklama
Bu PR'da neler değişti kısaca açıklayın.

## 🔧 Değişiklik Türü
- [ ] Bug düzeltmesi
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon güncellemesi

## ✅ Test Listesi
- [ ] Tüm testler geçiyor
- [ ] Yeni testler eklendi
- [ ] Manuel testler yapıldı
- [ ] Cross-browser test yapıldı

## 📸 Ekran Görüntüleri
Varsa ekran görüntüleri ekleyin.

## 📚 İlgili Issue
Closes #123
```

### PR Review Süreci
1. **Otomatik kontroller** geçmeli
2. **En az 1 reviewer** onayı
3. **Conflict yok** olmalı
4. **Test coverage** düşmemeli

## 🐛 Issue Raporlama

### Bug Raporu Template
```markdown
## 🐛 Bug Açıklaması
Bug'ın ne olduğunu kısaca açıklayın.

## 🔄 Reproduce Adımları
1. '...' sayfasına gidin
2. '...' butonuna tıklayın
3. Scroll down yapın
4. Hatayı görün

## 🎯 Beklenen Davranış
Ne olmasını bekliyordunuz açıklayın.

## 📱 Ortam Bilgileri
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

## 📸 Ekran Görüntüleri
Mümkünse ekran görüntüsü ekleyin.
```

## 💡 Özellik Önerileri

### Özellik Önerisi Template
```markdown
## 🚀 Özellik Açıklaması
Hangi sorunu çözen özellik istiyorsunuz?

## 💡 Çözüm Önerisi
Nasıl çözülmesini istiyorsunuz açıklayın.

## 🎯 Alternatifler
Düşündüğünüz alternatif çözümler var mı?

## 📋 Ek Bilgiler
Başka eklemek istediğiniz bilgiler.
```

## 🏷️ Issue Labels

### Öncelik
- `priority: high` - Yüksek öncelik
- `priority: medium` - Orta öncelik  
- `priority: low` - Düşük öncelik

### Tür
- `bug` - Bug raporu
- `enhancement` - Yeni özellik
- `documentation` - Dokümantasyon
- `help wanted` - Yardım aranıyor
- `good first issue` - Yeni başlayanlar için

### Alan
- `3d-visualization` - 3D görselleştirme
- `satellite-tracking` - Uydu takibi
- `notifications` - Bildirimler
- `ui/ux` - Kullanıcı arayüzü
- `performance` - Performans

## 🎉 Katkıda Bulunanlar

Katkıda bulunan herkese teşekkürler! 

### Hall of Fame
<!-- Contributors will be added here -->

## 📞 İletişim

- **Discord**: [Satellite Tracker Discord](#)
- **Email**: contribute@satellite-tracker.com
- **GitHub Discussions**: [Discussions](#)

---

## 📄 Lisans

Bu projeye katkıda bulunarak, katkılarınızın MIT Lisansı altında yayınlanacağını kabul etmiş olursunuz.

---

**Mutlu kodlamalar! 🚀** 