# SocialFlow – Proje Teknik Şartnamesi

## Proje Amacı

Instagram Business hesapları için sosyal medya içerik hazırlama, onaylama, planlama ve otomatik yayınlama web uygulaması geliştirilecektir.

Sosyal medya ekibi sisteme giriş yapacak, tekli veya çoklu görseller yükleyecek, görsellerin sırasını sürükleyerek belirleyecek, gönderi açıklamasını yazacak, yayın tarihini ve saatini seçecek ve içeriği onaya gönderecektir.

Yönetici içeriği inceleyip onaylayabilecek, düzeltme isteyebilecek veya reddedebilecektir.

Onaylanan içerik belirlenen tarih ve saatte Instagram Business hesabında otomatik yayımlanacaktır.

İlk geliştirme aşamasında gerçek Instagram API bağlantısı kurulmayacaktır. Önce uygulamanın temel altyapısı, arayüzü ve simülasyon modu hazırlanacaktır.

## Teknik Yapı

- Next.js güncel kararlı sürüm
- App Router
- TypeScript
- Tailwind CSS
- Supabase
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Netlify üzerinde yayımlanabilir yapı
- Responsive tasarım
- Mobil, tablet ve masaüstü uyumluluğu
- Türkçe arayüz
- Varsayılan saat dilimi: Europe/Istanbul
- Temiz, modüler ve sürdürülebilir kod yapısı

## Uygulamanın Geçici Adı

SocialFlow

## Kullanıcı Rolleri

1. Admin
2. İçerik Editörü
3. Onay Yetkilisi
4. Görüntüleyici

## Ana Ekranlar

1. Giriş
2. Dashboard
3. İçerik takvimi
4. Yeni gönderi oluşturma
5. Taslaklar
6. Onay bekleyen içerikler
7. Programlanmış içerikler
8. Yayın geçmişi
9. Instagram hesapları
10. Kullanıcılar ve yetkiler
11. Ayarlar

## Yeni Gönderi Ekranı

- Sistem içi gönderi başlığı
- Marka veya Instagram hesabı seçimi
- Gönderi türü:
  - Tek görsel
  - Kaydırmalı carousel
  - Video
  - Reels
- Çoklu dosya yükleme
- Yüklenen dosyaların küçük ön izlemesi
- Drag-and-drop ile medya sıralama
- Medya silme ve değiştirme
- Instagram gönderi ön izlemesi
- Caption
- Hashtag
- İlk yorum
- Yayın tarihi
- Yayın saati
- Saat dilimi
- Taslak kaydetme
- Onaya gönderme
- Programlama

## İçerik Durumları

- draft
- pending_approval
- revision_requested
- approved
- scheduled
- publishing
- published
- failed
- rejected
- cancelled

## Dashboard

- Bu hafta planlanan gönderiler
- Onay bekleyen gönderiler
- Başarısız gönderiler
- Bu ay yayımlanan gönderiler
- Yaklaşan ilk beş paylaşım
- Son işlemler
- İçerik durumlarının dağılımı

## Takvim

- Aylık görünüm
- Haftalık görünüm
- Günlük görünüm
- Gönderi görsellerinin küçük ön izlemesi
- Durum rozetleri
- Gönderi detay paneli
- Gelecekte sürükleyerek tarih değiştirmeyi destekleyen mimari

## Veritabanı Tabloları

- profiles
- organizations
- organization_members
- social_accounts
- posts
- post_media
- post_approvals
- post_comments
- publishing_jobs
- publishing_attempts
- notifications
- activity_logs

Her tabloda uygun `id`, `created_at` ve `updated_at` alanları bulunmalıdır.

### posts

- id
- organization_id
- social_account_id
- created_by
- title
- post_type
- caption
- hashtags
- first_comment
- status
- scheduled_at
- timezone
- approved_by
- approved_at
- published_at
- external_post_id
- external_post_url
- failure_reason
- created_at
- updated_at

### post_media

- id
- post_id
- storage_path
- public_url
- media_type
- sort_order
- width
- height
- file_size
- processing_status
- created_at

## Güvenlik

- Supabase Row Level Security kullanılmalıdır.
- Kullanıcılar yalnızca üyesi oldukları organizasyonların verilerini görebilmelidir.
- Roller ekran ve işlem yetkilerini sınırlandırmalıdır.
- Gizli anahtarlar istemci tarafında bulunmamalıdır.
- Supabase service role key tarayıcıya gönderilmemelidir.
- `.env.example` hazırlanmalıdır.

## Simülasyon Modu

İlk aşamada gerçek Instagram yayını yerine mock publishing servisi oluşturulacaktır.

Simülasyon servisi:

- Gönderiyi `publishing` durumuna almalı
- Ardından `published` veya `failed` sonucuna geçirebilmeli
- Sahte `external_post_id` ve `external_post_url` oluşturmalı
- `publishing_attempts` tablosuna kayıt atmalı
- `activity_logs` tablosuna işlem geçmişi yazmalı

Geliştirme ortamında `Yayını Şimdi Simüle Et` butonu bulunmalıdır.

## Tasarım

- Kurumsal, modern ve sade yönetim paneli
- Açılıp kapanabilir sol menü
- Üst bölümde organizasyon ve hesap seçici
- Temiz kart yapıları
- Net tipografi
- Açık ve koyu temaya uygun mimari
- Mobilde drawer veya alt menü
- Gereksiz animasyon kullanılmaması
- Profesyonel boşluk ve hizalama sistemi

## Çalışma Planı

1. Proje iskeletini oluştur.
2. Gerekli bağımlılıkları kur.
3. Klasör mimarisini hazırla.
4. Veritabanı şemasını SQL migration dosyası olarak oluştur.
5. Demo verilerle çalışan arayüzü hazırla.
6. Yeni gönderi oluşturma ekranını çalışır hâle getir.
7. Çoklu görsel yükleme ve sıralama sistemini oluştur.
8. Dashboard ve takvim ekranlarını oluştur.
9. Mock yayınlama servisini ekle.
10. README dosyasına kurulum adımlarını yaz.
11. Lint ve type-check çalıştır.
12. Karşılaşılan hataları düzelt.

## Sınırlar

Aşağıdaki işlemler yapılmamalıdır:

- Gerçek Meta veya Instagram hesabına bağlanmak
- Gerçek paylaşım yapmak
- Ücretli servis satın almak
- Canlı veritabanındaki verileri silmek
- Gizli anahtar üretmek veya tahmin etmek

Küçük teknik kararlar için sürekli kullanıcı onayı istenmemelidir. Mantıklı ve sürdürülebilir tercihler uygulanmalıdır.

## İlk Görev

Öncelikle şu parçalar tamamlanmalıdır:

- Çalışan uygulama iskeleti
- Temel navigasyon
- Demo dashboard
- Yeni gönderi oluşturma ekranı
- Çoklu görsel ön izleme ve sıralama
- Mock veriler

İş sonunda Codex:

- Oluşturulan dosyaları özetlemeli
- Çalıştırılan komutları belirtmeli
- Test sonuçlarını yazmalı
- Eksik kalan noktaları açıkça belirtmeli
- Yerel çalıştırma komutunu vermelidir
