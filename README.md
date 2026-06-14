# SocialFlow

Instagram Business ekipleri için içerik hazırlama, onaylama, planlama ve mock yayınlama paneli.

## İlk Faz

- Next.js App Router, TypeScript ve Tailwind CSS
- Sol menülü yönetim paneli
- Demo dashboard
- Yeni gönderi oluşturma ekranı
- Çoklu görsel yükleme
- Görsel ön izleme
- Sürükleyerek görsel sıralama
- Caption, hashtag, tarih ve saat alanları
- Instagram gönderi ön izlemesi
- Mock sosyal hesap, gönderi ve aktivite verileri
- Gerçek Instagram/Meta API bağlantısı olmayan mock yayınlama servisi
- Netlify için statik export yapılandırması

## Yerel Çalıştırma

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

Sunucusuz hızlı ön izleme için:

```bash
START_PREVIEW.cmd
```

## Kontrol Komutları

```bash
npm run lint
npm run type-check
npm run build
```

## Netlify

Bu proje Netlify için statik çıktı üretir.

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `22`

Bu ayarlar `netlify.toml` dosyasında tanımlıdır.

## Ortam Değişkenleri

`.env.example` dosyası Supabase için gerekli anahtar isimlerini gösterir. İlk fazda canlı Supabase bağlantısı yapılmadığı için değerler boş bırakılabilir.

## Sınırlar

Bu sürüm gerçek Instagram veya Meta API bağlantısı kurmaz, gerçek paylaşım yapmaz ve canlı veritabanına yazmaz.
