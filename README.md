# SocialFlow

Instagram Business ekipleri için içerik hazırlama, onaylama, planlama ve yayınlama paneli.

## Özellikler

- Next.js App Router, TypeScript ve Tailwind CSS
- Sol menülü yönetim paneli
- Dashboard, içerik takvimi, taslaklar, onay, program ve yayın geçmişi
- Yeni gönderi oluşturma ekranı
- Çoklu görsel yükleme, ön izleme ve sürükleyerek sıralama
- Caption, hashtag, ilk yorum, tarih ve saat alanları
- Instagram gönderi ön izlemesi
- Tarayıcı içi simülasyon modu
- Supabase Storage ile gerçek medya yükleme hazırlığı
- Netlify Functions ile gerçek Instagram Graph API yayın endpointleri
- Netlify Scheduled Function ile zamanlanmış yayın kuyruğu

## Yerel Çalıştırma

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Kontrol Komutları

```bash
npm run lint
npm run type-check
npm run build
```

## Netlify

- Build command: `npm run build`
- Publish directory: `out`
- Functions directory: `netlify/functions`
- Node version: `22`

Bu ayarlar `netlify.toml` dosyasında tanımlıdır.

## Gerçek Yayın İçin Gerekenler

Netlify Environment Variables bölümüne şu değerler girilmelidir:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SOCIALFLOW_ORGANIZATION_ID`
- `SOCIALFLOW_SOCIAL_ACCOUNT_ID`
- `META_INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `META_ACCESS_TOKEN`
- İsteğe bağlı: `META_GRAPH_API_VERSION`

Uygulama içindeki `Ayarlar` ekranına ayrıca Supabase Project URL ve anon public key girilmelidir. Bu sadece tarayıcıdan Supabase Storage bucketına medya yüklemek için kullanılır.

Supabase SQL Editor içinde migration dosyalarını sırayla çalıştırın:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0002_storage_and_real_publishing.sql`

## Instagram Koşulları

Gerçek paylaşım için Instagram hesabı Business veya Creator olmalı, bir Facebook Page ile bağlı olmalı ve Meta uygulamasında Instagram Graph API yayın izinleri için geçerli access token bulunmalıdır.

İlk gerçek sürüm görsel ve carousel paylaşımı destekler. Video/Reels yayınlama daha sonra ayrı işleme/polling akışıyla genişletilecektir.
