# NextStopTurkey — Asset & License Manifest

This manifest documents all photography, typography, and icon assets included in or referenced by the **NextStopTurkey ("Anatolian Atlas")** Next.js 16 travel template.

---

## 1. Typography

| Typeface | Role | Source | License | Redistribution Rights |
| :--- | :--- | :--- | :--- | :--- |
| **Newsreader** | Display headlines, editorial section headers, pull quotes (`--font-serif`) | Google Fonts (`next/font/google`, subsets `latin`, `latin-ext`) | SIL Open Font License 1.1 (OFL-1.1) | Free for commercial and non-commercial use, modification, and redistribution |
| **Source Sans 3** | Body copy, UI controls, navigation, forms, tabular numerals (`--font-sans`) | Google Fonts (`next/font/google`, subsets `latin`, `latin-ext`) | SIL Open Font License 1.1 (OFL-1.1) | Free for commercial and non-commercial use, modification, and redistribution |

---

## 2. Iconography

| Package | Role | License | Attribution Required |
| :--- | :--- | :--- | :--- |
| **Lucide React** (`lucide-react`) | UI, navigation, geography, and booking step icons | ISC License | No |

---

## 3. Photography Inventory (Türkiye Regional Imagery)

All remote preview photographs used in `src/lib/data/demo-content.ts` and editorial sections are sourced from **Unsplash** and depict authentic locations in **Türkiye**.

> **Important Note for Commercial Template Buyers:**
> Unsplash grants an irrevocable, nonexclusive, worldwide copyright license to download, copy, modify, distribute, perform, and use photos from Unsplash for free, including for commercial purposes, without permission from or attributing the photographer. However, Unsplash does **not** permit selling unaltered copies of photos or compiling photos from Unsplash to replicate a competing stock service. When deploying your own production travel agency website or redistributing a modified template package, we recommend replacing remote Unsplash URLs with your own self-hosted photography in `public/images/` or your CDN.

| Asset ID / Context | URL | Depicted Location in Türkiye | Usage Rights | Alt Text |
| :--- | :--- | :--- | :--- | :--- |
| `hero-bosphorus` / `dest-istanbul` / `tour-istanbul-strata` | `https://images.unsplash.com/photo-1524231757912-21f4fe3a7200` | Ortaköy Mosque & The Bosphorus Strait, İstanbul | Unsplash License (Commercial & Preview) | Morning ferry crossing the Bosphorus Strait toward Ortaköy in İstanbul, Türkiye |
| `istanbul-golden-horn` / `dest-mardin` | `https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b` | Süleymaniye & Historic Peninsula, İstanbul / Anatolian Stone Architecture | Unsplash License (Commercial & Preview) | Domes and historic stone architecture at dusk in Türkiye |
| `istanbul-galata` | `https://images.unsplash.com/photo-1527838832700-5059252407fa` | Galata Tower & Beyoğlu, İstanbul | Unsplash License (Commercial & Preview) | Galata Tower overlooking the Karaköy waterfront and Bosphorus |
| `dest-cappadocia` / `tour-cappadocia-tuff` | `https://images.unsplash.com/photo-1641128324972-af3212f0f6bd` | Göreme National Park & Cappadocia Valleys, Nevşehir | Unsplash License (Commercial & Preview) | Tuff rock formations and dawn light across Göreme valley, Cappadocia |
| `cappadocia-craft` | `https://images.unsplash.com/photo-1570939274717-7eda259b50ed` | Ürgüp & Avanos, Central Anatolia | Unsplash License (Commercial & Preview) | Hand-woven Anatolian kilims and copperwork in a historic caravanserai |
| `dest-ephesus` / `tour-ephesus-ionia` / `editorial-interval` | `https://images.unsplash.com/photo-1589561454226-796a8aa89b05` | Library of Celsus, Ephesus (Selçuk, İzmir) | Unsplash License (Commercial & Preview) | Second-century Roman facade of the Library of Celsus at Ephesus, Selçuk, Türkiye |
| `dest-lycia` / `tour-lycian-way` | `https://images.unsplash.com/photo-1519046904884-53103b34b206` | Kaş & The Lycian Coast, Antalya | Unsplash License (Commercial & Preview) | Turquoise limestone cove along the Lycian Way near Kaş |
| `dest-pamukkale` / `tour-pamukkale-hierapolis` | `https://images.unsplash.com/photo-1596394516093-501ba68a0ba6` | Pamukkale Travertines & Hierapolis, Denizli | Unsplash License (Commercial & Preview) | Mineral-rich thermal pools on the white travertine terraces of Pamukkale |
