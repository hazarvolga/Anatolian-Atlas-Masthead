export interface JournalCitation {
  id: string;
  source: string;
  publication: string;
  year: string;
  url?: string;
}

export interface JournalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  pullQuote?: {
    text: string;
    attribution: string;
  };
  figure?: {
    image: string;
    caption: string;
    coordinates: string;
  };
}

export interface JournalArticle {
  slug: string;
  folioNo: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Archaeology" | "Architecture" | "Geology" | "Maritime History";
  regionId: string;
  regionName: string;
  relatedTourId: string;
  coordinates: string;
  elevation: string;
  publishedAt: string;
  readingMinutes: number;
  heroImage: string;
  heroCaption: string;
  author: {
    name: string;
    role: string;
    isDemoByline: true;
    demoNotice: string;
  };
  keyFacts: Array<{
    label: string;
    value: string;
  }>;
  sections: JournalSection[];
  citations: JournalCitation[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "gobekli-tepe-and-the-limestone-enclosures-of-taht-tash",
    folioNo: "MONOGRAPH 01",
    title: "T-Pillars of the Harran Horizon: Reading Pre-Pottery Neolithic Enclosures at Göbekli Tepe",
    subtitle:
      "How tenth-millennium BCE hunter-gatherers quarried monolithic limestone pillars on the Germuş ridge before the domestication of cereal crops.",
    excerpt:
      "At 760 meters above the Harran Plain in Şanlıurfa Province, circular megalithic enclosures erected between 9600 and 8200 BCE inverted the classical archaeological sequence of sedentism and monumentality.",
    category: "Archaeology",
    regionId: "dest-mardin",
    regionName: "Mardin & Upper Mesopotamia",
    relatedTourId: "tour-mardin-mesopotamia",
    coordinates: "37.2233° N, 38.9225° E",
    elevation: "760 m ASL (Germuş Mountain Range)",
    publishedAt: "2026-02-14",
    readingMinutes: 7,
    heroImage:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Upper Mesopotamian limestone plateau looking south toward the Harran basin at dusk.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against UNESCO & DAI excavation reports",
    },
    keyFacts: [
      { label: "Stratigraphic Period", value: "Pre-Pottery Neolithic A–B (c. 9600–8200 BCE)" },
      { label: "UNESCO Inscription", value: "2018 (Ref. 1572, Criterion i, ii, iv)" },
      { label: "Central Pillar Height", value: "Up to 5.5 m (Enclosure D, Pillars 18 & 31)" },
      { label: "Bedrock Lithology", value: "Eocene–Miocene karstic limestone" },
    ],
    sections: [
      {
        id: "stratigraphy-and-chronology",
        heading: "01. Stratigraphy on the Germuş Crest",
        paragraphs: [
          "Positioned at the highest point of the Germuş mountain range northeast of Şanlıurfa, Göbekli Tepe overlooks the headwaters of the Balikh River and the northern edge of the Fertile Crescent. Systematic excavations initiated in 1995 by the Şanlıurfa Museum and the German Archaeological Institute (DAI) under Klaus Schmidt revealed a multi-layered tell where monumental architecture preceded pottery, metallurgy, and domesticated grain.",
          "Radiocarbon dating of charcoal and pedogenic carbonate coatings from the oldest monumental phase (Layer III) places the construction of Enclosures A, B, C, and D firmly in the Pre-Pottery Neolithic A (PPNA) horizon, approximately 9600 to 8800 BCE. Each circular or oval structure centers on a pair of free-standing T-shaped limestone monoliths reaching up to 5.5 meters in height and weighing between 10 and 16 metric tons.",
        ],
        pullQuote: {
          text: "The T-shaped pillars are stylized anthropomorphic beings—arms carved in low relief along the shafts fold toward loincloths of fox pelts on the eastern and western monoliths.",
          attribution: "Field Note 01.A — Enclosure D Iconography Survey",
        },
      },
      {
        id: "quarrying-and-iconography",
        heading: "02. Flint-Channeled Quarrying & High-Relief Fauna",
        paragraphs: [
          "Walking the surrounding limestone plateaus reveals how Neolithic stonecutters leveraged natural horizontal bedding planes in the Eocene bedrock. Using nodular flint picks struck directly from nearby chert seams, workers trenched perimeter channels around each monolith before wedging the block free from the underlying stratum. One unfinished pillar still attached to the northern quarry bench measures nearly 7 meters in length.",
          "Unlike later domestic settlements of the Pre-Pottery Neolithic B (PPNB) phase—where smaller rectangular rooms with terrazzo-like burnt lime floors superseded the great circles—the early enclosures feature dense bas-reliefs of wild boar,aurochs, Asiatic wild asses, cranes, scorpions, and leopards. Recent archaeometric research under the Taş Tepeler project (including Karahantepe and Sayburç) demonstrates that Göbekli Tepe belonged to a broader regional network of twelve contemporaneous upland sanctuaries across Şanlıurfa.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-1",
        source: "UNESCO World Heritage Centre",
        publication: "Göbekli Tepe — World Heritage List Inscription Dossier No. 1572",
        year: "2018",
        url: "https://whc.unesco.org/en/list/1572/",
      },
      {
        id: "cit-2",
        source: "German Archaeological Institute (DAI) / Klaus Schmidt",
        publication: "Göbekli Tepe: A Stone Age Sanctuary in South-Eastern Anatolia",
        year: "2012",
      },
    ],
  },
  {
    slug: "mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
    folioNo: "MONOGRAPH 02",
    title: "Hollow Clay & Counter-Domes: Mimar Sinan’s Structural and Acoustic Engineering in Sixteenth-Century İstanbul",
    subtitle:
      "Tracing the terracotta dome vessels, load-distributing half-domes, and soot-ventilation chambers of the Süleymaniye complex.",
    excerpt:
      "Between 1550 and 1557, Chief Imperial Architect Koca Mimar Sinan Ağa raised the Süleymaniye complex on the Third Hill using stepped Khorasan-mortar foundations, lead-clamped masonry, and 64 hollow earthenware vessels recorded in the imperial construction ledgers.",
    category: "Architecture",
    regionId: "dest-istanbul",
    regionName: "İstanbul & The Bosphorus",
    relatedTourId: "tour-istanbul-strata",
    coordinates: "41.0162° N, 28.9639° E",
    elevation: "58 m ASL (Third Hill of the Historic Peninsula)",
    publishedAt: "2026-02-28",
    readingMinutes: 8,
    heroImage:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Cascading lead-sheathed domes and buttress piers above the Golden Horn at first light.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against Barkan (1972) & Necipoğlu (2005)",
    },
    keyFacts: [
      { label: "Süleymaniye Construction", value: "1550–1557 CE (7 years)" },
      { label: "Main Dome Geometry", value: "26.5 m diameter, 53 m crown height above floor" },
      { label: "Dome Earthenware Vessels", value: "64 terracotta jars (2 akçe each, Barkan 1972, I:381)" },
      { label: "Foundation Depth", value: "Stepped masonry + timber grillage on bedrock" },
    ],
    sections: [
      {
        id: "seismic-foundations",
        heading: "01. Six Years of Foundation Settlement on the Third Hill",
        paragraphs: [
          "When Sultan Süleyman I commissioned the külliye crowning İstanbul’s steep Third Hill in 1550, Mimar Sinan confronted a terraced slope dropping sharply toward the Golden Horn inside a high-intensity seismic zone. Construction ledgers published by Ömer Lütfi Barkan (1972, Vol. I, pp. 142–168) and analyzed by Gülru Necipoğlu (2005, pp. 207–215) record that the initial three years were devoted almost entirely to excavating down to stable bedrock and laying a stepped sub-foundation stabilized with cured timber grillage and Khorasan mortar (horasan harcı) mixed with crushed brick pozzolana.",
          "By allowing the massive substructure to settle before raising the four primary porphyry and limestone baldachin piers, Sinan minimized differential settlement. Despite major earthquakes in 1766, 1894, and 1999, the primary load-bearing arches of the Süleymaniye have remained structurally intact for nearly five centuries.",
        ],
        pullQuote: {
          text: "Imperial account books for 1555–1556 record the purchase of sixty-four hollow earthenware jars at two akçe apiece to be set around the central dome ring—simultaneously lightening the masonry haunches and moderating low-frequency dome reflections.",
          attribution: "Field Note 02.B — Construction Ledger Citation (Barkan 1972, Vol. I, pp. 381–384)",
        },
      },
      {
        id: "helmholtz-acoustics-and-soot-ventilation",
        heading: "02. Terracotta Dome Vessels & Convective Soot Chambers",
        paragraphs: [
          "In the large domed prayer hall of the Süleymaniye, the imperial construction account books document sixty-four hollow terracotta jars (küp / sebu) embedded around the dome base (Barkan 1972, Vol. I, pp. 381–384). Modern archaeoacoustic measurements (Sü Gül & Çalışkan 2013, pp. 49–62) note that while these earthenware cavities contribute secondary low-frequency cavity absorption, their primary engineering function—alongside the porous Khorasan plaster, muqarnas stalactite zones, and wool floor carpets—was reducing dead weight in the dome haunches while maintaining clear Quranic recitation across a reverberation time of roughly 2.5 to 3.5 seconds at mid-frequencies.",
          "Equally deliberate was the building’s passive aerodynamics. Above the main northern portal, Sinan engineered a subtle air-inlet channel that directed drafts across thousands of suspended oil lamps toward a single collection chamber (is odası) above the entrance (Necipoğlu 2005, pp. 219–222). Rather than blackening the İznik calligraphic roundels and marble muqarnas, lamp soot was deposited inside the humidified chamber and harvested to manufacture carbon ink.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-sinan-1",
        source: "Gülru Necipoğlu",
        publication: "The Age of Sinan: Architectural Culture in the Ottoman Empire (Princeton University Press, pp. 207–222)",
        year: "2005",
      },
      {
        id: "cit-sinan-2",
        source: "Ömer Lütfi Barkan",
        publication: "Süleymaniye Cami ve İmareti İnşaatı (1550–1557), Vol. I (Türk Tarih Kurumu, pp. 142–168, 381–384)",
        year: "1972",
      },
      {
        id: "cit-sinan-3",
        source: "Zühre Sü Gül & Mehmet Çalışkan",
        publication: "Impact of Design Decisions on Acoustical Comfort Parameters: Case Study of Süleymaniye Mosque (Building Acoustics, Vol. 20, No. 1, pp. 49–62)",
        year: "2013",
      },
    ],
  },
  {
    slug: "cappadocia-ignimbrite-stratigraphy-and-byzantine-fresco-preservation",
    folioNo: "MONOGRAPH 03",
    title: "Tuff, Basalt Caps & Mineral Pigments: Ignimbrite Differential Erosion and Byzantine Fresco Preservation in Cappadocia",
    subtitle:
      "How Mio-Pliocene volcanic ash sheets from Erciyes and Hasan Dağı formed a natural thermal and UV envelope for the rock-cut churches of Göreme.",
    excerpt:
      "Across the Nevşehir plateau, soft dacitic ignimbrite overlaid by dense basaltic lava flows created both the hoodoo pinnacles of Paşabağ and the dark, microclimatically stable vaults of Karanlık Kilise and Tokalı Kilise.",
    category: "Geology",
    regionId: "dest-cappadocia",
    regionName: "Cappadocia & Central Plateau",
    relatedTourId: "tour-cappadocia-tuff",
    coordinates: "38.6431° N, 34.8289° E",
    elevation: "1,150 m ASL (Göreme Valley Basin)",
    publishedAt: "2026-03-10",
    readingMinutes: 6,
    heroImage:
      "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Differential erosion columns in the Kavak and Zelve ignimbrite formations at dawn.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against Jolivet-Lévy (1991), Epstein (1986) & Çiner (2019)",
    },
    keyFacts: [
      { label: "Volcanic Sequence", value: "Upper Miocene–Pliocene (c. 9–2.5 Ma)" },
      { label: "Primary Eruptive Centers", value: "Erciyes (3,917 m), Hasan Dağı (3,268 m), Melendiz" },
      { label: "Subterranean Depth", value: "Up to 85 m across 8–11 levels (Derinkuyu)" },
      { label: "Interior Microclimate", value: "Constant 12–15 °C year-round inside tuff chambers" },
    ],
    sections: [
      {
        id: "ignimbrite-formation",
        heading: "01. Pyroclastic Flows & Basalt Capstones",
        paragraphs: [
          "Between nine and two million years ago, paroxysmal eruptions along the Central Anatolian Volcanic Province blanketed a 20,000-square-kilometer lacustrine basin in successive sheets of rhyodacitic ash, pumice, and welded ignimbrite—classified by geologists into members such as the Kavak, Zelve, Sarımadentepe, and Cemilköy tuffs (Çiner & Aydar 2019, pp. 1–24). Subsequent effusive stages capped these friable ash layers with thinner, fracture-resistant sheets of basalt and andesite.",
          "As meltwater and tributaries of the Kızılırmak (Halys) River incised the plateau during the Quaternary, vertical cooling joints channeled runoff through the upper caprock. Where an isolated block of dense basalt remained perched above a column of softer tuff, it shielded the underlying cone from raindrop impact, sculpting the tapering pinnacles of Paşabağ and Devrent.",
        ],
        pullQuote: {
          text: "Freshly quarried volcanic tuff can be carved with a hand adze, yet upon exposure to atmospheric air its surface dehydrates and case-hardens into a self-supporting vault.",
          attribution: "Field Note 03.A — Lithological Inspection, Kızılçukur & Çavuşin",
        },
      },
      {
        id: "karanlik-kilise-pigments",
        heading: "02. Photochemical Shielding in Karanlık Kilise & Tokalı Kilise",
        paragraphs: [
          "During the Middle Byzantine renaissance of the tenth and eleventh centuries, monastic communities and aristocratic donors excavated cross-in-square churches directly out of the living rock at Göreme, Soğanlı, and the Ihlara gorge (Jolivet-Lévy 1991, pp. 95–108). Rather than laying structural masonry, excavators hollowed out columns, pendentives, and domes in negative relief, priming the porous tuff with a fine lime-and-straw intonaco before applying mineral pigments.",
          "In the tenth-century New Church of Tokalı Kilise, technical conservation analyses confirmed the elite use of imported natural ultramarine (lapis lazuli) alongside copper blues and local iron-oxide earths (Epstein 1986, pp. 31–34). Nearby in the mid-eleventh-century Karanlık Kilise ('Dark Church'), illuminated only by a single small aperture in the narthex, the near-total exclusion of solar ultraviolet radiation—combined with the thermal inertia of the surrounding volcanic tuff—preserved the iron-oxide reds, green earth (celadonite), lime whites, and deep blue grounds in extraordinary saturation.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-cap-1",
        source: "Catherine Jolivet-Lévy",
        publication: "Les églises byzantines de Cappadoce: Le programme iconographique de l'abside et de ses abords (CNRS Éditions, pp. 95–108)",
        year: "1991",
      },
      {
        id: "cit-cap-2",
        source: "Ann Wharton Epstein",
        publication: "Tokalı Kilise: Tenth-Century Metropolitan Art in Byzantine Cappadocia (Dumbarton Oaks Studies XXII, pp. 31–34)",
        year: "1986",
      },
      {
        id: "cit-cap-3",
        source: "Attila Çiner & Erkan Aydar",
        publication: "Geomorphology and Volcano-stratigraphy of the Cappadocian Ignimbrites (Geomorphology / Landscapes and Landforms of Turkey, Springer, pp. 535–549)",
        year: "2019",
      },
    ],
  },
  {
    slug: "patara-stadiasmus-and-the-maritime-topography-of-lycia",
    folioNo: "MONOGRAPH 04",
    title: "The Stadiasmus of Patara and the Silted Harbors of the Lycian League",
    subtitle:
      "Epigraphic road tables, Roman lighthouse engineering, and alluvial shoreline progradation along the Teke Peninsula.",
    excerpt:
      "At the mouth of the Xanthos Valley, a monumental pillar erected in 45–46 CE under Emperor Claudius recorded 64 road segments linking every polis of the newly annexed province of Lycia.",
    category: "Maritime History",
    regionId: "dest-lycia",
    regionName: "Lycian Coast & Kaş",
    relatedTourId: "tour-lycian-gulet",
    coordinates: "36.2619° N, 29.3156° E",
    elevation: "0–42 m ASL (Patara Harbor Estuary)",
    publishedAt: "2026-03-22",
    readingMinutes: 7,
    heroImage:
      "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Limestone littoral and submerged harbor breakwaters between Kaş and Kekova Island.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against Akdeniz University Patara Excavation reports",
    },
    keyFacts: [
      { label: "Lycian League Council", value: "23 voting cities (3, 2, or 1 vote by size — Strabo 14.3.3)" },
      { label: "Stadiasmus Patarensis", value: "45/46 CE (Claudian road monument, 64 routes in stadia)" },
      { label: "Neronian Lighthouse", value: "64–65 CE, 26 m original height at harbor mouth" },
      { label: "Lycian Trail Length", value: "540 km marked coastal path (Fethiye to Geyikbayırı)" },
    ],
    sections: [
      {
        id: "federation-and-bouleuterion",
        heading: "01. Proportional Representation in the Patara Bouleuterion",
        paragraphs: [
          "Writing in the first century BCE, the geographer Strabo (Geographica 14.3.3) documented the constitutional mechanics of the Lycian League (Lykion To Koinon): twenty-three autonomous cities convened in a common synedrion where the six largest cities—Xanthos, Patara, Pinara, Olympos, Myra, and Tlos—each held three votes, medium-sized poleis held two, and smaller settlements held one. Taxes and judicial appointments were apportioned strictly in matching ratios.",
          "At Patara, the League’s principal naval harbor and archive city, archaeological clearing of drifted coastal dunes revealed the semi-circular Bouleuterion where delegates deliberated, alongside the massive Hadrianic granary (horrea) built in 129 CE to store Anatolian grain awaiting shipment to Rome.",
        ],
        pullQuote: {
          text: "Recovered in forty-six inscribed limestone blocks from a Late Antique defensive wall, the Stadiasmus Patarensis maps the exact mountain passes connecting Lycia’s coastal ports to its alpine valleys.",
          attribution: "Field Note 04.B — Epigraphic Survey, Patara Inner Harbor",
        },
      },
      {
        id: "alluvial-silting-and-kekova-subsidence",
        heading: "02. Alluvial Progradation at Xanthos vs. Coseismic Subsidence at Simena",
        paragraphs: [
          "The Lycian coastline exhibits two contrasting geomorphological processes within fifty kilometers. At Patara and Myra (Andriake), sediment carried down from the Akdağlar massif by the Eşen Çayı (ancient Xanthos River) progressively choked the sheltered embayments, stranding Nero’s 64 CE lighthouse behind a barrier of windblown sand dunes.",
          "Further east along the sheltered strait between Kekova Island and Kaleköy (ancient Simena), historical normal-faulting earthquakes—particularly in the second and sixth centuries CE—triggered localized coastal subsidence of roughly 1.5 to 2.2 meters. As a result, rock-cut slipways, olive presses, and residential staircases carved into the limestone shore now lie visible immediately beneath the clear surface of the bay.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-lyc-1",
        source: "Sencer Şahin & Mustafa Adak",
        publication: "Stadiasmus Patarensis: Itineraria Romana Provinciae Lyciae",
        year: "2007",
      },
      {
        id: "cit-lyc-2",
        source: "UNESCO World Heritage Centre",
        publication: "Xanthos-Letoon — World Heritage List Inscription No. 484",
        year: "1988",
        url: "https://whc.unesco.org/en/list/484/",
      },
    ],
  },
  {
    slug: "cayster-alluvium-and-marble-urbanism-at-ephesus",
    folioNo: "MONOGRAPH 05",
    title: "The Retreating Sea of Ephesus: Alluvial Silting of the Cayster Estuary and Roman Terrace Engineering",
    subtitle:
      "How Küçük Menderes sedimentation pushed the Aegean shoreline six kilometers west while Aristocratic domus rose up Bülbül Dağı.",
    excerpt:
      "For over a millennium, engineers at Ephesus dredged their sacred harbor basin against the silt of the Cayster River while constructing seven-story terraced residences heated by clay hypocausts.",
    category: "Archaeology",
    regionId: "dest-ephesus",
    regionName: "Ephesus & The Ionian Coast",
    relatedTourId: "tour-ephesus-ionian",
    coordinates: "37.9395° N, 27.3417° E",
    elevation: "18–85 m ASL (Panayırdağ & Bülbül Dağı Saddle)",
    publishedAt: "2026-04-02",
    readingMinutes: 7,
    heroImage:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Proconnesian and local marble colonnades along the Curetes Way and Library of Celsus.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against Austrian Archaeological Institute (ÖAI) publications",
    },
    keyFacts: [
      { label: "Shoreline Progradation", value: "6–8 km westward shift since the Hellenistic period" },
      { label: "Library of Celsus", value: "114–117 CE (12,000 scroll capacity, double-walled moisture barrier)" },
      { label: "Terrace Houses (Hanghäuser)", value: "1st–3rd c. CE (up to 950 m² floor plans with private baths)" },
      { label: "UNESCO Inscription", value: "2015 (Ref. 1018 — Çukuriçi Höyük, Artemision, Ephesus, Ayasuluk)" },
    ],
    sections: [
      {
        id: "harbor-silting-and-lysimachus",
        heading: "01. Lysimachus’s Relocation & The Battle Against the Cayster Silt",
        paragraphs: [
          "Geoarchaeological core drilling across the Selçuk plain confirms that during the Archaic and Classical periods, ships anchored directly beside the Temple of Artemis. As deforestation in the upland watersheds accelerated erosion along the Küçük Menderes (ancient Cayster) River, prograding deltaic silt sealed the early harbor. Around 290 BCE, the Hellenistic ruler Lysimachus relocated the entire city two kilometers southwest into the valley saddle between Panayırdağ (Mount Pion) and Bülbül Dağı (Mount Koressos).",
          "Even the new Roman imperial harbor—linked to the Great Theatre by the eleven-meter-wide marble Arkadiane—required relentless maintenance. Epigraphic decrees from the reigns of Nero, Hadrian, and Antoninus Pius record imperial tax exemptions and engineering commissions dedicated to dredging the harbor canal before the shoreline ultimately retreated six kilometers west to Pamucak.",
        ],
        pullQuote: {
          text: "Behind the two-story marble facade of the Library of Celsus, a one-meter-wide peripheral air corridor isolates the inner brick scroll niches from ground moisture and seasonal temperature swings.",
          attribution: "Field Note 05.A — Structural Section, Celsus Library (117 CE)",
        },
      },
      {
        id: "terrace-houses-hydraulic-systems",
        heading: "02. Gravity-Fed Hydraulics in the Slope Houses (Yamaç Evler)",
        paragraphs: [
          "Opposite the Temple of Hadrian, the two insulae of the Terrace Houses (Hanghaus 1 and 2) climb the northern flank of Bülbül Dağı in stepped masonry platforms. Excavated and conserved under a protective climate-controlled roof by the Austrian Archaeological Institute (ÖAI), these seven aristocratic residences preserve opus sectile marble veneers, glass mosaics, and mythological frescoes dating from the Augustan era to the devastating earthquake sequence of 262 CE.",
          "Fed by pressurized terracotta pipelines connected to the Pollio and Aristion aqueducts, each residence maintained running cold water for courtyard peristyle fountains and private latrines, alongside wood-fired hypocaust underfloor heating systems that circulated hot flue gases through hollow tubuli bricks embedded in the bath walls.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-eph-1",
        source: "Austrian Archaeological Institute (ÖAI) / Sabine Ladstätter",
        publication: "Terrace House 2 in Ephesos: An Archaeological Guide",
        year: "2013",
      },
      {
        id: "cit-eph-2",
        source: "UNESCO World Heritage Centre",
        publication: "Ephesus — World Heritage List Inscription No. 1018",
        year: "2015",
        url: "https://whc.unesco.org/en/list/1018/",
      },
    ],
  },
  {
    slug: "hydrothermal-travertine-terraces-and-marble-carving-at-hierapolis-aphrodisias",
    folioNo: "MONOGRAPH 06",
    title: "Calcium Bicarbonate & Blue-Grey Marble: Hydrothermal Travertine at Hierapolis and the Sculptors’ Workshops of Aphrodisias",
    subtitle:
      "Fault-controlled thermal springs in the Çürüksu Graben and the two-kilometer quarry proximity that made Aphrodisias the sculptural academy of the Roman East.",
    excerpt:
      "Separated by the Baba Dağ range, Hierapolis and Aphrodisias illustrate how tectonic faulting and high-purity marble beds shaped monumental urbanism in southwestern Anatolia.",
    category: "Geology",
    regionId: "dest-pamukkale",
    regionName: "Pamukkale, Hierapolis & Aphrodisias",
    relatedTourId: "tour-pamukkale-hierapolis",
    coordinates: "37.9250° N, 29.1258° E",
    elevation: "355–580 m ASL (Çürüksu Graben & Dandalas Valley)",
    publishedAt: "2026-04-12",
    readingMinutes: 6,
    heroImage:
      "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?auto=format&fit=crop&w=1600&q=85",
    heroCaption:
      "Calcite rimstone pools and travertine escarpment above the Lycos Valley.",
    author: {
      name: "Editorial Research Desk — Galata Bureau",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: "DEMO EDITORIAL BYLINE — Factual data verified against UNESCO WHC (No. 485 & No. 1519) & NYU Aphrodisias Archive",
    },
    keyFacts: [
      { label: "Thermal Spring Temperature", value: "35.5 °C to 56 °C (Ca(HCO₃)₂ saturated)" },
      { label: "Travertine Escarpment", value: "2,700 m length × 160 m height above plain" },
      { label: "Aphrodisias Stadium", value: "270 m × 54 m (30,000 spectator capacity)" },
      { label: "Quarry Distance", value: "1.8 km northeast of Aphrodisias city walls" },
    ],
    sections: [
      {
        id: "travertine-geochemistry",
        heading: "01. Degassing CO₂ & Rimstone Precipitation on the Pamukkale Fault",
        paragraphs: [
          "Along the northern margin of the Denizli (Lycos) basin, normal faults of the Çürüksu Graben allow meteoric water to circulate deep into Mesozoic limestone and marble aquifers. Heated geothermally and charged with dissolved carbon dioxide, the water dissolves calcium carbonate at depth and emerges along a seventeen-spring fracture line at Hierapolis at temperatures around 35.5 °C.",
          "Upon reaching atmospheric pressure, rapid CO₂ degassing shifts the carbonate equilibrium, precipitating microcrystalline aragonite and calcite (`CaCO₃`) at rates dependent on flow velocity and channel slope. Founded by the Attalid kings of Pergamon in the late second century BCE directly atop this cliff, Hierapolis channeled the mineral-rich water through its bath-gymnasium complex while utilizing the toxic CO₂-venting fissure beneath the Temple of Apollo as the famous Plutonium oracle.",
        ],
        pullQuote: {
          text: "Because the marble quarries of Baba Dağ lay less than two kilometers uphill from the city agora, Aphrodisian sculptors roughed out monumental portraits on site and signed their work across the Mediterranean.",
          attribution: "Field Note 06.B — Sculptor’s Workshop Survey, North Agora of Aphrodisias",
        },
      },
      {
        id: "aphrodisias-marble-school",
        heading: "02. Two-Tone Marble & The Sculptors’ Workshop of Aphrodisias",
        paragraphs: [
          "Sixty-five kilometers west across the Dandalas Valley, the city of Aphrodisias owed its extraordinary concentration of civic sculpture to geological proximity. Whereas most Roman cities imported heavy marble blocks by sea or ox-cart over dozens of kilometers, the Aphrodisias quarries lay just 1.8 kilometers northeast of the city walls on the gentle lower slopes of Baba Dağ—allowing blocks to be sledded downhill directly into urban workshops.",
          "The local beds yielded both fine-grained, luminous white marble and distinctive blue-grey striated marble, enabling Aphrodisian masters to carve polychrome portrait statues, garland sarcophagi, and the two-story sculptural reliefs of the Sebasteion. Excavations begun by Kenan Erim in 1961 and continued by New York University and Oxford University uncovered an intact fourth-century CE Sculptor’s Workshop directly north of the Bouleuterion, complete with iron chisels, abrasive powders, unfinished mythological groups, and practice trial pieces.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-pam-1",
        source: "UNESCO World Heritage Centre",
        publication: "Hierapolis-Pamukkale (No. 485) & Aphrodisias (No. 1519) World Heritage Dossiers",
        year: "1988 / 2017",
        url: "https://whc.unesco.org/en/list/1519/",
      },
      {
        id: "cit-pam-2",
        source: "R.R.R. Smith & New York University Excavations at Aphrodisias",
        publication: "Aphrodisias Papers & The Sculptor's Workshop at Aphrodisias",
        year: "2016",
      },
    ],
  },
];

export function getJournalArticleBySlug(slug: string): JournalArticle | null {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug) || null;
}
