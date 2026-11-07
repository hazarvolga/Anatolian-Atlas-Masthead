# NextStopTurkey — GAP ve Teknik Borç Raporu

**Tarih:** 7 Kasım 2026
**Branch / Commit:** `main` / `45ecc84`
**Kapsam:** `src/` (React+Vite) · `backend/` (Express) · `prisma/` · Docker/CI
**Yöntem:** Canlı dev ortamı + statik analiz. Sprint 0/1 düzeltmeleri rapor içinde işaretlendi.

---

## 0. Özet

Proje "Stable R5" olarak etiketlenmiş ve ana sayfa/tur/destinasyon listeleme DB'den çalışıyor. Ancak **kritik kullanıcı yolculukları (kayıt, rezervasyon, ödeme, e-posta, admin paneli) uçtan uca çalışmıyor.** Frontend'in çağırdığı 78 farklı API yolundan önemli bir kısmı backend'de tanımlı değil; tanımlı olanlarda da alan adı (camelCase/snake_case) uyuşmazlıkları var.

| Metrik | Değer |
|---|---|
| Backend route handler | 38 |
| Frontend'in çağırdığı farklı API yolu | 78 |
| TypeScript hatası (`tsc --noEmit`) | **93** |
| ESLint | **308 error / 23 warning** |
| `: any` kullanımı | 274 (lint: 302 `no-explicit-any`) |
| `console.log` (src + backend) | **1.050** |
| TODO/FIXME/HACK | 119 |
| Test dosyası | **0** |
| CI workflow | **0** |
| Production build | ✅ Geçiyor (tip kontrolü yapmıyor) |
| Bundle | 1.462 kB JS (418 kB gzip), tek chunk |
| Prisma modelleri | 16 · Migration dosyası: **1** (baseline) |
| Frontend LOC / backend LOC | ~39.900 / ~1.900 |

**En kritik 5 bulgu**

1. `/admin` arayüzü admin kullanıcıyla bile açılmıyor → `/profile`'a yönleniyor.
2. Kayıt (signup) her istekte `400 All fields are required` dönüyor.
3. Tur yorumları endpoint'i `500` dönüyor.
4. Ödeme (Stripe) ve e-posta gönderimi backend'de hiç yok; ilgili ekranlar boş endpoint'lere istek atıyor.
5. Public ana sayfa `/api/admin/site-settings` çağırıp sürekli `401` üretiyor; `/api/pages/*` çağrıları sürekli `404`.

---

## Sprint 0 Uygulama Durumu — ✅ Tamamlandı (7 Kasım 2026)

Aşağıdaki 6 madde düzeltildi; her biri canlı ortamda doğrulandı. Toplam değişiklik: **16 dosya, +39/−23 satır.** TypeScript hatası **93 → 76**; `npm run build` geçiyor.

| # | Düzeltme | Dosya(lar) | Doğrulama |
|---|---|---|---|
| 1 | Admin guard'ı rol sorgusu yüklenirken bekliyor | `src/pages/Admin.tsx` | `/admin` → **Dashboard + sidebar**, URL korunuyor |
| 2 | Signup payload'ı `first_name`/`last_name`/`phone` olarak hizalandı; form state alanları eklendi | `src/contexts/AuthContext.tsx`, `src/components/auth/SignupForm.tsx`, `backend/routes/auth.js` | UI'dan kayıt → **201**, `/profile`'a yönlendi |
| 3 | Prisma `select`/`orderBy` snake_case; review ve user payload anahtarları düzeltildi; verify endpoint'i `/verify` oldu | `backend/routes/reviews.js`, `src/hooks/useAdminReviews.ts`, review/user bileşenleri | `GET /api/reviews/tour/:id` → **200** |
| 4 | Public `GET /api/site-settings` eklendi; okuma hook'u public uca bağlandı; admin PUT `value` sarmalına yazıyor | `backend/server.js`, `backend/routes/admin.js`, `src/hooks/useSiteSettings.ts` | Public uç **200**, ana sayfada **401 yok**, ayarlar (adres) görünüyor |
| 5 | `usePage` için `retry:false`; bilinmeyen slug zarif "Page Not Found" | `src/hooks/usePages.ts` | Tek istek, 8 sn'de **1 adet** `/api/pages/...` çağrısı |
| 6 | Fiyat `price_adult`'tan, zorluk backend'in `difficulty` alanından | `src/hooks/useTours.ts` | Kartlarda **€250 / €95**, "Easy"; `€0` yok |

**Sprint 0 dışında kalan, bilinçli ertelenenler:** ödeme/e-posta/eksik modül uçları değişmedi. (Bulk review endpoint'i Sprint 1'de tamamlandı — bkz. #23.)

### Admin kimlik/rol tutarlılığı — ✅ Tamamlandı (Sprint 1, ilk adım)

| # | Düzeltme | Dosya | Doğrulama |
|---|---|---|---|
| 7 | `created_by_id` artık `req.user.id` kullanıyor | `backend/routes/admin.js` | Oluşturulan turda DB'deki `created_by_id` = admin ID |
| 8 | Rolün tek kaynağı `User.role`; atama `User.role`'a yazıyor, kullanıcı listesi oradan okuyor | `backend/routes/admin.js` | `PUT /admin/users/:id/role` → **200**; terfi eden kullanıcı `/api/users/role`→**admin**, `/api/admin/dashboard`→**200** |

Rol ataması artık boş `Role` tablosuna bağımlı değil; `user`/`guide`/`admin` dışındaki değerler **400** dönüyor. `Role`/`UserRole` tabloları bu değişiklikten sonra admin API'sinde kullanılmıyor.

### Veri/altyapı temeli — ✅ Tamamlandı (Sprint 1, ikinci adım)

| # | Düzeltme | Dosya(lar) | Doğrulama |
|---|---|---|---|
| 9 | Şemadan baseline migration üretildi; mevcut DB `migrate resolve --applied` ile baseline'landı | `prisma/migrations/20261107085831_init/migration.sql` | `prisma migrate status` → **Database schema is up to date** |
| 10 | Boş scratch DB'de `migrate deploy` çalıştırıldı | — | 16 tablo + `_prisma_migrations`; dev DB ile `migrate diff` → **empty migration** |
| 11 | `@prisma/client` runtime, `prisma` dev bağımlılığı backend'e eklendi; sürüm kökle aynı (6.12.0) | `backend/package.json`, `backend/package-lock.json` | `require('@prisma/client/package.json').version` → **6.12.0** |
| 12 | Backend imajı kök bağlamdan inşa ediliyor; şema kopyalanıp client üretiliyor | `backend/Dockerfile`, `docker-compose.yml`, `docker-compose.dev.yml`, `.dockerignore` | İmaj build ✅; container içi `migrate deploy` → "No pending"; `/health` → **200 connected** |
| 13 | Kök Dockerfile'daki ikinci (nginx) `CMD` kaldırıldı; prod build script'i `npm ci` kullanıyor | `Dockerfile`, `deploy-prod.sh` | Frontend imajı build ✅ |
| 14 | Migration SQL'leri git'te izlenebilir; `db:migrate`/`db:generate` script'leri eklendi; eski `migrate.js` Prisma'ya delege ediyor | `.gitignore`, `package.json`, `backend/scripts/migrate.js` | `git status` → `?? …/migration.sql` (ignore değil) |

Compose backend servisi artık açılışta `prisma migrate deploy` çalıştırıyor; boş `backend/migrations` initdb bağlaması kaldırıldı. Üretilen prod compose da `migrate deploy && npm start` akışını kullanıyor.

### Rezervasyon akışı — ✅ Tamamlandı (Sprint 1, üçüncü adım)

| # | Düzeltme | Dosya(lar) | Doğrulama |
|---|---|---|---|
| 15 | Tur detayı 500 hatası: review `orderBy` alanı `created_at` oldu | `backend/routes/tours.js` | `GET /api/tours/:id` → **200** (`Istanbul Classics`, 95/45) |
| 16 | `useRealTimePricing` 7 parametreli gerçek imzaya çekildi; `{total, deposit, breakdown}` üretiyor | `src/hooks/useRealTimePricing.ts` | `/book/:tourId` → konsolda 500/`toISOString` hatası yok; 2 yetişkin **$190** |
| 17 | Rezervasyon POST'u hem frontend hem eski payload'ı kabul ediyor; tarih/sayı doğrulaması eklendi | `backend/routes/reservations.js` | Frontend payload → **201**; geçersiz tarih/yetişkin → **400** |
| 18 | Rezervasyon detayı kullanıcı adı/e-postası ile dönüyor | `backend/routes/reservations.js` | `GET /api/reservations/:id` → **200** + `user`; tokensiz → **401** |
| 19 | Online ödeme kapalıyken sahte rezervasyon oluşmuyor; "Sadece Rezervasyon" uçtan uca çalışıyor | `src/components/booking/MultiStepBookingForm/formHandlers.ts` | Ödeme butonu açıklayıcı toast veriyor; rezervasyon → `/booking-success?booking_id=…` |
| 20 | Başarı ekranı Bearer token ile gerçek veriyi okuyor; alan eşlemesi, saat dilimi ve `0` render hatası düzeltildi | `src/pages/BookingSuccess.tsx`, `formHandlers.ts` | Tarih **11/20/2026**, tutar **$190**, misafir/email dolu; yetim `0` yok |
| 21 | Rezervasyonlarım/Profil sayfaları API alanlarıyla (`reservationDate`, `numAdults`, `tour`) uyumlu; auth yükleme yarışı giderildi | `src/pages/MyBookings.tsx`, `src/pages/MyReservations.tsx`, `src/pages/Profile.tsx` | `/my-reservations` → liste hatasız; tarih **November 20th, 2026**, toplam **₺190.00** |
| 22 | Navbar rezervasyon linkleri var olan rotaya bağlandı | `src/components/navbar/TopBar.tsx`, `src/components/navbar/NavbarMobileMenu.tsx` | Link → `/my-reservations` (**200** sayfa) |
| 23 | Toplu review doğrulama ucu eklendi | `backend/routes/admin.js` | `PUT /api/admin/reviews/bulk-update` → **200** `{count}`; eksik/yanlış gövde → **400** |
| 24 | Booking başlığı yerel i18n kaynaklarından okuyor; eksik anahtarlar eklendi | `src/components/booking/MultiStepBookingForm/FormHeader.tsx`, `src/locales/{it,tr,es}.ts` | `/api/translations` **404**'ü kalktı; başlık seçili dilde |

Doğrulama: `npm run build` ✅; değişen dosyalarda ESLint temiz. Rezervasyon kaydı test sonrası DB'den silindi (tablo **0** satır).

---

## 1. Dev Ortamı — Çalışan Durum

| Servis | Durum | Adres |
|---|---|---|
| PostgreSQL 15 (Docker) | ✅ Up | `localhost:5432` (`nextstopturkey`) |
| Backend API (nodemon) | ✅ Up | http://localhost:3001 |
| Vite dev server | ✅ Up | http://localhost:5173 |
| DB şeması | ✅ `prisma migrate deploy` | 16 tablo + `_prisma_migrations` |
| Seed | ✅ 1 admin, 2 tur, 2 destinasyon | admin: `hazarvolga@gmail.com` |
| Sağlık kontrolü | ✅ `{"status":"healthy","database":"connected"}` | `/health` |

Doğrulanan canlı sonuçlar:

| Test | Beklenen | Gerçek |
|---|---|---|
| `POST /api/auth/login` | 200 | ✅ 200, token + role=admin |
| `GET /api/users/role` (token) | admin | ✅ `{"role":"admin"}` |
| `GET /api/admin/dashboard` (token) | 200 | ✅ 200 |
| `GET /api/admin/users` (token) | 200 | ✅ 200 |
| `POST /api/auth/register` (frontend payload) | 201 | ❌ **400** `All fields are required` |
| `GET /api/reviews/tour/:id` | 200 | ❌ **500** |
| `/admin` sayfası | Admin panel | ❌ **/profile'a redirect** |
| `GET /api/pages/booking` | — | ❌ **404** (tekrarlanan istekler) |
| `GET /api/admin/site-settings` (public sayfada) | — | ❌ **401 ×3** |
| `GET /api/site-settings` | 200 | ❌ 404 |
| `GET /api/admin/stripe-settings` | — | ❌ 404 |
| `POST /api/emails/send` | — | ❌ 404 |
| `POST /api/generate-ai-image` | — | ❌ 404 |

---

## 2. P0 — Ürünü Fiilen Kıran Gap'ler

### P0-1 · Admin paneli açılmıyor (race condition)
- `src/pages/Admin.tsx:55-62` yalnızca `user` durumunu bekliyor; `isAdmin` sorgusu yüklenirken `false` olduğu için `<Navigate to="/auth">` çalışıyor.
- `src/hooks/useUserRole.ts:30-33` — sorgu yüklenirken `role` `undefined`, `isAdmin=false`.
- `src/pages/Auth.tsx:17` — oturum açmış kullanıcıyı `/profile`'a atıyor.
- **Sonuç (canlı doğrulandı):** admin token'ı ile `/admin` → `/profile`. API'ler çalışıyor ama arayüz erişilemiyor. README'deki "Fully Functional Admin CRUD" iddiası geçersiz.
- **Düzeltme:** rol sorgusu `isLoading` iken `null` dön; `user === undefined` kontrolünü gerçek durumla değiştir (`null` başlangıç).

### P0-2 · Kayıt (signup) kırık
- Frontend: `src/contexts/AuthContext.tsx:83` → `{ firstName, lastName, phone }`.
- Backend: `backend/routes/auth.js:13-17` → `first_name`, `last_name` bekliyor.
- **Sonuç (canlı doğrulandı):** her signup `400`.
- **Düzeltme:** tek bir sözleşme seç (API snake_case) ve frontend'de dönüştür; `phone` alanını backend'de kabul et.

### P0-3 · Tur yorumları 500
- `backend/routes/reviews.js:17-24` Prisma `select` içinde `firstName`, `lastName`, `avatarUrl`, `createdAt` kullanıyor; şemada alanlar `first_name`, `last_name`, `avatar_url`, `created_at` (`prisma/schema.prisma:16-19`, `236`).
- **Sonuç (canlı doğrulandı):** `GET /api/reviews/tour/:id` → `500 Failed to retrieve reviews.`
- Aynı hata sınıfı: `ReviewDetailModal.tsx:22,31`, `ReviewsTable.tsx:35,43`, `ReviewsBulkActions.tsx:39,56` (`isVerified` ↔ `is_verified`), `BulkActions.tsx:44` / `UserTable.tsx:24` (`role` ↔ `roleName`).

### P0-4 · Ödeme akışı yok
- `backend/package.json:27` `stripe` bağımlılığı var; `backend/` içinde **tek satır Stripe kodu yok**.
- Frontend `usePayments.ts:25` → `/api/reservations`, sonra `useBookingSubmission.ts:89-93` "No payment URL received" fırlatıyor; `usePayments.ts:41` → `/api/payments/verify-session` (404); `BookingSuccess.tsx:45` Stripe `sessionId` bekliyor.
- **Sonuç:** rezervasyon "pending" oluşuyor, ödeme alınamıyor; başarı ekranı gerçek veriye bağlanamıyor.

### P0-5 · E-posta altyapısı yok
- Backend'de nodemailer/SMTP kodu yok; `EmailTemplate`/`EmailLog` tabloları yalnızca şemada.
- Frontend'in çağırdığı `/api/emails/send`, `/api/email-templates/*`, `/api/email-subscriptions/*`, `/api/send-welcome-account-email`, `/api/send-booking-guest-email` uçlarının **hiçbiri yok** (canlı 404).
- `src/emails/templates/*` React Email şablonları hiçbir yerden gönderilmiyor.
- **Sonuç:** rezervasyon onayı, hoş geldin, bülten, unsubscribe akışlarının tamamı ölü.

### P0-6 · Public sayfa admin endpoint'ine gidiyor
- `src/hooks/useSiteSettings.ts:44` → `/api/admin/site-settings` (auth gerekli).
- Ana sayfa bu hook'u kullandığı için her ziyarette `401` üretiyor (canlı loglarda 3 kez).
- **Düzeltme:** public `GET /api/site-settings` ekle; admin yazma uçları ayrı kalsın.

### P0-7 · Eksik sayfa/dinamik içerik uçları
- `usePages.ts:30` → `/api/pages/:slug` ve `:13` → `/api/admin/pages` yok.
- `DynamicPage` catch-all route (`src/App.tsx:84`) her bilinmeyen yolda bu 404'ü tetikliyor; loglarda `/api/pages/booking` tekrar tekrar isteniyor.
- `useNavigation.ts`, `useTranslations.ts`, `useAdminCalendar.ts` de karşılıksız uçlara bağlı.

---

## 3. P1 — Önemli Fonksiyonel ve Güvenlik Borcu

### API sözleşmesi / veri eşleme
| Konu | Kanıt | Etki |
|---|---|---|
| Tur fiyatı 0 görünüyor | `useTours.ts:27` `tour.price` okuyor; API `price_adult` dönüyor | Kartlarda fiyat 0 |
| Zorluk hep "easy" | `useTours.ts:25` `difficulty_level` (null) ile backend'in ürettiği `difficulty` string'ini eziyor | Yanlış filtre/etiket |
| Rezervasyon geliri NaN | Prisma `totalPrice` (`schema.prisma:200`), UI `total_price` (`AdminStats.tsx:15`) | Admin istatistikleri bozuk |
| Review verify endpoint uyuşmazlığı | Frontend `PUT /api/admin/reviews/:id/status` (`useAdminReviews.ts:30`), backend `PUT /reviews/:id/verify` | Onaylama çalışmaz |
| Bulk review endpoint yok | `useAdminReviews.ts:68` | Toplu işlem çalışmaz |
| 40+ eksik endpoint | `useRealTimePricing`, `useTourAddOns`, `useRoomTypes`, `usePromotionalCodes`, `useEmailServiceManager`, `utils/updateToursData.ts:228` | İlgili ekranlar sessizce boş/hatalı |

### Kimlik / yetki
- ✅ **Düzeltildi:** `admin.js` `created_by_id` artık `req.user.id` kullanıyor (bkz. Sprint 1 tablosu).
- ✅ **Düzeltildi:** rol ikiliği giderildi; tek kaynak `User.role` (bkz. Sprint 1 tablosu). `Role`/`UserRole` tabloları kullanılmıyor.
- JWT `localStorage`'da tutuluyor (`AuthContext.tsx:66-67`) → XSS'te token çalınabilir; httpOnly cookie tercih edilmeli.
- `JWT_SECRET` yoksa `jwt.sign` runtime'da patlıyor; `docker-compose.yml:34` ve `dev.yml:26` içinde sabit zayıf secret var.
- Hardcoded admin kimliği: `start-dev.sh:57`, `backend/scripts/seed.js:22-25`, `assign-admin.js:21`.
- `bcrypt` ve `bcryptjs` birlikte bağımlılık; kod yalnızca `bcryptjs` kullanıyor (`backend/package.json:11-12`) — native `bcrypt` ölü ağırlık.

### Dayanıklılık / performans
- Global rate limit **100 istek / 15 dk** (`backend/server.js:46-50`) — SPA normal kullanımda 429'a düşebilir; admin polling ve 404 retry döngüsü bunu hızlandırıyor.
- `express.json({ limit: '10mb' })` (`server.js:53`) — gereğinden geniş.
- `morgan('combined')` tüm trafiği logluyor; prod'da log hacmi yüksek.
- `DynamicPage` 404 retry döngüsü (loglarda saniyeler içinde tekrar) — react-query retry/remount kontrol edilmeli.
- CORS'ta `FRONTEND_URL` ve `.env.prod.example`'daki `CORS_ORIGIN` ayrı isimler; prod'da yanlış değişken okunabilir.
- Seed yalnızca 2 tur / 2 destinasyon üretiyor; ana sayfa bu yüzden seyrek görünüyor.

---

## 4. P2 — Kod Kalitesi ve Bakım Borcu

### Tip güvenliği
- `tsconfig.app.json` içinde `strict:false`, `noUnusedLocals:false`, `noUnusedParameters:false`; buna rağmen **93 TS hatası** var. `vite build` tip kontrolü yapmadığı için hatalar prod'a sızıyor.
- Başlıca hata kümeleri: `MultiStepBookingForm/MainForm.tsx` (10), `SignupForm.tsx` (9), `profile/` (6), `AIGenerateImagePanel.tsx` (geçersiz buton variant'ları), `EmailServiceSettings.tsx` (hook'ta olmayan 4 metod), `EmailDeliveryTest.tsx` (`axios` import edilmemiş).
- `useAdminDestinationFormLogic.ts:35` → `AuthContext`'te olmayan `session` alanı.
- `LanguageContext.tsx:19` → iki farklı locale tipi birbirine atanıyor.

### Ölü kod / kopyalar
- `src/pages/Admin.tsx.backup`, `src/pages/BookingSuccess.tsx.backup`, `src/pages/Admin_fixed.tsx`, `src/components/booking/MultiStepBookingForm/MainForm.tsx.bak`
- Sıfır baytlık dosyalar: `src/emails/EmailService.ts`, `src/emails/index.ts`, `src/emails/types.ts`, `src/integrations/supabase/client.ts`, `src/components/admin/email/EmailTemplateEditor.tsx`, `src/hooks/useEmailManagement.ts`, `src/hooks/useEmailScheduling.ts`
- `src/pages/App.tsx` (3 satırlık orphan fragman), `EmailService.minimal.ts` (kullanılmıyor)
- `src/App.tsx:50` ve `:56` → `/profile` route'u iki kez tanımlı.
- Yinelenen hook'lar: `useBookings` / `useReservations`, `useAdminBookings` / `useAdminReservations`, `useBookingForm` / `hooks/booking/useBookingForm`; `useEnhancedBookingForm.ts:9` var olmayan export'u import ediyor.
- `MyBookings.tsx` / `MyReservations.tsx` neredeyse aynı; `App.tsx:16` birini diğerinin adıyla kullanıyor.
- 4 ayrı `Tour` tipi (`types/index.ts`, `types/tour.ts`, `AdminTours.tsx:13`, `useDestinations.ts:12`).
- `Admin.tsx.backup` ve `Admin_fixed.tsx` şu anki `Admin.tsx` ile çakışıyor; hangisinin doğru olduğu belirsiz.

### API istemcisi
- `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'` satırı **~50 dosyada** tekrar ediyor. Tek bir axios instance / `src/lib/api.ts` yok; hata yönetimi, token header'ı ve base URL her yerde kopyalanmış.

### Gözlemlenebilirlik ve test
- Test yok (unit/integration/e2e), test script'i yok.
- CI yok: `.github/` altında yalnızca `copilot-instructions.md` ve chatmode dosyası var.
- `package.json`'da `typecheck` script'i yok; `build` tip kontrolü yapmıyor.
- Hata izleme yok (`SENTRY_DSN` yalnızca örnek env'de). Gözlemlenebilirlik 1.050 `console.log` üzerinden yürüyor.
- Loglarda istek gövdesi tamamen basılıyor (`admin.js:118,279,628`) — PII/secret sızma riski.

### Ürün tutarlılığı / içerik
- 13 yerde **MareSereno / Costa Bella** kalıntısı var (`Footer.tsx`, `Contact.tsx:126`, nav logo, `TestimonialsSection.tsx`). Ana sayfa footer'ında hâlâ "Mare Sereno" görünüyor.
- `TestimonialsSection.tsx:15,21` sabit 5 yıldız yorumlar; gerçek Review kayıtlarıyla bağlantısız.
- `Gallery.tsx:9` hardcoded Unsplash listesi.
- `AdminStats.tsx:21-24` trend yüzdeleri mock.
- `EmailTemplateManager.tsx:28-29` "TourCo" mock site ayarları.
- `Contact.tsx:32-38` form yalnızca `console.log`; `Footer.tsx:158` bülten formunun `onSubmit`'i yok; `UnsubscribePage.tsx:196-202` butonu `onClick`'siz.
- `BookingSuccess.tsx:53-63` sahte misafir fallback'i (`email@example.com`).
- `StockImageSelector.tsx:4-8` tur görseli olarak laptop/devre kartı öneriyor.

### Altyapı / dağıtım
- ✅ **Düzeltildi:** baseline migration eklendi; şema artık `migrate deploy` ile kuruluyor (bkz. Veri/altyapı tablosu).
- ✅ **Düzeltildi:** `backend/scripts/migrate.js` Prisma CLI'ya delege ediyor; `npm run migrate` gerçek migration'ları uyguluyor.
- ✅ **Düzeltildi:** `@prisma/client` ve `prisma` backend bağımlılıklarında (6.12.0 sabit); Docker imajı client'ı build sırasında üretiyor.
- ✅ **Düzeltildi:** kök `Dockerfile` tek `CMD` kullanıyor; backend imajı kök bağlamdan inşa ediliyor.
- Varsayılan `docker-compose.yml` geliştirme amaçlı (`npm run dev`); prod deploy script'i migration + `npm start` kullanıyor.
- `README.md` ve `README-LOCAL-SETUP.md` farklı akışlar anlatıyor; `start-dev.sh:58` frontend'i 5174 olarak duyuruyor (Vite 5173).
- `dist/` build çıktısı tek chunk: 1.462 kB JS. Route bazlı `lazy()` / `manualChunks` yok.

---

## 5. Öncelikli Düzeltme Planı

### Sprint 0 — "Çalışır demo" (1–2 gün)
1. **Admin erişimi:** rol sorgusu yüklenirken bekle; `Admin.tsx` guard'ını düzelt. → `/admin` açılır.
2. **Signup sözleşmesi:** frontend payload'ı `first_name`/`last_name`'e çevir, `phone` kabul et. → kayıt çalışır.
3. **Reviews alan adları:** Prisma `select`'leri snake_case'e çevir; admin review bileşenlerindeki `isVerified`/`role` çağrılarını düzelt. → 500 biter.
4. **Public site-settings:** `GET /api/site-settings` ekle, ana sayfayı ona bağla. → 401 gürültüsü biter.
5. **`/api/pages/:slug`:** eksik route'u ekle veya `DynamicPage`'i 404'te tekrar denemeyecek şekilde ayarla. → 404 döngüsü biter.
6. **Tur eşleme:** `useTours.ts` içinde `price_adult` ve backend `difficulty` alanını kullan. → fiyat/zorluk doğru.

**Doğrulama:** `tsc --noEmit` sayısı artmasın; signup 201, reviews 200, `/admin` panel açılsın, ana sayfa console'unda 401/404 olmasın.

### Sprint 1 — Ticari akış (3–5 gün)
7. Stripe Checkout + webhook + `payments/verify-session`; rezervasyon durum makinesi.
8. SMTP/nodemailer servisi + şablon gönderimi + rezervasyon onayı; bülten/consent ve unsubscribe uçları + şema modeli.
9. Rol tekilliği: tek kaynak (`User.role` veya `UserRole`) seç; `req.user.id` tutarlılığı.
10. JWT'yi httpOnly cookie'ye taşı; secret zorunluluğu ve prod config düzeltmesi.
11. Rate limit'i endpoint bazlı yap (auth için sıkı, public read için gevşek).
12. ✅ **Tamamlandı:** migration zinciri, `migrate` script'i ve backend Prisma bağımlılıkları (bkz. Veri/altyapı tablosu).

### Sprint 2 — Sürdürülebilirlik (1 hafta)
13. `src/lib/api.ts` tek axios instance; ~50 kopya base URL'i kaldır.
14. Ölü dosyaları sil, yinelenen hook'ları birleştir, tek `Tour`/`Destination` tipi.
15. `strict: true` + `typecheck` script'i + CI (lint, tsc, build); 93 hatayı kapat.
16. Test başlangıcı: kritik akışlar için Vitest + Playwright smoke (login, admin, rezervasyon).
17. `React.lazy` ile route bazlı code splitting; 1.46 MB bundle'ı parçala.
18. MareSereno/Costa Bella kalıntılarını ve mock içerikleri temizle; Contact/Newsletter/Unsubscribe'ı gerçek uçlara bağla.
19. ✅ **Tamamlandı (Dockerfile kısmı):** tek CMD, `prisma generate`, kök bağlam; prod akışı `npm start`.

---

## 6. Yapılan Ortam Değişiklikleri (şeffaflık)

İlk denetimde kaynak kod değiştirilmedi; Sprint 0/1 düzeltmeleri yukarıdaki tablolarda listelendi. Yerel ortam için:

- `docker compose up -d postgres` — Postgres 15 container'ı başlatıldı.
- `backend/.env` oluşturuldu (gitignored; local dev secret'ları).
- Mevcut `db push` şemasından baseline migration üretildi ve `migrate resolve --applied 20261107085831_init` ile baseline'landı.
- Boş scratch DB'de `migrate deploy` doğrulandı, ardından scratch DB silindi.
- `node backend/scripts/seed.js` — admin + örnek veri yüklendi.
- `npm install` (kök + backend) — `node_modules` oluştu.
- `npm run build` — `dist/` üretildi (gitignored).
- Backend `:3001`, Vite `:5173` arka planda çalışıyor; tarayıcıda ana sayfa açıldı.

**Tekrar üretmek için:**

```bash
docker compose up -d postgres
cp backend/.env.example backend/.env   # DATABASE_URL'i localhost'a çevir
cd backend && npm install && cd ..
DATABASE_URL='postgresql://postgres:postgres123@localhost:5432/nextstopturkey' npm run db:migrate
DATABASE_URL='postgresql://postgres:postgres123@localhost:5432/nextstopturkey' npm run db:generate
node backend/scripts/seed.js
cd backend && npm run dev              # :3001
npm run dev                            # :5173 (kökten)
```

Docker ile tamamı: `docker compose up --build` (backend açılışta `prisma migrate deploy` çalıştırır).

**Doğrulama komutları:**

```bash
npx tsc --noEmit -p tsconfig.app.json | grep -c 'error TS'
npx eslint src
curl -s localhost:3001/health
curl -s -X POST localhost:3001/api/auth/register -H 'Content-Type: application/json' \
  -d '{"email":"x@y.z","password":"test1234","firstName":"A","lastName":"B"}'
```
