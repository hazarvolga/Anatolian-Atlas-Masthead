# NextStopTurkey — Faz 8.5 Raporu: Konsept Paketi (`ConceptPack` = Tam Kimlik), Statik/ISR Koruma & Placeholder Modu

> **Tarih:** 7 Kasım 2026  
> **Commit:** `9befd41` (`origin/main`)  
> **Kapsam:** Faz 7–8 Ön Koşulları (`cookies()`/`headers()` kaldırılmasıyla Statik/ISR korunması + `DEMO_IMAGES` Nötr Placeholder Modu) ve Faz 8.5 (`ConceptPack` Tam Kimlik Mimarisi, 36 Ekran Görüntüsü, `%100` Gri Tonlamalı Kabul Testi, WCAG Kontrast, `@axe-core/playwright` ve Lighthouse Mobile Denetimi)

---

## 1. Faz 8.5 Öncesi 2 Zorunlu Düzeltme Kanıtı

### 1.1 Kök Layout’tan `cookies()` / `headers()` Kaldırılması ve Statik/ISR Rotaların Korunması

- `web-next/src/lib/data/server-theme.ts`, `web-next/src/lib/i18n/server-locale.ts` ve `web-next/app/layout.tsx` içerisindeki tüm `cookies()` ve `headers()` çağrıları kaldırıldı.
- SSR tema kimliği yalnızca `tags: ["site-settings"]` ve `revalidate: 3600` ile önbelleklenen `getServerSiteSettings()` üzerinden çözülüyor; Admin panelinden tema kaydedildiğinde `revalidateTag("site-settings", { expire: 0 })` ile anında yenileniyor.
- `nst_theme_config` çerez/localStorage ve `?preset=` URL önizleme desteği, `web-next/src/contexts/DesignSystemContext.tsx` içinde yalnızca `NEXT_PUBLIC_DEMO_MODE === "true"` (`isDemoMode()`) aktifken istemci tarafında çalışacak şekilde sınırlandırıldı; böylece hiçbir statik/ISR sayfa dinamik (`ƒ`) hale gelmiyor.

#### `next build` Rota Tablosu Çıktısı (`/`, `/tours`, `/destinations` -> `○ Static / ISR`)

```text
Route (app)                                                                          Revalidate  Expire
┌ ○ /                                                                                        2m      1y
├ ○ /_not-found                                                                              1h      1y
├ ƒ /[slug]
├ ○ /admin                                                                                   1h      1y
├ ○ /admin/destinations/create                                                               1h      1y
├ ƒ /admin/destinations/edit/[id]
├ ƒ /admin/pages/edit/[id]
├ ○ /admin/tours/create                                                                      1h      1y
├ ƒ /admin/tours/edit/[id]
├ ƒ /api/catalog/health
├ ƒ /api/revalidate
├ ○ /auth                                                                                    1h      1y
├ ƒ /book/[tourId]
├ ○ /booking-cancel                                                                          1h      1y
├ ○ /booking-success                                                                         1h      1y
├ ○ /contact                                                                                 1h      1y
├ ○ /design-system                                                                           1h      1y
├ ○ /destinations                                                                            2m      1y
├ ƒ /destinations/[id]
├ ○ /email-confirmation                                                                      1h      1y
├ ○ /gallery                                                                                 1h      1y
├ ○ /journal                                                                                 1h      1y
├   /journal/[slug]
│ ├ ● /journal/gobekli-tepe-and-the-limestone-enclosures-of-taht-tash                        1h      1y
│ ├ ● /journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul              1h      1y
│ ├ ● /journal/cappadocia-ignimbrite-stratigraphy-and-byzantine-fresco-preservation          1h      1y
│ └ ● [+3 more paths]
├ ƒ /llms.txt
├ ○ /my-reservations                                                                         1h      1y
├ ○ /profile                                                                                 1h      1y
├ ○ /robots.txt
├ ○ /sitemap.xml                                                                             2m      1y
├ ○ /tours                                                                                   2m      1y
├ ƒ /tours/[id]
└ ○ /unsubscribe                                                                             1h      1y

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

### 1.2 Ticari Satış Paketi İçin `DEMO_IMAGES` Nötr Placeholder Modu

- `web-next/src/lib/data/demo-images.ts` içerisine `isPlaceholderImageMode()` (`NEXT_PUBLIC_DEMO_PLACEHOLDER_MODE=true` veya `NEXT_PUBLIC_ASSET_MODE=placeholder`) eklendi.
- `public/demo/` fotoğraflarından bağımsız olarak ticari satış paketinde dağıtılabilmesi için `web-next/public/placeholders/` altında 3 adet telifsiz, kendi kendine yeten mimari/kartografik SVG plaka üretildi:
  - `/placeholders/plate-architecture.svg` (`HTTP 200`, `image/svg+xml`)
  - `/placeholders/plate-landscape.svg` (`HTTP 200`, `image/svg+xml`)
  - `/placeholders/plate-coastline.svg` (`HTTP 200`, `image/svg+xml`)

---

## 2. Faz 8.5 — `ConceptPack` Veri Modeli ve 3 Konseptin Layout Haritası

`web-next/src/design/concepts.ts` içerisinde `ConceptPack` tipi tanımlandı ve `web-next/src/config/theme.config.ts` yalnızca aktif `preset` kimliğini seçip (isteğe bağlı slot bazlı `overrides` ile) tüm `layout`, `pageManifests`, `motion`, `imageTreatment`, `shape` ve `voice` ayarlarını otomatik türetecek şekilde yapılandırıldı.

### 3 Konseptin Mimari ve Layout Haritası Tablosu

| Boyut / Slot | `atlas-editorial` (*Anatolian Atlas*) | `aegean-linen` (*Aegean Linen*) | `ottoman-noir` (*Ottoman Noir*) |
|---|---|---|---|
| **Grid & Hizalama** | 12 kolon İsviçre grid (`border-x` hairline çizgiler), sol hizalı, tablo numaralandırması (`01 / 06`) ve koordinat künyeleri | Asimetrik 5/7 ve 7/5 kompozisyon, taşan tam-bleed görseller, `1.25x` geniş boşluk çarpanı | Ortalı, tam simetrik eksen, tam ekran gece salonu bölümleri, çift altın çerçeve |
| **Font Çifti & Tip Ölçeği** | `Newsreader` + `Source Sans 3` + `IBM Plex Mono` (`1.25` ölçek) | `Fraunces` + `Instrument Sans` (`1.333` ölçek) | `Bodoni Moda` + `Albert Sans` (`1.414` ölçek) |
| **Köşe, Çerçeve & Ornaman** | `sharp` (`0px`), `hairline-grid`, `compass-ticks` | `soft` (`0.5rem–1rem`), `frameless-bleed`, `none` (ornamansız) | `sharp` (`0px`), `double-gold-ornament`, `ottoman-corner` SVG köşe rozetleri |
| **Görsel İşleme (`imageTreatment`)** | Doğal renk (`contrast(1.02) saturate(0.98)`), `4:5` dikey ve `3:2` oran | Yüksek anahtar / sıcak (`brightness(1.04) contrast(0.96) saturate(0.92)`), `16:10` ve `4:3` oran | Koyu vinyet + SVG film grain dokusu (`brightness(0.9) contrast(1.12)`), `3:4` ve `21:9` oran |
| **Hareket (`motion`)** | Hızlı ve keskin (`0.6s`, `power3.out`, `masked-line`, stagger `0.055s`) | Yavaş ve sürüklenen (`1.2s`, `power2.out`, `drift-parallax`, stagger `0.11s`) | Dramatik perde açılışı (`1.05s`, `expo.out`, `clip-curtain`, stagger `0.09s`) |
| **Header (`layout.header`)** | `swiss-bar` (Üst koordinat şeridi + numaralı `01–05` hücreli bar) | `minimal-overlay` (Çerçevesiz yüzen bar, üst şeritsiz, yuvarlak CTA) | `centered-logo` (Sol 3 link — Ortada anıtsal `NEXTSTOPTURKEY` — Sağ 2 link + aksiyonlar) |
| **Footer (`layout.footer`)** | `atlas-columns` (4 sütunlu arşiv kolofonu + TÜRSAB/bülten) | `minimal` (Geniş boşluklu asimetrik kıyı kolofonu) | `big-wordmark` (Simetrik altın çerçeveli salon kolofonu + dev wordmark) |
| **Anasayfa Hero (`layout.home`)** | `masthead` (7/5 İsviçre editoryal kapak + alt filtre cetveli) | `split-cinema` (5/7 asimetrik interaktif bölge seçici + yüzen rota kartı) | `fullscreen-reel` (Tam ekran simetrik gece sahnesi + köşe altın SVG + `CHAPTER I–VI` barı) |
| **Anasayfa Bölüm Sırası (`pageManifests.home`)** | `hero (masthead)` → `destination-index (map-index)` → `featured-tours (portrait-4x5)` → `manifesto` → `testimonials` → `cta-band` | `hero (split-cinema)` → `manifesto` → `destination-index (horizontal-scroll)` → `featured-tours (landscape-row)` → `testimonials` → `cta-band` | `hero (fullscreen-reel)` → `featured-tours (full-bleed-minimal)` → `manifesto` → `destination-index (grid-mosaic)` → `testimonials` → `cta-band` |
| **Bölge Fihristi (`destinationIndex`)** | `map-index` (5/7 tablo + önizleme plakası) | `horizontal-scroll` (Masaüstünde GSAP yatay kaydırmalı galeri, mobilde dikey) | `grid-mosaic` (Simetrik mozaik plakalar) |
| **Tur Kartı (`layout.tourCard`)** | `portrait-4x5` (`4:5` dikey plaka + 3 sütunlu metrik cetveli) | `landscape-row` (`16:10` yatay geniş görsel + orta özet + sağ tarife) | `full-bleed-minimal` (Tam-bleed koyu vinyet + ince altın iç çerçeve + ortalı tipografi) |
| **Tur Kataloğu (`/tours` Manifest)** | `swiss-sidebar-grid` (Üst cetvel + 4 sütunlu tablo filtre + 2 sütunlu `portrait-4x5` grid) | `asymmetric-offset-rows` (Asimetrik başlık + sağda öne çıkan kart + yüzen filtre + tek sütun `landscape-row` dizilimi) | `symmetrical-salon-showcase` (Ortalı anıtsal başlık + altın çerçeveli filtre + 2 sütun `full-bleed-minimal` vitrin) |
| **Tur Detay (`layout.tourDetail`)** | `dossier` (7/5 kapak + sol dikey rota cetveli + sağ yapışkan tarife sütunu) | `story-scroll` (Asimetrik `16:10` kapak + tam genişlikli editoryal hikâye akışı) | `tabs` (Simetrik altın çerçeveli anıt + `I. Premise` / `II. Daily Chronicle` / `III. Provisions` sekme geçişi) |

---

## 3. Kabul Testi: `%100` Gri Tonlamalı (Grayscale) Karşılaştırma Matrisleri

- `faz85-grayscale-matrix-home.png`: `/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6/faz85-grayscale-matrix-home.png`
- `faz85-grayscale-matrix-tours.png`: `/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6/faz85-grayscale-matrix-tours.png`
- `faz85-grayscale-matrix-tour-detail.png`: `/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6/faz85-grayscale-matrix-tour-detail.png`
- `faz85-grayscale-matrix-destination-detail.png`: `/Users/hazarvolgaekiz/.gemini/antigravity/brain/173dadfb-75b8-4764-83d9-425ca41fa4e6/faz85-grayscale-matrix-destination-detail.png`

---

## 4. 36 Ekran Görüntüsü Envanteri (`3 Konsept × 6 Sayfa × 2 Viewport`)

| Sayfa | Konsept | Mobil (`360×800`) | Masaüstü (`1440×900`) |
|---|---|---|---|
| **1. Anasayfa (`/`)** | `atlas-editorial` | `faz85-atlas-editorial-home-360w.png` | `faz85-atlas-editorial-home-1440w.png` |
| **1. Anasayfa (`/`)** | `aegean-linen` | `faz85-aegean-linen-home-360w.png` | `faz85-aegean-linen-home-1440w.png` |
| **1. Anasayfa (`/`)** | `ottoman-noir` | `faz85-ottoman-noir-home-360w.png` | `faz85-ottoman-noir-home-1440w.png` |
| **2. Tur Kataloğu (`/tours`)** | `atlas-editorial` | `faz85-atlas-editorial-tours-360w.png` | `faz85-atlas-editorial-tours-1440w.png` |
| **2. Tur Kataloğu (`/tours`)** | `aegean-linen` | `faz85-aegean-linen-tours-360w.png` | `faz85-aegean-linen-tours-1440w.png` |
| **2. Tur Kataloğu (`/tours`)** | `ottoman-noir` | `faz85-ottoman-noir-tours-360w.png` | `faz85-ottoman-noir-tours-1440w.png` |
| **3. Tur Detay (`/tours/[id]`)** | `atlas-editorial` | `faz85-atlas-editorial-tour-detail-360w.png` | `faz85-atlas-editorial-tour-detail-1440w.png` |
| **3. Tur Detay (`/tours/[id]`)** | `aegean-linen` | `faz85-aegean-linen-tour-detail-360w.png` | `faz85-aegean-linen-tour-detail-1440w.png` |
| **3. Tur Detay (`/tours/[id]`)** | `ottoman-noir` | `faz85-ottoman-noir-tour-detail-360w.png` | `faz85-ottoman-noir-tour-detail-1440w.png` |
| **4. Bölge Detay (`/destinations/[id]`)** | `atlas-editorial` | `faz85-atlas-editorial-destination-detail-360w.png` | `faz85-atlas-editorial-destination-detail-1440w.png` |
| **4. Bölge Detay (`/destinations/[id]`)** | `aegean-linen` | `faz85-aegean-linen-destination-detail-360w.png` | `faz85-aegean-linen-destination-detail-1440w.png` |
| **4. Bölge Detay (`/destinations/[id]`)** | `ottoman-noir` | `faz85-ottoman-noir-destination-detail-360w.png` | `faz85-ottoman-noir-destination-detail-1440w.png` |
| **5. Journal Makale (`/journal/[slug]`)** | `atlas-editorial` | `faz85-atlas-editorial-journal-article-360w.png` | `faz85-atlas-editorial-journal-article-1440w.png` |
| **5. Journal Makale (`/journal/[slug]`)** | `aegean-linen` | `faz85-aegean-linen-journal-article-360w.png` | `faz85-aegean-linen-journal-article-1440w.png` |
| **5. Journal Makale (`/journal/[slug]`)** | `ottoman-noir` | `faz85-ottoman-noir-journal-article-360w.png` | `faz85-ottoman-noir-journal-article-1440w.png` |
| **6. Rezervasyon (`/book/[tourId]`)** | `atlas-editorial` | `faz85-atlas-editorial-booking-360w.png` | `faz85-atlas-editorial-booking-1440w.png` |
| **6. Rezervasyon (`/book/[tourId]`)** | `aegean-linen` | `faz85-aegean-linen-booking-360w.png` | `faz85-aegean-linen-booking-1440w.png` |
| **6. Rezervasyon (`/book/[tourId]`)** | `ottoman-noir` | `faz85-ottoman-noir-booking-360w.png` | `faz85-ottoman-noir-booking-1440w.png` |

---

## 5. Konsept Başına Kontrast, `@axe-core/playwright` ve Lighthouse Mobile Sonuçları

### 5.1 Token Kontrast & `@axe-core/playwright` Denetimi
- **Token Kontrast (`node scripts/build-tokens.mjs`):** 3 konsept × 2 mod (`light`, `dark`) × 10 semantik renk çifti = **60/60 WCAG 2.2 AA/AAA kontrolü `0` hata ile geçti** (`docs/TOKEN_CONTRAST_REPORT.md`).
- **`@axe-core/playwright` (`node scripts/verify-faz85.mjs`):** 3 konsept × 6 sayfa = **18 tam sayfa WCAG 2.2 AA taraması `0` ihlal (`0 violations`) ile geçti**.

### 5.2 Konsept Başına Lighthouse Mobile Sonuçları (Simüle 4G + 4x CPU Kısıtlaması Açık, `360×800`)

| Konsept | Rota | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT (INP Proxy) | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **`atlas-editorial`** | `/` | **100** | **99** | **100** | **100** | `1204 ms` | `1204 ms` | `1 ms` | `0.000` |
| **`atlas-editorial`** | `/tours` | **100** | **99** | **100** | **100** | `1204 ms` | `1204 ms` | `0 ms` | `0.000` |
| **`atlas-editorial`** | `/tours/tour-cappadocia-tuff` | **100** | **99** | **100** | **100** | `1204 ms` | `1204 ms` | `10 ms` | `0.0145` |
| **`aegean-linen`** | `/` | **100** | **100** | **100** | **100** | `1204 ms` | `1204 ms` | `2 ms` | `0.000` |
| **`aegean-linen`** | `/tours` | **100** | **100** | **100** | **100** | `1204 ms` | `1204 ms` | `0 ms` | `0.0084` |
| **`aegean-linen`** | `/tours/tour-cappadocia-tuff` | **99** | **100** | **100** | **100** | `1204 ms` | `1204 ms` | `0 ms` | `0.0662` |
| **`ottoman-noir`** | `/` | **100** | **100** | **100** | **100** | `1203 ms` | `1203 ms` | `5 ms` | `0.000` |
| **`ottoman-noir`** | `/tours` | **100** | **99** | **100** | **100** | `1203 ms` | `1203 ms` | `0 ms` | `0.000` |
| **`ottoman-noir`** | `/tours/tour-cappadocia-tuff` | **100** | **100** | **100** | **100** | `1203 ms` | `1203 ms` | `0 ms` | `0.001` |
