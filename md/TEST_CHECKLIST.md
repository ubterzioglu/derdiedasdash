# ✅ TEST CHECKLIST

**Der Die Das Space - Test Kontrol Listesi**

Bu liste, test sırasında kontrol edilmesi gereken özellikleri içerir.

---

## 🎮 OYUN TESTLERİ

### Demo Mode (Kayıt Olmadan)

- [ ] **Der Die Dash**
  - [ ] Demo set yükleniyor mu?
  - [ ] Oyun oynanabiliyor mu?
  - [ ] Skor hesaplanıyor mu?
  - [ ] Sonuç ekranı gösteriliyor mu?
  - [ ] "Register to save score" mesajı görünüyor mu?

- [ ] **Case Control**
  - [ ] Demo set yükleniyor mu?
  - [ ] Preposition + form seçimi çalışıyor mu?
  - [ ] Skor hesaplanıyor mu?

- [ ] **Word Salad**
  - [ ] Demo set yükleniyor mu?
  - [ ] Kelime seçimi çalışıyor mu?
  - [ ] 10 kelime kontrolü yapılıyor mu?
  - [ ] Reset butonu çalışıyor mu?

- [ ] **Translation Quest**
  - [ ] Demo set yükleniyor mu?
  - [ ] Şıklar UI diline göre değişiyor mu? (TR/EN)
  - [ ] Skor hesaplanıyor mu?

- [ ] **5-Letter Blitz**
  - [ ] Demo set yükleniyor mu?
  - [ ] Harf seçimi çalışıyor mu?
  - [ ] 5 harf kontrolü yapılıyor mu?

### Authenticated Mode (Kayıt Olarak)

- [ ] **Login/Register**
  - [ ] Email ile kayıt olunabiliyor mu?
  - [ ] Google ile giriş yapılabiliyor mu? (opsiyonel)
  - [ ] Login sonrası user menu görünüyor mu?

- [ ] **Oyun Oynama**
  - [ ] Set seçimi yapılabiliyor mu? (şu an demo set yükleniyor)
  - [ ] Oyun oynanabiliyor mu?
  - [ ] Skor kaydediliyor mu? (Console'da "Score saved successfully" görünmeli)
  - [ ] Database'de `user_game_sets` tablosunda kayıt oluşuyor mu?

- [ ] **Skor Kaydetme**
  - [ ] İlk oyun sonrası skor kaydediliyor mu?
  - [ ] Aynı set tekrar oynanınca skor güncelleniyor mu?
  - [ ] Normalized score doğru hesaplanıyor mu?

---

## 📊 LEADERBOARD TESTLERİ

- [ ] **Global Leaderboard**
  - [ ] Sayfa yükleniyor mu?
  - [ ] Skorlar görünüyor mu?
  - [ ] Sıralama doğru mu? (normalized_score DESC)
  - [ ] Kullanıcı adı görünüyor mu?

- [ ] **Game-Specific Leaderboard**
  - [ ] Oyun filtresi çalışıyor mu?
  - [ ] Level filtresi çalışıyor mu?
  - [ ] Sıralama doğru mu? (set_score DESC)

---

## 🎖️ BADGE TESTLERİ

- [ ] **Badge Kazanma**
  - [ ] İlk oyun sonrası "First Game" badge'i kazanılıyor mu?
  - [ ] Badge'ler profile sayfasında görünüyor mu?
  - [ ] Badge'ler badges sayfasında görünüyor mu?

- [ ] **Streak Badge'leri**
  - [ ] Login streak takip ediliyor mu?
  - [ ] 3 günlük streak sonrası badge kazanılıyor mu?

---

## 🔐 ADMIN PANEL TESTLERİ

- [ ] **Authentication**
  - [ ] Admin login çalışıyor mu?
  - [ ] Yanlış key ile giriş yapılamıyor mu?
  - [ ] Logout çalışıyor mu?

- [ ] **Dashboard**
  - [ ] İstatistikler görünüyor mu?
  - [ ] Top badges listesi görünüyor mu?

- [ ] **Set Management**
  - [ ] Set listesi görünüyor mu?
  - [ ] Filtreler çalışıyor mu?
  - [ ] Yeni set ekleme formu açılıyor mu?
  - [ ] Set oluşturulabiliyor mu? (manuel veya CSV)

- [ ] **Badge Management**
  - [ ] Badge listesi görünüyor mu?
  - [ ] Yeni badge ekleme formu açılıyor mu?
  - [ ] Criteria builder çalışıyor mu?
  - [ ] Badge oluşturulabiliyor mu?

- [ ] **Game Management**
  - [ ] Oyun listesi görünüyor mu?
  - [ ] Oyun düzenlenebiliyor mu?

---

## 🌍 i18n TESTLERİ

- [ ] **Dil Değiştirme**
  - [ ] İlk açılışta dil seçim modal'ı görünüyor mu?
  - [ ] Dil değiştirme butonları çalışıyor mu?
  - [ ] Tüm metinler çevriliyor mu?

- [ ] **Oyun İçi Çeviriler**
  - [ ] Translation Quest'te şıklar UI diline göre değişiyor mu?
  - [ ] Tüm butonlar çevriliyor mu?
  - [ ] Hata mesajları çevriliyor mu?

---

## 🐛 HATA KONTROLLERİ

- [ ] **Console Hataları**
  - [ ] Browser console'da hata var mı? (F12 → Console)
  - [ ] Network hataları var mı? (F12 → Network)

- [ ] **Database Hataları**
  - [ ] Supabase connection başarılı mı?
  - [ ] RLS policy hataları var mı?
  - [ ] Foreign key constraint hataları var mı?

- [ ] **UI Hataları**
  - [ ] Sayfalar düzgün yükleniyor mu?
  - [ ] Butonlar çalışıyor mu?
  - [ ] Modal'lar açılıp kapanıyor mu?

---

## 📝 TEST SONUÇLARI

### Başarılı Testler
- [ ] Liste buraya eklenecek

### Bulunan Hatalar
- [ ] Hata 1: ...
- [ ] Hata 2: ...

### Notlar
- ...

---

**Test Tarihi:**  
**Test Eden:**  
**Supabase Projesi:** zacsokxnytyfisagshlb
