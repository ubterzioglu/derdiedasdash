# SQL Dosyası Kullanımı

## ⚠️ ÖNEMLİ UYARI

**YANLIŞ:** `src/lib/api.js` veya başka bir JavaScript dosyasının içeriğini Supabase SQL Editor'e yapıştırmayın!

**DOĞRU:** Sadece `supabase-auth-schema.sql` dosyasının içeriğini Supabase SQL Editor'de çalıştırın.

## Nasıl Kullanılır?

1. Supabase Dashboard'a gidin
2. Sol menüden **SQL Editor**'ü açın
3. **New Query** butonuna tıklayın
4. `supabase-auth-schema.sql` dosyasını açın (VS Code veya notepad ile)
5. Dosyanın **tam içeriğini** kopyalayın
6. Supabase SQL Editor'e yapıştırın
7. **Run** butonuna tıklayın

## Dosya Konumu

```
supabase-auth-schema.sql
```

Bu dosya proje root dizininde bulunmaktadır.

## Ne Yapar?

Bu SQL dosyası:
- `scores` tablosunu oluşturur
- RLS (Row Level Security) politikalarını ekler
- `upsert_best_score()` fonksiyonunu oluşturur
- Gerekli indexleri oluşturur

## Hata Alıyorsanız

Eğer "syntax error" hatası alıyorsanız:
- ✅ JavaScript kodu değil, SQL kodu olduğundan emin olun
- ✅ Dosyanın başında `--` ile başlayan yorumlar olmalı
- ✅ `CREATE TABLE`, `CREATE POLICY` gibi SQL komutları olmalı
- ❌ `import`, `export`, `function` gibi JavaScript kelimeleri OLMAMALI
