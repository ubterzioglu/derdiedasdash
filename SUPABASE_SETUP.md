# 🚀 SUPABASE KURULUM REHBERİ

**Der Die Das Space - Supabase Database Kurulumu**

Bu rehber, Supabase projesini kurmak ve veritabanını yapılandırmak için adım adım talimatlar içerir.

---

## 📋 İÇİNDEKİLER

1. [Supabase Projesi Oluşturma](#1-supabase-projesi-oluşturma)
2. [SQL Scriptlerini Çalıştırma](#2-sql-scriptlerini-çalıştırma)
3. [Authentication Yapılandırması](#3-authentication-yapılandırması)
4. [Admin API Key Oluşturma](#4-admin-api-key-oluşturma)
5. [Environment Variables Ayarlama](#5-environment-variables-ayarlama)
6. [RLS Policies Kontrolü](#6-rls-policies-kontrolü)
7. [Test ve Doğrulama](#7-test-ve-doğrulama)
8. [Sorun Giderme](#8-sorun-giderme)

---

## 1. SUPABASE PROJESİ OLUŞTURMA

### 1.1 Supabase Hesabı Oluştur

1. [supabase.com](https://supabase.com) adresine git
2. "Start your project" veya "Sign In" butonuna tıkla
3. GitHub, Google veya Email ile giriş yap

### 1.2 Yeni Proje Oluştur

1. Dashboard'da **"New Project"** butonuna tıkla
2. Aşağıdaki bilgileri gir:
   - **Project Name:** `der-die-das-space` (veya istediğin isim)
   - **Database Password:** Güçlü bir şifre seç (SAKLA! ihtiyacın olacak)
   - **Region:** En yakın region'ı seç (Avrupa için `eu-central-1` önerilir)
   - **Pricing Plan:** Free tier yeterli (başlangıç için)

3. **"Create new project"** butonuna tıkla
4. Projenin oluşturulmasını bekle (2-3 dakika sürebilir)

### 1.3 Proje Bilgilerini Kaydet

Proje oluşturulduktan sonra:

1. **Settings** → **API** sayfasına git
2. Aşağıdaki bilgileri not et:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** ⚠️ GÜVENLİK: Bu key'i SAKLAMALISIN!

> **⚠️ ÖNEMLİ:** `service_role` key'i admin işlemleri için kullanılacak. Asla frontend koduna ekleme!

---

## 2. SQL SCRIPTLERINI ÇALIŞTIRMA

SQL scriptlerini **sırayla** çalıştırman gerekiyor. Her script bir öncekine bağımlı.

### 2.1 SQL Editor'a Git

1. Sol menüden **SQL Editor**'a tıkla
2. **"New query"** butonuna tıkla

### 2.2 Script 1: Schema (Tablo Oluşturma)

**Dosya:** `sql/01_schema.sql`

1. Dosyayı aç ve tüm içeriğini kopyala
2. SQL Editor'a yapıştır
3. **"Run"** veya **Ctrl+Enter** ile çalıştır
4. ✅ Başarılı mesajını bekle:
   ```
   Success. No rows returned
   ```

**Kontrol:**
- Sol menüden **Table Editor**'a git
- Aşağıdaki tabloların oluşturulduğunu gör:
  - `users`
  - `game_types`
  - `word_sets`
  - `questions`
  - `user_game_sets`
  - `user_game_set_questions`
  - `user_set_progress`
  - `badges`
  - `user_badges`
  - `user_login_streaks`
  - `admin_keys`

### 2.3 Script 2: Views (Liderlik Tabloları)

**Dosya:** `sql/02_views.sql`

1. Yeni query oluştur
2. Dosya içeriğini kopyala-yapıştır
3. **Run** ile çalıştır

**Kontrol:**
- Sol menüden **Database** → **Views**'a git
- `v_global_leaderboard` ve `v_game_leaderboard` view'larının oluşturulduğunu gör

### 2.4 Script 3: Functions (Fonksiyonlar)

**Dosya:** `sql/03_functions.sql`

1. Yeni query oluştur
2. Dosya içeriğini kopyala-yapıştır
3. **Run** ile çalıştır

**Kontrol:**
- Sol menüden **Database** → **Functions**'a git
- `update_login_streak` ve `check_and_award_badges` fonksiyonlarını gör

### 2.5 Script 4: Seed Data (İlk Veriler)

**Dosya:** `sql/04_seed_data.sql`

1. Yeni query oluştur
2. Dosya içeriğini kopyala-yapıştır
3. **Run** ile çalıştır

**Kontrol:**
- **Table Editor** → `game_types` tablosuna bak
  - 5 oyun tipi olmalı (der_die_dash, case_control, word_salad, translation_quest, five_letter_blitz)
- **Table Editor** → `badges` tablosuna bak
  - 5 badge olmalı (first_game, streak_3_days, streak_7_days, perfect_game, sets_10)
- **Table Editor** → `word_sets` tablosuna bak
  - En az 2 demo set olmalı

---

## 3. AUTHENTICATION YAPILANDIRMASI

### 3.1 Email/Password Authentication

1. Sol menüden **Authentication** → **Providers**'a git
2. **Email** provider'ı bul
3. **Enable Email provider** toggle'ını aç
4. **Confirm email** toggle'ını **KAPALI** yap (geliştirme için)
5. **Save** butonuna tıkla

### 3.2 Google OAuth (Opsiyonel - İstersen)

1. **Authentication** → **Providers** → **Google**'a git
2. Google Cloud Console'dan Client ID ve Secret al:
   - [Google Cloud Console](https://console.cloud.google.com)
   - API & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Authorized redirect URIs: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
3. Client ID ve Secret'ı Supabase'e gir
4. **Enable Google provider** toggle'ını aç
5. **Save** butonuna tıkla

### 3.3 Email Templates (Opsiyonel)

Email confirmation kapatıldığı için şu an gerekli değil, ama ileride:

1. **Authentication** → **Email Templates**'a git
2. İstersen template'leri özelleştirebilirsin

---

## 4. ADMIN API KEY OLUŞTURMA

Admin panel için güvenli bir API key oluşturman gerekiyor.

### 4.1 Admin Key Oluştur

**Yöntem 1: Terminal/Node.js ile (Önerilen)**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıkan 64 karakterlik string'i kopyala (örn: `a1b2c3d4e5f6...`)

**Yöntem 2: Online Generator**

[randomkeygen.com](https://randomkeygen.com) veya benzeri bir siteden 64 karakterlik hex string üret.

### 4.2 Admin Key'i Database'e Ekle

SQL Editor'da şu query'yi çalıştır:

```sql
INSERT INTO admin_keys (api_key, key_name, is_active)
VALUES ('BURAYA_OLUŞTURDUĞUN_KEY', 'Master Admin Key', true);
```

> **⚠️ ÖNEMLİ:** 
> - Oluşturduğun key'i GÜVENLİ bir yerde sakla
> - Admin panel login sayfasında bu key'i kullanacaksın
> - Asla frontend koduna ekleme!

### 4.3 Admin Key'i Test Et

Admin panel login sayfasında (`/admin/index.html`) bu key ile giriş yapmayı dene.

---

## 5. ENVIRONMENT VARIABLES AYARLAMA

### 5.1 Local Development için

**Dosya:** `js/core/supabase.js`

1. Dosyayı aç
2. Aşağıdaki değerleri güncelle:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

**Nereden bulacaksın:**
- Settings → API → Project URL
- Settings → API → anon/public key

### 5.2 Vercel Deployment için

Vercel'e deploy ettiğinde:

1. Vercel Dashboard → Projen → **Settings** → **Environment Variables**
2. Şu değişkenleri ekle:

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

> **Not:** Şu an frontend kodunda environment variable'lar kullanılmıyor, direkt yazılmış. İleride `.env` dosyası ekleyebiliriz.

---

## 6. RLS POLICIES KONTROLÜ

Row Level Security (RLS) policies SQL script'inde otomatik oluşturuldu. Kontrol et:

### 6.1 RLS Durumunu Kontrol Et

1. **Table Editor**'da herhangi bir tabloya git
2. Üstte **"RLS enabled"** yazısını gör

### 6.2 Policies'i İncele

1. Sol menüden **Authentication** → **Policies**'a git
2. Her tablo için policy'leri gör

**Önemli Policies:**
- `users`: Kullanıcılar sadece kendi verilerini okuyabilir/güncelleyebilir
- `user_game_sets`: Herkes okuyabilir (leaderboard için), sadece sahibi ekleyebilir
- `badges`: Herkes okuyabilir
- `admin_keys`: Hiç kimse okuyamaz (sadece backend fonksiyonları kullanabilir)

### 6.3 Policy Test Et (Opsiyonel)

```sql
-- Test query (authenticated user olarak çalıştır)
SELECT * FROM user_game_sets LIMIT 5;
```

---

## 7. TEST VE DOĞRULAMA

### 7.1 Database Tablolarını Kontrol Et

**Table Editor**'da her tabloyu kontrol et:

- ✅ `users` - Boş olabilir (normal)
- ✅ `game_types` - 5 kayıt olmalı
- ✅ `word_sets` - En az 2 kayıt olmalı (demo setler)
- ✅ `questions` - En az 20 kayıt olmalı
- ✅ `badges` - 5 kayıt olmalı
- ✅ `admin_keys` - 1 kayıt olmalı (sen eklediğin)

### 7.2 View'ları Test Et

SQL Editor'da:

```sql
-- Global leaderboard view
SELECT * FROM v_global_leaderboard LIMIT 10;

-- Game leaderboard view
SELECT * FROM v_game_leaderboard LIMIT 10;
```

Boş sonuç dönmesi normal (henüz oyun oynanmadı).

### 7.3 Fonksiyonları Test Et

```sql
-- Test user oluştur (geçici)
-- Sonra login streak fonksiyonunu test et
SELECT * FROM update_login_streak('USER_UUID_BURAYA');
```

### 7.4 Frontend Bağlantısını Test Et

1. `index.html` dosyasını local'de aç (veya Vercel'de)
2. Browser Console'u aç (F12)
3. Hata mesajlarını kontrol et:
   - ✅ Supabase bağlantısı başarılı olmalı
   - ❌ Eğer "Supabase URL not configured" görüyorsan, `js/core/supabase.js`'i güncelle

### 7.5 Demo Oyunu Test Et

1. `games/der-die-dash.html` sayfasını aç
2. Demo set yüklenmeli
3. Oyun oynanabilir olmalı
4. Console'da hata olmamalı

---

## 8. SORUN GİDERME

### Problem: "relation does not exist"

**Sebep:** Tablolar oluşturulmamış.

**Çözüm:**
1. SQL scriptlerini tekrar sırayla çalıştır
2. Her script'in başarılı olduğundan emin ol
3. Hata mesajlarını oku ve düzelt

### Problem: "permission denied"

**Sebep:** RLS policy sorunu.

**Çözüm:**
1. Authentication → Policies'a git
2. İlgili tablo için policy'leri kontrol et
3. Gerekirse yeni policy ekle:

```sql
CREATE POLICY "Yeni Policy"
ON table_name FOR SELECT
USING (true); -- veya istediğin koşul
```

### Problem: "Supabase URL not configured"

**Sebep:** `js/core/supabase.js` dosyasındaki URL ve key'ler güncellenmemiş.

**Çözüm:**
1. `js/core/supabase.js` dosyasını aç
2. `SUPABASE_URL` ve `SUPABASE_ANON_KEY` değerlerini güncelle
3. Sayfayı yenile

### Problem: Admin login çalışmıyor

**Sebep:** Admin key database'de yok veya yanlış.

**Çözüm:**
1. Admin key'in database'de olduğunu kontrol et:
   ```sql
   SELECT * FROM admin_keys WHERE is_active = true;
   ```
2. Admin key'i doğru girdiğinden emin ol
3. Key'in 64 karakter hex string olduğunu kontrol et

### Problem: Demo set yüklenmiyor

**Sebep:** `word_sets` tablosunda demo set yok.

**Çözüm:**
1. Seed data script'ini tekrar çalıştır:
   ```sql
   -- sql/04_seed_data.sql dosyasını tekrar çalıştır
   ```
2. Demo set'in var olduğunu kontrol et:
   ```sql
   SELECT * FROM word_sets WHERE is_demo = true;
   ```

### Problem: Function hatası

**Sebep:** Function syntax hatası veya bağımlılık sorunu.

**Çözüm:**
1. Function'ı tekrar oluştur:
   ```sql
   DROP FUNCTION IF EXISTS function_name;
   -- Sonra function'ı tekrar CREATE et
   ```
2. Hata mesajını oku ve düzelt

---

## ✅ KURULUM TAMAMLANDI

Kurulum başarıyla tamamlandıysa:

1. ✅ Tüm tablolar oluşturuldu
2. ✅ View'lar çalışıyor
3. ✅ Fonksiyonlar çalışıyor
4. ✅ Seed data yüklendi
5. ✅ Admin key oluşturuldu
6. ✅ Frontend bağlantısı çalışıyor

---

## 📝 SONRAKİ ADIMLAR

1. **Content Ekleme:** Admin panelden yeni setler ekle
2. **Test Oyunu:** Bir test kullanıcısı oluştur ve oyun oyna
3. **Badge Testi:** Badge kazanma durumlarını test et
4. **Deployment:** Vercel'e deploy et (environment variables'ı unutma!)

---

## 🔐 GÜVENLİK NOTLARI

⚠️ **ÖNEMLİ:**

1. **Service Role Key:** Asla frontend koduna ekleme!
2. **Admin API Key:** Sadece admin panel login'de kullan
3. **Database Password:** Güvenli yerde sakla
4. **RLS Policies:** Public erişim olan tabloları kontrol et
5. **Environment Variables:** Production'da asla hardcode etme

---

## 📞 YARDIM

Sorun yaşıyorsan:

1. Supabase dokümantasyonu: [supabase.com/docs](https://supabase.com/docs)
2. SQL hatası alıyorsan, hata mesajını Google'da ara
3. Console log'larını kontrol et (F12 → Console)

---

**Son Güncelleme:** 2025-01-21  
**Versiyon:** 1.0
