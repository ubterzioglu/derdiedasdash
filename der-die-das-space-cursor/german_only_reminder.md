# 🇩🇪 KELİMELER ALMANCA - ÖNEMLİ HATIRLATMA

## 📌 Ana Kural

**Tüm kelimeler sadece ve sadece Almanca gösterilir!**

```
✅ DOĞRU:  der Tisch
❌ YANLIŞ: der Tisch (masa)
❌ YANLIŞ: der Tisch / the table
```

---

## 🎯 Proje Amacı

**Kullanıcıların Almanca kelimelerin artikellerini öğrenmesi ve pekiştirmesi!**

- Oyunun hedefi: Verilen Almanca kelimeye doğru artikeli tahmin etmek
- Kullanıcı yarışması: Kim daha çok doğru artikel biliyor?
- Öğrenme yöntemi: Oyun yoluyla tekrar ve pekiştirme

---

## 🌍 Çok Dillilik Sadece UI İçin

### ÇEVRİLECEK (UI Elemanları):

| Türkçe | İngilizce | Almanca |
|--------|-----------|---------|
| Başla | Start | Starten |
| Giriş Yap | Login | Anmelden |
| Çıkış | Exit | Beenden |
| Skor Tablosu | Leaderboard | Bestenliste |
| Doğru Cevaplar | Correct Answers | Richtige Antworten |
| Nasıl Oynanır? | How to Play? | Wie spielt man? |
| Kolay | Easy | Einfach |
| Zor | Hard | Schwer |

### ÇEVRİLMEYECEK (Oyun İçeriği):

```
❌ Kelimelerin kendisi
❌ Artikeller (der, die, das)
❌ Kelime anlamları
```

---

## 📊 Veritabanı Yapısı

### Questions Tablosu

```sql
CREATE TABLE questions (
  id INT PRIMARY KEY,
  set_id INT,
  word_german TEXT,          -- ✅ Sadece Almanca kelime
  correct_article TEXT,       -- der, die, veya das
  order_in_set INT
);
```

**Çıkarılan sütunlar:**
- ❌ `word_translation_tr` 
- ❌ `word_translation_en`

---

## 🎮 Oyun Akışı Örneği

### Senaryo: Türkçe UI ile oyun

```
┌────────────────────────────┐
│   Der Die Das Space        │
│                            │
│   [Başla]  [Giriş Yap]    │  ← Türkçe UI
└────────────────────────────┘

                ↓ Oyun başladı

┌────────────────────────────┐
│   Soru 1/10                │  ← Türkçe UI
│                            │
│      ┌──────────┐          │
│      │  Tisch   │          │  ← Almanca kelime!
│      └──────────┘          │
│                            │
│  [der]  [die]  [das]       │  ← Artikeller
│                            │
│  ⏱ 5 saniye                │  ← Türkçe UI
└────────────────────────────┘
```

### Senaryo: İngilizce UI ile oyun

```
┌────────────────────────────┐
│   Der Die Das Space        │
│                            │
│   [Start]  [Login]         │  ← İngilizce UI
└────────────────────────────┘

                ↓ Game started

┌────────────────────────────┐
│   Question 1/10            │  ← İngilizce UI
│                            │
│      ┌──────────┐          │
│      │  Tisch   │          │  ← Almanca kelime!
│      └──────────┘          │
│                            │
│  [der]  [die]  [das]       │  ← Artikeller
│                            │
│  ⏱ 5 seconds               │  ← İngilizce UI
└────────────────────────────┘
```

**Sonuç:** Kelime her zaman "Tisch" - Sadece UI metinleri değişiyor!

---

## 📝 Kelime Hazırlama Formatı

### Excel/CSV Şablonu

```csv
set_number,difficulty_level,word_german,correct_article,order_in_set
1,1,Tisch,der,1
1,1,Tür,die,2
1,1,Auto,das,3
1,1,Buch,das,4
1,1,Stuhl,der,5
1,1,Lampe,die,6
1,1,Fenster,das,7
1,1,Baum,der,8
1,1,Blume,die,9
1,1,Kind,das,10
```

**Gerekli sütunlar:**
- ✅ set_number (1-25)
- ✅ difficulty_level (1-5)
- ✅ word_german (Almanca kelime)
- ✅ correct_article (der, die, das)
- ✅ order_in_set (1-10)

**Gereksiz sütunlar:**
- ❌ word_translation_tr
- ❌ word_translation_en
- ❌ meaning
- ❌ translation

---

## 🎨 Oyun İçinde Gösterim

### Doğru Cevap Animasyonu

```
    ┌──────────────┐
    │   Fenster    │  ← Almanca kelime
    └──────────────┘
    
    [der] [die] [DAS]✅  ← Kullanıcı "das" seçti
    
    🎉 Confetti animasyonu
    ✅ "Richtig!" / "Doğru!" / "Correct!"  ← UI diline göre
```

### Yanlış Cevap Animasyonu

```
    ┌──────────────┐
    │   Fenster    │  ← Almanca kelime
    └──────────────┘
    
    [DER]❌ [die] [das]  ← Kullanıcı "der" seçti
    
    💥 Shake animasyonu
    ❌ "Falsch!" / "Yanlış!" / "Wrong!"  ← UI diline göre
    ✅ Doğru cevap: das
```

---

## ✅ Umut'un Kelime Hazırlama Checklist'i

### Demo Set (1 set = 10 kelime)
- [ ] 10 kolay Almanca kelime seç
- [ ] Her kelimenin doğru artikelini belirle
- [ ] CSV formatında kaydet

### Level 1 - Kolay (5 set = 50 kelime)
- [ ] Günlük yaşam kelimeleri
- [ ] Herkesin bildiği kelimeler
- [ ] Örnek: Tisch, Tür, Auto, Buch, Stuhl, etc.

### Level 2 - Orta-Kolay (5 set = 50 kelime)
- [ ] Biraz daha spesifik kelimeler
- [ ] A2-B1 seviyesi

### Level 3 - Orta (5 set = 50 kelime)
- [ ] Orta seviye kelimeler
- [ ] B1-B2 seviyesi

### Level 4 - Zor (5 set = 50 kelime)
- [ ] Teknik veya daha az bilinen kelimeler
- [ ] B2-C1 seviyesi

### Level 5 - Çok Zor (5 set = 50 kelime)
- [ ] İleri seviye, nadiren kullanılan kelimeler
- [ ] C1-C2 seviyesi

**TOPLAM: 250 Almanca kelime + artikelleri**

---

## 🚫 YAPILMAYACAKLAR

### Kelime Çevirileri
- ❌ Türkçe anlamlar eklenmeyecek
- ❌ İngilizce anlamlar eklenmeyecek
- ❌ Kelime açıklamaları eklenmeyecek
- ❌ Örnek cümleler eklenmeyecek

### Neden?
1. **Öğrenme odağı:** Artikel öğrenme (çeviri değil)
2. **Oyun akışı:** Hızlı tahmin (okuma değil)
3. **Karmaşıklık:** Daha az veri = daha hızlı geliştirme
4. **MVP yaklaşımı:** İskelet önce, detaylar sonra

---

## 💡 Gelecek Özellikler (v2.0 için düşünülebilir)

Eğer proje başarılı olursa ve kullanıcılar isterse:
- 🔮 Kelime ipuçları (opsiyonel)
- 📖 Kelime detay sayfası (tıklanınca açılır)
- 🎯 Pratik modu (yanlış yapılan kelimeleri tekrar et)
- 📚 Kişisel kelime listesi
- 🔊 Kelime telaffuzu (ses)

**Ama şimdilik:** Sadece Almanca kelime + artikel tahmini!

---

## 📞 AI Agent'a İletilecek Mesaj

```
"Words are ALWAYS in German. Only the UI (buttons, menus, labels, 
messages) is multilingual (Turkish, English, German). 

The game objective: Users learn and practice German article 
(der/die/das) assignment for German nouns. 

Database schema:
- word_german (TEXT) - German word only
- correct_article (TEXT) - der, die, or das
- NO translation columns needed

UI translations needed for:
- Buttons, menus, labels
- Game instructions
- Performance messages
- Difficulty level badges
- Error messages

Words are NOT translated - always shown in German!"
```

---

**TARİH:** {{ CURRENT_DATE }}
**PROJE:** Der Die Das Space v1.0
**AMAÇ:** Almanca artikel öğrenme ve yarışma platformu
